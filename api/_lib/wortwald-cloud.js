const crypto = require("node:crypto");
const { neon } = require("@neondatabase/serverless");

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const JSON_LIMIT_BYTES = 5 * 1024 * 1024;
const PASSWORD_MIN_LENGTH = 8;
const SESSION_ACTIVITY_WRITE_MS = 60 * 1000;
const TOMBSTONE_LIMIT = 500;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for the hosted Wortwald API.");
}

const database = neon(process.env.DATABASE_URL);

let schemaPromise = null;

function createEmptyState() {
  return {
    decks: [],
    cards: [],
    progress: {},
    sessions: [],
    preferences: {
      selectedDeckId: "all",
      dailyGoal: 12,
      deviceName: "My device",
    },
    tombstones: {
      decks: [],
      cards: [],
    },
  };
}

function clone(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function json(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let bytes = 0;
    let body = "";
    request.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > JSON_LIMIT_BYTES) {
        reject(new Error("Request body too large."));
        request.destroy();
        return;
      }
      body += chunk;
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });
    request.on("error", reject);
  });
}

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

function normalizeKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function splitTagField(value) {
  return String(value ?? "")
    .split(/[|,]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function withTimestamp(entity, fallback = new Date().toISOString()) {
  return {
    ...entity,
    createdAt: entity?.createdAt ?? fallback,
    updatedAt: entity?.updatedAt ?? fallback,
  };
}

function normalizeProgressEntry(progress) {
  return {
    repetitions: Number(progress?.repetitions ?? 0),
    intervalDays: Number(progress?.intervalDays ?? 0),
    ease: Number(progress?.ease ?? 2.5),
    stability: Number(progress?.stability ?? Math.max(0.4, progress?.intervalDays ?? 0.4)),
    difficulty: Number(progress?.difficulty ?? 5),
    dueAt: progress?.dueAt ?? null,
    lapses: Number(progress?.lapses ?? 0),
    lastReviewedAt: progress?.lastReviewedAt ?? null,
    lastScore: progress?.lastScore ?? null,
    updatedAt: progress?.updatedAt ?? progress?.lastReviewedAt ?? new Date().toISOString(),
    lastTypedScore: progress?.lastTypedScore ?? null,
    lastRecordingAt: progress?.lastRecordingAt ?? null,
  };
}

function normalizeDeckEntry(deck) {
  return withTimestamp({
    id: String(deck?.id ?? "").trim(),
    name: String(deck?.name ?? "").trim(),
    level: String(deck?.level ?? "A1").trim() || "A1",
    focus: String(deck?.focus ?? "").trim(),
    description: String(deck?.description ?? "").trim(),
  });
}

function inferPartOfSpeech(card) {
  const tags = Array.isArray(card?.tags) ? card.tags.map((tag) => normalizeKey(tag)) : splitTagField(card?.tags);
  if (card?.partOfSpeech) {
    return normalizeKey(card.partOfSpeech);
  }
  if (tags.includes("verb")) {
    return "verb";
  }
  if (tags.includes("adjective")) {
    return "adjective";
  }
  if (card?.article || card?.plural) {
    return "noun";
  }
  if (String(card?.term ?? "").includes(" ")) {
    return "phrase";
  }
  return "noun";
}

function normalizeVerbForms(forms) {
  return {
    auxiliary: String(forms?.auxiliary ?? "").trim(),
    present: String(forms?.present ?? "").trim(),
    preterite: String(forms?.preterite ?? "").trim(),
    participle: String(forms?.participle ?? "").trim(),
    imperative: String(forms?.imperative ?? "").trim(),
    usagePattern: String(forms?.usagePattern ?? "").trim(),
  };
}

function normalizeAdjectiveForms(forms) {
  return {
    comparative: String(forms?.comparative ?? "").trim(),
    superlative: String(forms?.superlative ?? "").trim(),
    usage: String(forms?.usage ?? "").trim(),
  };
}

function normalizeCardEntry(card) {
  return withTimestamp({
    id: String(card?.id ?? "").trim(),
    deckId: String(card?.deckId ?? "").trim(),
    partOfSpeech: inferPartOfSpeech(card),
    term: String(card?.term ?? "").trim(),
    translation: String(card?.translation ?? "").trim(),
    article: String(card?.article ?? "").trim(),
    plural: String(card?.plural ?? "").trim(),
    usagePattern: String(card?.usagePattern ?? card?.verbForms?.usagePattern ?? "").trim(),
    verbForms: normalizeVerbForms(card?.verbForms),
    adjectiveForms: normalizeAdjectiveForms(card?.adjectiveForms),
    level: String(card?.level ?? "A1").trim() || "A1",
    example: String(card?.example ?? "").trim(),
    exampleTranslation: String(card?.exampleTranslation ?? "").trim(),
    note: String(card?.note ?? "").trim(),
    tags: Array.isArray(card?.tags) ? card.tags : splitTagField(card?.tags),
  });
}

function normalizeTombstoneEntry(entry) {
  return {
    id: String(entry?.id ?? "").trim(),
    updatedAt: entry?.updatedAt ?? new Date().toISOString(),
  };
}

function normalizeTombstoneList(list) {
  return (Array.isArray(list) ? list : [])
    .map(normalizeTombstoneEntry)
    .filter((entry) => entry.id);
}

function normalizeReviewSession(entry) {
  const timestamp = entry?.timestamp ?? entry?.updatedAt ?? new Date().toISOString();
  return {
    id: String(entry?.id ?? `${entry?.cardId ?? "card"}:${timestamp}:${entry?.score ?? "good"}`).trim(),
    cardId: String(entry?.cardId ?? "").trim(),
    deckId: String(entry?.deckId ?? "").trim(),
    term: String(entry?.term ?? "").trim(),
    score: String(entry?.score ?? "good").trim(),
    timestamp,
  };
}

function normalizeState(rawState) {
  const empty = createEmptyState();
  const normalized = {
    ...empty,
    ...rawState,
    decks: Array.isArray(rawState?.decks) ? rawState.decks.map(normalizeDeckEntry).filter((deck) => deck.id) : [],
    cards: Array.isArray(rawState?.cards)
      ? rawState.cards.map(normalizeCardEntry).filter((card) => card.id && card.deckId && card.term)
      : [],
    progress: Object.fromEntries(
      Object.entries(rawState?.progress ?? {})
        .filter(([cardId]) => Boolean(cardId))
        .map(([cardId, progress]) => [cardId, normalizeProgressEntry(progress)]),
    ),
    sessions: Array.isArray(rawState?.sessions)
      ? rawState.sessions.map(normalizeReviewSession).filter((entry) => entry.cardId && entry.deckId)
      : [],
    preferences: {
      ...empty.preferences,
      ...(rawState?.preferences ?? {}),
      dailyGoal: Math.min(100, Math.max(1, Number(rawState?.preferences?.dailyGoal ?? empty.preferences.dailyGoal) || 12)),
    },
    tombstones: {
      decks: normalizeTombstoneList(rawState?.tombstones?.decks),
      cards: normalizeTombstoneList(rawState?.tombstones?.cards),
    },
  };

  normalized.preferences.selectedDeckId = String(normalized.preferences.selectedDeckId ?? "all");
  normalized.preferences.deviceName = String(normalized.preferences.deviceName ?? empty.preferences.deviceName).trim()
    || empty.preferences.deviceName;

  return normalized;
}

function entityTimestamp(entity, fallback = 0) {
  const candidate = entity?.updatedAt ?? entity?.lastReviewedAt ?? entity?.timestamp ?? entity?.createdAt;
  const timestamp = candidate ? new Date(candidate).getTime() : fallback;
  return Number.isFinite(timestamp) ? timestamp : fallback;
}

function mergeTagLists(left, right) {
  return [...new Set([...(left ?? []), ...(right ?? [])])];
}

function mergeTombstoneLists(left, right) {
  const map = new Map();
  [...(left ?? []), ...(right ?? [])].forEach((entry) => {
    if (!entry?.id) {
      return;
    }
    const normalized = normalizeTombstoneEntry(entry);
    const existing = map.get(normalized.id);
    if (!existing || entityTimestamp(normalized) >= entityTimestamp(existing)) {
      map.set(normalized.id, normalized);
    }
  });
  return [...map.values()]
    .sort((a, b) => entityTimestamp(b) - entityTimestamp(a))
    .slice(0, TOMBSTONE_LIMIT);
}

function applyTombstonesToState(rawState) {
  const state = normalizeState(rawState);
  const deckTombstones = new Map(state.tombstones.decks.map((entry) => [entry.id, entityTimestamp(entry)]));
  const cardTombstones = new Map(state.tombstones.cards.map((entry) => [entry.id, entityTimestamp(entry)]));

  state.decks = state.decks.filter((deck) => {
    const tombstoneTime = deckTombstones.get(deck.id);
    return !tombstoneTime || entityTimestamp(deck) > tombstoneTime;
  });

  const liveDeckIds = new Set(state.decks.map((deck) => deck.id));
  state.cards = state.cards.filter((card) => {
    if (!liveDeckIds.has(card.deckId)) {
      return false;
    }
    const tombstoneTime = cardTombstones.get(card.id);
    return !tombstoneTime || entityTimestamp(card) > tombstoneTime;
  });

  const liveCardIds = new Set(state.cards.map((card) => card.id));
  state.progress = Object.fromEntries(
    Object.entries(state.progress).filter(([cardId]) => liveCardIds.has(cardId)),
  );
  state.sessions = state.sessions
    .filter((entry) => liveCardIds.has(entry.cardId) && liveDeckIds.has(entry.deckId))
    .sort((left, right) => entityTimestamp(right) - entityTimestamp(left))
    .slice(0, 400);
  state.tombstones = {
    decks: state.tombstones.decks
      .filter((entry) => !liveDeckIds.has(entry.id))
      .sort((a, b) => entityTimestamp(b) - entityTimestamp(a))
      .slice(0, TOMBSTONE_LIMIT),
    cards: state.tombstones.cards
      .filter((entry) => !liveCardIds.has(entry.id))
      .sort((a, b) => entityTimestamp(b) - entityTimestamp(a))
      .slice(0, TOMBSTONE_LIMIT),
  };

  if (
    state.preferences.selectedDeckId !== "all"
    && !state.decks.some((deck) => deck.id === state.preferences.selectedDeckId)
  ) {
    state.preferences.selectedDeckId = state.decks[0]?.id ?? "all";
  }

  return state;
}

function mergeSyncStates(localRaw, incomingRaw) {
  const local = normalizeState(localRaw);
  const incoming = normalizeState(incomingRaw);
  const merged = clone(local);

  merged.tombstones = {
    decks: mergeTombstoneLists(local.tombstones.decks, incoming.tombstones.decks),
    cards: mergeTombstoneLists(local.tombstones.cards, incoming.tombstones.cards),
  };

  const deckMap = new Map(merged.decks.map((deck) => [deck.id, deck]));
  const deckNameMap = new Map(merged.decks.map((deck) => [normalizeKey(deck.name), deck.id]));
  const deckIdRemap = new Map();

  incoming.decks.forEach((deck) => {
    const existingDeck = deckMap.get(deck.id) ?? deckMap.get(deckNameMap.get(normalizeKey(deck.name)));
    if (!existingDeck) {
      merged.decks.push(deck);
      deckMap.set(deck.id, deck);
      deckNameMap.set(normalizeKey(deck.name), deck.id);
      deckIdRemap.set(deck.id, deck.id);
      return;
    }

    const nextDeck =
      entityTimestamp(deck) >= entityTimestamp(existingDeck)
        ? {
            ...existingDeck,
            ...deck,
            id: existingDeck.id,
            createdAt: existingDeck.createdAt ?? deck.createdAt,
          }
        : existingDeck;

    merged.decks = merged.decks.map((entry) => (entry.id === existingDeck.id ? nextDeck : entry));
    deckMap.set(existingDeck.id, nextDeck);
    deckNameMap.set(normalizeKey(nextDeck.name), existingDeck.id);
    deckIdRemap.set(deck.id, existingDeck.id);
  });

  const cardSignatureMap = new Map(
    merged.cards.map((card) => [`${card.deckId}::${normalizeKey(card.term)}::${normalizeKey(card.translation)}`, card.id]),
  );
  const cardIdRemap = new Map();

  incoming.cards.forEach((card) => {
    const mappedDeckId = deckIdRemap.get(card.deckId) ?? card.deckId;
    const candidateCard = { ...card, deckId: mappedDeckId };
    const signature = `${mappedDeckId}::${normalizeKey(candidateCard.term)}::${normalizeKey(candidateCard.translation)}`;
    const existingCard =
      merged.cards.find((entry) => entry.id === candidateCard.id)
      ?? merged.cards.find((entry) => entry.id === cardSignatureMap.get(signature));

    if (!existingCard) {
      merged.cards.push(candidateCard);
      cardSignatureMap.set(signature, candidateCard.id);
      cardIdRemap.set(card.id, candidateCard.id);
      return;
    }

    const nextCard =
      entityTimestamp(candidateCard) >= entityTimestamp(existingCard)
        ? {
            ...existingCard,
            ...candidateCard,
            id: existingCard.id,
            deckId: existingCard.deckId,
            tags: mergeTagLists(existingCard.tags, candidateCard.tags),
            createdAt: existingCard.createdAt ?? candidateCard.createdAt,
          }
        : {
            ...existingCard,
            tags: mergeTagLists(existingCard.tags, candidateCard.tags),
          };

    merged.cards = merged.cards.map((entry) => (entry.id === existingCard.id ? nextCard : entry));
    cardSignatureMap.set(signature, existingCard.id);
    cardIdRemap.set(card.id, existingCard.id);
  });

  Object.entries(incoming.progress).forEach(([cardId, progress]) => {
    const mappedCardId = cardIdRemap.get(cardId) ?? cardId;
    const existing = merged.progress[mappedCardId] ? normalizeProgressEntry(merged.progress[mappedCardId]) : null;
    const candidate = normalizeProgressEntry(progress);
    if (!existing || entityTimestamp(candidate) >= entityTimestamp(existing)) {
      merged.progress[mappedCardId] = {
        ...existing,
        ...candidate,
        updatedAt: candidate.updatedAt,
      };
      return;
    }

    merged.progress[mappedCardId] = {
      ...existing,
      lapses: Math.max(existing.lapses ?? 0, candidate.lapses ?? 0),
      repetitions: Math.max(existing.repetitions ?? 0, candidate.repetitions ?? 0),
    };
  });

  const sessionSignatures = new Set(
    merged.sessions.map((entry) => entry.id ?? `${entry.cardId}:${entry.timestamp}:${entry.score}`),
  );
  incoming.sessions.forEach((entry) => {
    const mappedCardId = cardIdRemap.get(entry.cardId) ?? entry.cardId;
    const mappedDeckId = deckIdRemap.get(entry.deckId) ?? entry.deckId;
    const normalizedEntry = normalizeReviewSession({
      ...entry,
      cardId: mappedCardId,
      deckId: mappedDeckId,
    });
    const signature = normalizedEntry.id;
    if (sessionSignatures.has(signature)) {
      return;
    }
    merged.sessions.push(normalizedEntry);
    sessionSignatures.add(signature);
  });

  merged.preferences = {
    ...merged.preferences,
    ...incoming.preferences,
  };

  return applyTombstonesToState(merged);
}

function validateState(state) {
  if (!state || typeof state !== "object") {
    throw new Error("State payload is required.");
  }
  if (!Array.isArray(state.decks) || !Array.isArray(state.cards)) {
    throw new Error("State payload must contain decks and cards arrays.");
  }
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash: derived };
}

function verifyPassword(password, account) {
  const derived = crypto.scryptSync(password, account.passwordSalt, 64).toString("hex");
  const left = Buffer.from(derived, "hex");
  const right = Buffer.from(account.passwordHash, "hex");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function generateToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function sanitizeAccount(account) {
  return {
    id: account.id,
    email: account.email,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    passwordUpdatedAt: account.passwordUpdatedAt,
    stateUpdatedAt: account.stateUpdatedAt ?? null,
  };
}

function sanitizeSession(session, currentSessionId = null) {
  return {
    id: session.id,
    deviceName: session.deviceName,
    createdAt: session.createdAt,
    lastUsedAt: session.lastUsedAt,
    expiresAt: session.expiresAt,
    isCurrent: currentSessionId ? session.id === currentSessionId : false,
  };
}

function parseStatePayload(payload) {
  if (!payload) {
    return null;
  }
  try {
    return applyTombstonesToState(JSON.parse(payload));
  } catch {
    return null;
  }
}

function mapAccountRow(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    email: row.email,
    passwordSalt: row.password_salt,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    passwordUpdatedAt: row.password_updated_at,
    stateUpdatedAt: row.state_updated_at,
    statePayload: row.state_payload ?? null,
  };
}

function mapSessionRow(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    accountId: row.account_id,
    deviceName: row.device_name,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at,
    expiresAt: row.expires_at,
    tokenHash: row.token_hash,
  };
}

async function ensureSchema() {
  if (schemaPromise) {
    return schemaPromise;
  }

  schemaPromise = (async () => {
    await database.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_salt TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        password_updated_at TIMESTAMPTZ NOT NULL,
        state_payload TEXT,
        state_updated_at TIMESTAMPTZ
      )
    `);
    await database.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        device_name TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL,
        last_used_at TIMESTAMPTZ NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL
      )
    `);
    await database.query("CREATE INDEX IF NOT EXISTS sessions_account_idx ON sessions(account_id)");
    await database.query("CREATE INDEX IF NOT EXISTS sessions_expires_idx ON sessions(expires_at)");
  })().catch((error) => {
    schemaPromise = null;
    throw error;
  });

  return schemaPromise;
}

async function fetchAccountByEmail(email) {
  const rows = await database.query(
    "SELECT * FROM accounts WHERE email = $1 LIMIT 1",
    [email],
  );
  return mapAccountRow(rows[0]);
}

async function fetchAccountById(id) {
  const rows = await database.query(
    "SELECT * FROM accounts WHERE id = $1 LIMIT 1",
    [id],
  );
  return mapAccountRow(rows[0]);
}

async function cleanupExpiredSessions() {
  await database.query(
    "DELETE FROM sessions WHERE expires_at <= $1",
    [new Date().toISOString()],
  );
}

async function createSession(accountId, deviceName = "Unknown device") {
  const token = generateToken();
  const now = new Date().toISOString();
  const session = {
    id: crypto.randomUUID(),
    accountId,
    deviceName,
    createdAt: now,
    lastUsedAt: now,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  };

  await database.query(
    [
      "INSERT INTO sessions",
      "(id, account_id, token_hash, device_name, created_at, last_used_at, expires_at)",
      "VALUES ($1, $2, $3, $4, $5, $6, $7)",
    ].join(" "),
    [
      session.id,
      session.accountId,
      hashToken(token),
      session.deviceName,
      session.createdAt,
      session.lastUsedAt,
      session.expiresAt,
    ],
  );

  return { token, session };
}

async function listAccountSessions(accountId, currentSessionId = null) {
  await cleanupExpiredSessions();
  const rows = await database.query(
    "SELECT * FROM sessions WHERE account_id = $1 ORDER BY last_used_at DESC, created_at DESC",
    [accountId],
  );
  return rows.map((row) => sanitizeSession(mapSessionRow(row), currentSessionId));
}

function getBearerToken(request) {
  const header = request.headers.authorization ?? "";
  if (!header.startsWith("Bearer ")) {
    return "";
  }
  return header.slice("Bearer ".length).trim();
}

async function authenticate(request) {
  await cleanupExpiredSessions();
  const token = getBearerToken(request);
  if (!token) {
    return { account: null, session: null };
  }

  const sessionRows = await database.query(
    "SELECT * FROM sessions WHERE token_hash = $1 AND expires_at > $2 LIMIT 1",
    [hashToken(token), new Date().toISOString()],
  );
  const session = mapSessionRow(sessionRows[0]);
  if (!session) {
    return { account: null, session: null };
  }

  const account = await fetchAccountById(session.accountId);
  if (!account) {
    await database.query("DELETE FROM sessions WHERE id = $1", [session.id]);
    return { account: null, session: null };
  }

  if (Date.now() - new Date(session.lastUsedAt).getTime() > SESSION_ACTIVITY_WRITE_MS) {
    const now = new Date().toISOString();
    await database.query("UPDATE sessions SET last_used_at = $1 WHERE id = $2", [now, session.id]);
    session.lastUsedAt = now;
  }

  return { account, session };
}

async function storeMergedState(accountId, state, updatedAt) {
  const normalized = applyTombstonesToState(state);
  await database.query(
    "UPDATE accounts SET state_payload = $1, state_updated_at = $2, updated_at = $2 WHERE id = $3",
    [JSON.stringify(normalized), updatedAt, accountId],
  );
  return normalized;
}

async function requireAuth(request, response) {
  const result = await authenticate(request);
  if (!result.account || !result.session) {
    json(response, 401, { error: "Authentication required." });
    return null;
  }
  return result;
}

async function handleHealth(request, response) {
  await ensureSchema();
  json(response, 200, {
    ok: true,
    storage: "neon",
    region: process.env.VERCEL_REGION ?? null,
  });
}

async function handleRegister(request, response) {
  await ensureSchema();
  await cleanupExpiredSessions();

  const body = await readJsonBody(request);
  const email = normalizeEmail(body.email);
  const password = String(body.password ?? "");
  const deviceName = String(body.deviceName ?? "Unknown device").trim() || "Unknown device";

  if (!email.includes("@")) {
    json(response, 400, { error: "Enter a valid email address." });
    return;
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    json(response, 400, { error: `Use a password with at least ${PASSWORD_MIN_LENGTH} characters.` });
    return;
  }
  if (await fetchAccountByEmail(email)) {
    json(response, 409, { error: "An account with that email already exists." });
    return;
  }

  const now = new Date().toISOString();
  const passwordRecord = hashPassword(password);
  const account = {
    id: crypto.randomUUID(),
    email,
    passwordSalt: passwordRecord.salt,
    passwordHash: passwordRecord.hash,
    createdAt: now,
    updatedAt: now,
    passwordUpdatedAt: now,
    stateUpdatedAt: null,
    statePayload: JSON.stringify(createEmptyState()),
  };

  await database.query(
    [
      "INSERT INTO accounts",
      "(id, email, password_salt, password_hash, created_at, updated_at, password_updated_at, state_payload, state_updated_at)",
      "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    ].join(" "),
    [
      account.id,
      account.email,
      account.passwordSalt,
      account.passwordHash,
      account.createdAt,
      account.updatedAt,
      account.passwordUpdatedAt,
      account.statePayload,
      account.stateUpdatedAt,
    ],
  );

  const created = await createSession(account.id, deviceName);
  json(response, 201, {
    token: created.token,
    account: sanitizeAccount(account),
    session: sanitizeSession(created.session, created.session.id),
    updatedAt: account.stateUpdatedAt,
  });
}

async function handleLogin(request, response) {
  await ensureSchema();
  await cleanupExpiredSessions();

  const body = await readJsonBody(request);
  const email = normalizeEmail(body.email);
  const password = String(body.password ?? "");
  const deviceName = String(body.deviceName ?? "Unknown device").trim() || "Unknown device";
  const account = await fetchAccountByEmail(email);

  if (!account || !verifyPassword(password, account)) {
    json(response, 401, { error: "Invalid email or password." });
    return;
  }

  const created = await createSession(account.id, deviceName);
  json(response, 200, {
    token: created.token,
    account: sanitizeAccount(account),
    session: sanitizeSession(created.session, created.session.id),
    updatedAt: account.stateUpdatedAt,
  });
}

async function handleLogout(request, response) {
  await ensureSchema();
  await cleanupExpiredSessions();

  const token = getBearerToken(request);
  if (token) {
    await database.query("DELETE FROM sessions WHERE token_hash = $1", [hashToken(token)]);
  }
  json(response, 200, { ok: true });
}

async function handleMe(request, response) {
  await ensureSchema();

  const auth = await requireAuth(request, response);
  if (!auth) {
    return;
  }

  const sessions = await listAccountSessions(auth.account.id, auth.session.id);
  json(response, 200, {
    account: sanitizeAccount(auth.account),
    session: sanitizeSession(auth.session, auth.session.id),
    sessionCount: sessions.length,
    updatedAt: auth.account.stateUpdatedAt,
  });
}

async function handleListSessions(request, response) {
  await ensureSchema();

  const auth = await requireAuth(request, response);
  if (!auth) {
    return;
  }

  const sessions = await listAccountSessions(auth.account.id, auth.session.id);
  json(response, 200, {
    currentSessionId: auth.session.id,
    sessions,
  });
}

async function handleDeleteSession(request, response, sessionId) {
  await ensureSchema();

  const auth = await requireAuth(request, response);
  if (!auth) {
    return;
  }

  const rows = await database.query(
    "SELECT * FROM sessions WHERE id = $1 AND account_id = $2 LIMIT 1",
    [sessionId, auth.account.id],
  );
  const target = mapSessionRow(rows[0]);
  if (!target) {
    json(response, 404, { error: "Session not found." });
    return;
  }

  await database.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
  json(response, 200, {
    ok: true,
    revokedSessionId: sessionId,
    currentSessionRevoked: sessionId === auth.session.id,
  });
}

async function handleChangePassword(request, response) {
  await ensureSchema();

  const auth = await requireAuth(request, response);
  if (!auth) {
    return;
  }

  const body = await readJsonBody(request);
  const currentPassword = String(body.currentPassword ?? "");
  const nextPassword = String(body.newPassword ?? "");

  if (!verifyPassword(currentPassword, auth.account)) {
    json(response, 401, { error: "Current password is incorrect." });
    return;
  }
  if (nextPassword.length < PASSWORD_MIN_LENGTH) {
    json(response, 400, { error: `Use a password with at least ${PASSWORD_MIN_LENGTH} characters.` });
    return;
  }
  if (currentPassword === nextPassword) {
    json(response, 400, { error: "Choose a new password that is different from the current one." });
    return;
  }

  const passwordRecord = hashPassword(nextPassword);
  const now = new Date().toISOString();

  await database.query(
    [
      "UPDATE accounts",
      "SET password_salt = $1, password_hash = $2, password_updated_at = $3, updated_at = $3",
      "WHERE id = $4",
    ].join(" "),
    [passwordRecord.salt, passwordRecord.hash, now, auth.account.id],
  );

  const deleted = await database.query(
    "DELETE FROM sessions WHERE account_id = $1 AND id != $2 RETURNING id",
    [auth.account.id, auth.session.id],
  );

  const refreshed = await fetchAccountById(auth.account.id);
  json(response, 200, {
    ok: true,
    account: sanitizeAccount(refreshed),
    revokedSessionCount: deleted.length,
  });
}

async function handleGetSync(request, response) {
  await ensureSchema();

  const auth = await requireAuth(request, response);
  if (!auth) {
    return;
  }

  json(response, 200, {
    state: parseStatePayload(auth.account.statePayload),
    updatedAt: auth.account.stateUpdatedAt,
    storage: "neon",
  });
}

async function handlePutSync(request, response) {
  await ensureSchema();

  const auth = await requireAuth(request, response);
  if (!auth) {
    return;
  }

  const body = await readJsonBody(request);
  validateState(body.state);

  const remoteState = parseStatePayload(auth.account.statePayload) ?? createEmptyState();
  const mergedState = mergeSyncStates(remoteState, body.state);
  const updatedAt = new Date().toISOString();
  const storedState = await storeMergedState(auth.account.id, mergedState, updatedAt);

  json(response, 200, {
    ok: true,
    updatedAt,
    state: storedState,
    storage: "neon",
  });
}

function extractTrailingPath(request) {
  const url = new URL(request.url, "http://localhost");
  return url.pathname;
}

async function safeHandle(response, work) {
  try {
    await work();
  } catch (error) {
    console.error(error);
    json(response, 500, { error: error.message || "Unexpected server error." });
  }
}

module.exports = {
  safeHandle,
  handleHealth,
  handleRegister,
  handleLogin,
  handleLogout,
  handleMe,
  handleListSessions,
  handleDeleteSession,
  handleChangePassword,
  handleGetSync,
  handlePutSync,
  extractTrailingPath,
};
