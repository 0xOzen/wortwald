const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, "data");
const SQLITE_PATH = path.join(DATA_DIR, "wortwald.sqlite");
const LEGACY_JSON_PATH = path.join(DATA_DIR, "database.json");
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const JSON_LIMIT_BYTES = 5 * 1024 * 1024;
const PASSWORD_MIN_LENGTH = 8;
const SESSION_ACTIVITY_WRITE_MS = 60 * 1000;
const TOMBSTONE_LIMIT = 500;
const TARGET_LANGUAGE_KEYS = ["en", "tr"];
const VERB_PERSON_KEYS = ["ich", "du", "er", "wir", "ihr", "sie"];

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

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
      targetLanguage: "en",
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

function text(response, statusCode, message) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(message);
}

function notFound(response) {
  text(response, 404, "Not found");
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

function normalizeTargetLanguage(value) {
  return TARGET_LANGUAGE_KEYS.includes(value) ? value : "en";
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

function normalizeTranslations(card) {
  return {
    en: String(card?.translationEn ?? card?.translation ?? "").trim(),
    tr: String(card?.translationTr ?? "").trim(),
  };
}

function parseVerbConjugation(present) {
  const conjugation = Object.fromEntries(VERB_PERSON_KEYS.map((key) => [key, ""]));
  const fragments = String(present ?? "")
    .split(/[·•|]/)
    .map((fragment) => fragment.trim())
    .filter(Boolean);

  const prefixes = [
    { key: "ich", labels: ["ich "] },
    { key: "du", labels: ["du "] },
    { key: "er", labels: ["er/sie/es ", "er "] },
    { key: "wir", labels: ["wir "] },
    { key: "ihr", labels: ["ihr "] },
    { key: "sie", labels: ["sie/Sie ", "sie "] },
  ];

  fragments.forEach((fragment) => {
    const lowerFragment = fragment.toLowerCase();
    prefixes.some(({ key, labels }) => {
      const matchedLabel = labels.find((label) => lowerFragment.startsWith(label.toLowerCase()));
      if (!matchedLabel) {
        return false;
      }
      conjugation[key] = fragment.slice(matchedLabel.length).trim();
      return true;
    });
  });

  return conjugation;
}

function normalizeVerbConjugation(conjugation, fallbackPresent = "") {
  const source = conjugation && typeof conjugation === "object" ? conjugation : {};
  const parsed = parseVerbConjugation(fallbackPresent);
  return Object.fromEntries(
    VERB_PERSON_KEYS.map((key) => [key, String(source[key] ?? parsed[key] ?? "").trim()]),
  );
}

function formatVerbConjugation(conjugation) {
  const labels = {
    ich: "ich",
    du: "du",
    er: "er/sie/es",
    wir: "wir",
    ihr: "ihr",
    sie: "sie/Sie",
  };
  return VERB_PERSON_KEYS.map((key) => {
    const value = String(conjugation?.[key] ?? "").trim();
    return value ? `${labels[key]} ${value}` : "";
  })
    .filter(Boolean)
    .join(" · ");
}

function normalizeVerbForms(forms) {
  const conjugation = normalizeVerbConjugation(forms?.conjugation, forms?.present);
  return {
    auxiliary: String(forms?.auxiliary ?? "").trim(),
    present: String(forms?.present ?? "").trim() || formatVerbConjugation(conjugation),
    conjugation,
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
  const translations = normalizeTranslations(card);
  return withTimestamp({
    id: String(card?.id ?? "").trim(),
    deckId: String(card?.deckId ?? "").trim(),
    partOfSpeech: inferPartOfSpeech(card),
    term: String(card?.term ?? "").trim(),
    translation: translations.en || translations.tr,
    translationEn: translations.en,
    translationTr: translations.tr,
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
      targetLanguage: normalizeTargetLanguage(rawState?.preferences?.targetLanguage ?? empty.preferences.targetLanguage),
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

function getBearerToken(request) {
  const header = request.headers.authorization ?? "";
  if (!header.startsWith("Bearer ")) {
    return "";
  }
  return header.slice("Bearer ".length).trim();
}

function parsePayload(row) {
  if (!row?.payload) {
    return null;
  }
  try {
    return JSON.parse(row.payload);
  } catch {
    return null;
  }
}

function runTransaction(db, work) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = work();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    try {
      db.exec("ROLLBACK");
    } catch {
      // Ignore rollback errors on already-failed transactions.
    }
    throw error;
  }
}

function withTransaction(work) {
  return runTransaction(database, work);
}

function replaceAccountStateRowsUsing(db, accountId, state, updatedAt) {
  const normalized = applyTombstonesToState(state);

  db.prepare("DELETE FROM deck_records WHERE account_id = ?").run(accountId);
  db.prepare("DELETE FROM card_records WHERE account_id = ?").run(accountId);
  db.prepare("DELETE FROM progress_records WHERE account_id = ?").run(accountId);
  db.prepare("DELETE FROM review_records WHERE account_id = ?").run(accountId);
  db.prepare("DELETE FROM preference_records WHERE account_id = ?").run(accountId);
  db.prepare("DELETE FROM tombstone_records WHERE account_id = ?").run(accountId);

  const insertDeck = db.prepare(
    "INSERT INTO deck_records (account_id, deck_id, payload, updated_at) VALUES (?, ?, ?, ?)",
  );
  normalized.decks.forEach((deck) => {
    insertDeck.run(accountId, deck.id, JSON.stringify(deck), deck.updatedAt ?? updatedAt);
  });

  const insertCard = db.prepare(
    "INSERT INTO card_records (account_id, card_id, deck_id, payload, updated_at) VALUES (?, ?, ?, ?, ?)",
  );
  normalized.cards.forEach((card) => {
    insertCard.run(accountId, card.id, card.deckId, JSON.stringify(card), card.updatedAt ?? updatedAt);
  });

  const insertProgress = db.prepare(
    "INSERT INTO progress_records (account_id, card_id, payload, updated_at) VALUES (?, ?, ?, ?)",
  );
  Object.entries(normalized.progress).forEach(([cardId, progress]) => {
    insertProgress.run(accountId, cardId, JSON.stringify(progress), progress.updatedAt ?? updatedAt);
  });

  const insertReview = db.prepare(
    "INSERT INTO review_records (account_id, review_id, payload, updated_at) VALUES (?, ?, ?, ?)",
  );
  normalized.sessions.forEach((entry) => {
    insertReview.run(accountId, entry.id, JSON.stringify(entry), entry.timestamp ?? updatedAt);
  });

  const insertPreference = db.prepare(
    "INSERT INTO preference_records (account_id, payload, updated_at) VALUES (?, ?, ?)",
  );
  insertPreference.run(accountId, JSON.stringify(normalized.preferences), updatedAt);

  const insertTombstone = db.prepare(
    "INSERT INTO tombstone_records (account_id, entity_type, entity_id, payload, updated_at) VALUES (?, ?, ?, ?, ?)",
  );
  normalized.tombstones.decks.forEach((entry) => {
    insertTombstone.run(accountId, "deck", entry.id, JSON.stringify(entry), entry.updatedAt ?? updatedAt);
  });
  normalized.tombstones.cards.forEach((entry) => {
    insertTombstone.run(accountId, "card", entry.id, JSON.stringify(entry), entry.updatedAt ?? updatedAt);
  });

  db.prepare(
    "UPDATE accounts SET state_updated_at = ?, updated_at = ? WHERE id = ?",
  ).run(updatedAt, updatedAt, accountId);

  return normalized;
}

function replaceAccountStateRows(accountId, state, updatedAt) {
  return replaceAccountStateRowsUsing(database, accountId, state, updatedAt);
}

function writeAccountState(accountId, state, updatedAt = new Date().toISOString()) {
  return withTransaction(() => replaceAccountStateRows(accountId, state, updatedAt));
}

function loadAccountState(accountId) {
  const deckRows = database.prepare(
    "SELECT payload FROM deck_records WHERE account_id = ? ORDER BY updated_at DESC",
  ).all(accountId);
  const cardRows = database.prepare(
    "SELECT payload FROM card_records WHERE account_id = ? ORDER BY updated_at DESC",
  ).all(accountId);
  const progressRows = database.prepare(
    "SELECT card_id, payload FROM progress_records WHERE account_id = ? ORDER BY updated_at DESC",
  ).all(accountId);
  const reviewRows = database.prepare(
    "SELECT payload FROM review_records WHERE account_id = ? ORDER BY updated_at DESC",
  ).all(accountId);
  const preferenceRow = database.prepare(
    "SELECT payload FROM preference_records WHERE account_id = ?",
  ).get(accountId);
  const tombstoneRows = database.prepare(
    "SELECT entity_type, payload FROM tombstone_records WHERE account_id = ? ORDER BY updated_at DESC",
  ).all(accountId);

  if (
    deckRows.length === 0
    && cardRows.length === 0
    && progressRows.length === 0
    && reviewRows.length === 0
    && !preferenceRow
    && tombstoneRows.length === 0
  ) {
    return null;
  }

  const state = createEmptyState();
  state.decks = deckRows.map(parsePayload).filter(Boolean);
  state.cards = cardRows.map(parsePayload).filter(Boolean);
  state.progress = Object.fromEntries(
    progressRows
      .map((row) => [row.card_id, parsePayload(row)])
      .filter((entry) => Boolean(entry[0]) && Boolean(entry[1])),
  );
  state.sessions = reviewRows.map(parsePayload).filter(Boolean);
  state.preferences = parsePayload(preferenceRow) ?? state.preferences;
  state.tombstones = {
    decks: tombstoneRows.filter((row) => row.entity_type === "deck").map(parsePayload).filter(Boolean),
    cards: tombstoneRows.filter((row) => row.entity_type === "card").map(parsePayload).filter(Boolean),
  };

  return applyTombstonesToState(state);
}

function fetchAccountByEmail(email) {
  const row = database.prepare("SELECT * FROM accounts WHERE email = ?").get(email);
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
  };
}

function fetchAccountById(id) {
  const row = database.prepare("SELECT * FROM accounts WHERE id = ?").get(id);
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
  };
}

function createSession(accountId, deviceName = "Unknown device") {
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
  database.prepare(
    [
      "INSERT INTO sessions",
      "(id, account_id, token_hash, device_name, created_at, last_used_at, expires_at)",
      "VALUES (?, ?, ?, ?, ?, ?, ?)",
    ].join(" "),
  ).run(
    session.id,
    session.accountId,
    hashToken(token),
    session.deviceName,
    session.createdAt,
    session.lastUsedAt,
    session.expiresAt,
  );
  return { token, session };
}

function cleanupExpiredSessions() {
  database.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(new Date().toISOString());
}

function listAccountSessions(accountId, currentSessionId = null) {
  cleanupExpiredSessions();
  const rows = database.prepare(
    "SELECT * FROM sessions WHERE account_id = ? ORDER BY last_used_at DESC, created_at DESC",
  ).all(accountId);
  return rows.map((row) =>
    sanitizeSession(
      {
        id: row.id,
        deviceName: row.device_name,
        createdAt: row.created_at,
        lastUsedAt: row.last_used_at,
        expiresAt: row.expires_at,
      },
      currentSessionId,
    ),
  );
}

function authenticate(request) {
  cleanupExpiredSessions();
  const token = getBearerToken(request);
  if (!token) {
    return { account: null, session: null };
  }

  const row = database.prepare(
    "SELECT * FROM sessions WHERE token_hash = ? AND expires_at > ?",
  ).get(hashToken(token), new Date().toISOString());
  if (!row) {
    return { account: null, session: null };
  }

  const account = fetchAccountById(row.account_id);
  if (!account) {
    database.prepare("DELETE FROM sessions WHERE id = ?").run(row.id);
    return { account: null, session: null };
  }

  const session = {
    id: row.id,
    accountId: row.account_id,
    deviceName: row.device_name,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at,
    expiresAt: row.expires_at,
  };

  if (Date.now() - new Date(session.lastUsedAt).getTime() > SESSION_ACTIVITY_WRITE_MS) {
    const now = new Date().toISOString();
    database.prepare("UPDATE sessions SET last_used_at = ? WHERE id = ?").run(now, session.id);
    session.lastUsedAt = now;
  }

  return { account, session };
}

function migrateLegacyJsonIfNeeded(db) {
  if (!fs.existsSync(LEGACY_JSON_PATH)) {
    return;
  }

  const countRow = db.prepare("SELECT COUNT(*) AS count FROM accounts").get();
  if (Number(countRow?.count ?? 0) > 0) {
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(LEGACY_JSON_PATH, "utf8"));
  } catch (error) {
    console.warn("Skipping legacy JSON migration due to parse error.", error);
    return;
  }

  const accounts = Array.isArray(parsed?.accounts) ? parsed.accounts : [];
  const sessions = Array.isArray(parsed?.sessions) ? parsed.sessions : [];
  if (accounts.length === 0 && sessions.length === 0) {
    return;
  }

  const now = new Date().toISOString();
  runTransaction(db, () => {
    const insertAccount = db.prepare(
      [
        "INSERT INTO accounts",
        "(id, email, password_salt, password_hash, created_at, updated_at, password_updated_at, state_updated_at)",
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      ].join(" "),
    );
    accounts.forEach((account) => {
      const accountId = account.id ?? crypto.randomUUID();
      insertAccount.run(
        accountId,
        normalizeEmail(account.email),
        account.passwordSalt,
        account.passwordHash,
        account.createdAt ?? now,
        account.updatedAt ?? now,
        account.updatedAt ?? now,
        account.stateUpdatedAt ?? account.updatedAt ?? null,
      );
      replaceAccountStateRowsUsing(
        db,
        accountId,
        account.state ?? createEmptyState(),
        account.stateUpdatedAt ?? account.updatedAt ?? now,
      );
    });

    const insertSession = db.prepare(
      [
        "INSERT INTO sessions",
        "(id, account_id, token_hash, device_name, created_at, last_used_at, expires_at)",
        "VALUES (?, ?, ?, ?, ?, ?, ?)",
      ].join(" "),
    );
    sessions.forEach((session) => {
      insertSession.run(
        session.id ?? crypto.randomUUID(),
        session.accountId,
        session.tokenHash,
        session.deviceName ?? "Unknown device",
        session.createdAt ?? now,
        session.lastUsedAt ?? session.createdAt ?? now,
        session.expiresAt ?? new Date(Date.now() + SESSION_TTL_MS).toISOString(),
      );
    });
  });

  const backupPath = path.join(
    DATA_DIR,
    `database.json.migrated.${new Date().toISOString().replaceAll(":", "-")}.bak`,
  );
  try {
    fs.renameSync(LEGACY_JSON_PATH, backupPath);
  } catch (error) {
    console.warn("Legacy JSON migrated but backup rename failed.", error);
  }
}

function openDatabase() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new DatabaseSync(SQLITE_PATH);
  db.enableDefensive(true);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      password_updated_at TEXT NOT NULL,
      state_updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      device_name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_used_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS deck_records (
      account_id TEXT NOT NULL,
      deck_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (account_id, deck_id),
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS card_records (
      account_id TEXT NOT NULL,
      card_id TEXT NOT NULL,
      deck_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (account_id, card_id),
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS progress_records (
      account_id TEXT NOT NULL,
      card_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (account_id, card_id),
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS review_records (
      account_id TEXT NOT NULL,
      review_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (account_id, review_id),
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS preference_records (
      account_id TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tombstone_records (
      account_id TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (account_id, entity_type, entity_id),
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS sessions_account_idx ON sessions(account_id);
    CREATE INDEX IF NOT EXISTS sessions_expires_idx ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS cards_account_deck_idx ON card_records(account_id, deck_id);
    CREATE INDEX IF NOT EXISTS tombstones_account_type_idx ON tombstone_records(account_id, entity_type);
  `);
  migrateLegacyJsonIfNeeded(db);
  return db;
}

const database = openDatabase();

async function handleRegister(request, response) {
  cleanupExpiredSessions();
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
  if (fetchAccountByEmail(email)) {
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
  };

  let token = "";
  let session = null;
  withTransaction(() => {
    database.prepare(
      [
        "INSERT INTO accounts",
        "(id, email, password_salt, password_hash, created_at, updated_at, password_updated_at, state_updated_at)",
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      ].join(" "),
    ).run(
      account.id,
      account.email,
      account.passwordSalt,
      account.passwordHash,
      account.createdAt,
      account.updatedAt,
      account.passwordUpdatedAt,
      account.stateUpdatedAt,
    );
    const created = createSession(account.id, deviceName);
    token = created.token;
    session = created.session;
  });

  json(response, 201, {
    token,
    account: sanitizeAccount(account),
    session: sanitizeSession(session, session.id),
    updatedAt: account.stateUpdatedAt,
  });
}

async function handleLogin(request, response) {
  cleanupExpiredSessions();
  const body = await readJsonBody(request);
  const email = normalizeEmail(body.email);
  const password = String(body.password ?? "");
  const deviceName = String(body.deviceName ?? "Unknown device").trim() || "Unknown device";
  const account = fetchAccountByEmail(email);

  if (!account || !verifyPassword(password, account)) {
    json(response, 401, { error: "Invalid email or password." });
    return;
  }

  const created = createSession(account.id, deviceName);
  json(response, 200, {
    token: created.token,
    account: sanitizeAccount(account),
    session: sanitizeSession(created.session, created.session.id),
    updatedAt: account.stateUpdatedAt,
  });
}

function handleLogout(request, response) {
  cleanupExpiredSessions();
  const token = getBearerToken(request);
  if (token) {
    database.prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashToken(token));
  }
  json(response, 200, { ok: true });
}

function handleMe(request, response) {
  const { account, session } = authenticate(request);
  if (!account || !session) {
    json(response, 401, { error: "Authentication required." });
    return;
  }

  const sessions = listAccountSessions(account.id, session.id);
  json(response, 200, {
    account: sanitizeAccount(account),
    session: sanitizeSession(session, session.id),
    sessionCount: sessions.length,
    updatedAt: account.stateUpdatedAt,
  });
}

function handleListSessions(request, response) {
  const { account, session } = authenticate(request);
  if (!account || !session) {
    json(response, 401, { error: "Authentication required." });
    return;
  }

  const sessions = listAccountSessions(account.id, session.id);
  json(response, 200, {
    currentSessionId: session.id,
    sessions,
  });
}

function handleDeleteSession(request, response, sessionId) {
  const { account, session } = authenticate(request);
  if (!account || !session) {
    json(response, 401, { error: "Authentication required." });
    return;
  }

  const target = database.prepare(
    "SELECT * FROM sessions WHERE id = ? AND account_id = ?",
  ).get(sessionId, account.id);
  if (!target) {
    json(response, 404, { error: "Session not found." });
    return;
  }

  database.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
  json(response, 200, {
    ok: true,
    revokedSessionId: sessionId,
    currentSessionRevoked: sessionId === session.id,
  });
}

async function handleChangePassword(request, response) {
  const { account, session } = authenticate(request);
  if (!account || !session) {
    json(response, 401, { error: "Authentication required." });
    return;
  }

  const body = await readJsonBody(request);
  const currentPassword = String(body.currentPassword ?? "");
  const nextPassword = String(body.newPassword ?? "");

  if (!verifyPassword(currentPassword, account)) {
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
  let revokedSessionCount = 0;
  withTransaction(() => {
    database.prepare(
      [
        "UPDATE accounts",
        "SET password_salt = ?, password_hash = ?, password_updated_at = ?, updated_at = ?",
        "WHERE id = ?",
      ].join(" "),
    ).run(passwordRecord.salt, passwordRecord.hash, now, now, account.id);
    const result = database.prepare(
      "DELETE FROM sessions WHERE account_id = ? AND id != ?",
    ).run(account.id, session.id);
    revokedSessionCount = Number(result.changes ?? 0);
  });

  const refreshed = fetchAccountById(account.id);
  json(response, 200, {
    ok: true,
    account: sanitizeAccount(refreshed),
    revokedSessionCount,
  });
}

function handleGetSync(request, response) {
  const { account } = authenticate(request);
  if (!account) {
    json(response, 401, { error: "Authentication required." });
    return;
  }

  json(response, 200, {
    state: loadAccountState(account.id),
    updatedAt: account.stateUpdatedAt,
    storage: "sqlite",
  });
}

async function handlePutSync(request, response) {
  const { account } = authenticate(request);
  if (!account) {
    json(response, 401, { error: "Authentication required." });
    return;
  }

  const body = await readJsonBody(request);
  validateState(body.state);
  const remoteState = loadAccountState(account.id);
  const mergedState = mergeSyncStates(remoteState ?? createEmptyState(), body.state);
  const updatedAt = new Date().toISOString();
  const storedState = writeAccountState(account.id, mergedState, updatedAt);

  json(response, 200, {
    ok: true,
    updatedAt,
    state: storedState,
    storage: "sqlite",
  });
}

function serveStatic(request, response) {
  const requestUrl = new URL(request.url, "http://localhost");
  let pathname = decodeURIComponent(requestUrl.pathname);
  if (pathname === "/") {
    pathname = "/index.html";
  }

  const filePath = path.normalize(path.join(ROOT_DIR, pathname));
  if (!filePath.startsWith(ROOT_DIR)) {
    notFound(response);
    return;
  }

  let finalPath = filePath;
  if (fs.existsSync(finalPath) && fs.statSync(finalPath).isDirectory()) {
    finalPath = path.join(finalPath, "index.html");
  }
  if (!fs.existsSync(finalPath) || !fs.statSync(finalPath).isFile()) {
    notFound(response);
    return;
  }

  const extension = path.extname(finalPath);
  const mimeType = MIME_TYPES[extension] ?? "application/octet-stream";
  const headers = {
    "Content-Type": mimeType,
  };
  if (
    extension === ".html"
    || extension === ".webmanifest"
    || path.basename(finalPath) === "service-worker.js"
  ) {
    headers["Cache-Control"] = "no-cache";
  }
  response.writeHead(200, headers);
  fs.createReadStream(finalPath).pipe(response);
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");

    if (url.pathname === "/api/health") {
      json(response, 200, {
        ok: true,
        storage: "sqlite",
        databasePath: SQLITE_PATH,
      });
      return;
    }

    if (url.pathname === "/api/auth/register" && request.method === "POST") {
      await handleRegister(request, response);
      return;
    }
    if (url.pathname === "/api/auth/login" && request.method === "POST") {
      await handleLogin(request, response);
      return;
    }
    if (url.pathname === "/api/auth/logout" && request.method === "POST") {
      handleLogout(request, response);
      return;
    }
    if (url.pathname === "/api/auth/me" && request.method === "GET") {
      handleMe(request, response);
      return;
    }
    if (url.pathname === "/api/auth/password" && request.method === "POST") {
      await handleChangePassword(request, response);
      return;
    }
    if (url.pathname === "/api/auth/sessions" && request.method === "GET") {
      handleListSessions(request, response);
      return;
    }
    if (url.pathname.startsWith("/api/auth/sessions/") && request.method === "DELETE") {
      const sessionId = decodeURIComponent(url.pathname.slice("/api/auth/sessions/".length));
      handleDeleteSession(request, response, sessionId);
      return;
    }
    if (url.pathname === "/api/sync" && request.method === "GET") {
      handleGetSync(request, response);
      return;
    }
    if (url.pathname === "/api/sync" && request.method === "PUT") {
      await handlePutSync(request, response);
      return;
    }
    if (url.pathname.startsWith("/api/")) {
      notFound(response);
      return;
    }

    serveStatic(request, response);
  } catch (error) {
    console.error(error);
    json(response, 500, { error: error.message || "Unexpected server error." });
  }
});

const requestedPort = Number(process.argv[2] ?? process.env.PORT ?? 4173);
server.listen(Number.isFinite(requestedPort) ? requestedPort : 4173, () => {
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : requestedPort;
  console.log(`Wortwald server running at http://localhost:${port}`);
});
