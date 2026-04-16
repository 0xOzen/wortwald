const STORAGE_KEY = "wortwald-state-v1";
const AUTH_TOKEN_KEY = "wortwald-auth-token-v1";
const PASSWORD_MIN_LENGTH = 8;
const API_HEALTH_TIMEOUT_MS = 2500;
const VIEW_KEYS = ["library", "study", "progress", "studio"];
const PROGRESS_SECTION_KEYS = ["snapshot", "sync", "reviews"];
const STUDIO_SECTION_KEYS = ["cards", "decks", "manage"];
const CSV_COLUMNS = [
  "deckName",
  "deckLevel",
  "deckFocus",
  "deckDescription",
  "partOfSpeech",
  "term",
  "translation",
  "article",
  "plural",
  "verbAuxiliary",
  "verbPresent",
  "verbPreterite",
  "verbParticiple",
  "verbImperative",
  "usagePattern",
  "adjectiveComparative",
  "adjectiveSuperlative",
  "adjectiveUsage",
  "level",
  "example",
  "exampleTranslation",
  "note",
  "tags",
];
const REVIEW_SCORES = {
  again: { label: "Again", button: "1" },
  hard: { label: "Hard", button: "2" },
  good: { label: "Good", button: "3" },
  easy: { label: "Easy", button: "4" },
};

const seedDecks = [
  {
    id: "deck-cafe",
    name: "Cafe and Survival Phrases",
    level: "A1",
    focus: "restaurant, greetings, politeness",
    description:
      "High-frequency phrases and nouns for ordering, thanking, and navigating simple daily interactions.",
  },
  {
    id: "deck-nouns",
    name: "Articles and Everyday Nouns",
    level: "A1",
    focus: "gender, plural forms, home and city",
    description:
      "Build article instinct with core nouns that appear constantly in beginner German.",
  },
  {
    id: "deck-travel",
    name: "Travel and Movement",
    level: "A2",
    focus: "transport, logistics, motion verbs",
    description:
      "Useful nouns and verbs for trains, appointments, directions, and getting around a German-speaking city.",
  },
  {
    id: "deck-descriptions",
    name: "Adjectives and Descriptions",
    level: "A2",
    focus: "comparisons, opinions, everyday descriptions",
    description:
      "Build adjective recall with high-frequency descriptive words, comparison patterns, and natural usage frames.",
  },
];

const seedCards = [
  {
    id: "card-kaffee",
    deckId: "deck-cafe",
    term: "Kaffee",
    translation: "coffee",
    article: "der",
    plural: "die Kaffees",
    level: "A1",
    tags: ["restaurant", "drink", "noun"],
    example: "Ich trinke morgens gern einen Kaffee.",
    exampleTranslation: "I like drinking a coffee in the morning.",
    note: "A masculine noun often used with bestellen or trinken.",
  },
  {
    id: "card-rechnung",
    deckId: "deck-cafe",
    term: "Rechnung",
    translation: "bill, invoice",
    article: "die",
    plural: "die Rechnungen",
    level: "A1",
    tags: ["restaurant", "payment", "noun"],
    example: "Kann ich bitte die Rechnung haben?",
    exampleTranslation: "Could I have the bill, please?",
    note: "A polite restaurant phrase that is worth overlearning early.",
  },
  {
    id: "card-entschuldigung",
    deckId: "deck-cafe",
    term: "Entschuldigung",
    translation: "excuse me, sorry",
    article: "die",
    plural: "die Entschuldigungen",
    level: "A1",
    tags: ["politeness", "social", "noun"],
    example: "Entschuldigung, ist dieser Platz frei?",
    exampleTranslation: "Excuse me, is this seat free?",
    note: "Functions as both an apology and a polite way to get attention.",
  },
  {
    id: "card-ich-haette-gern",
    deckId: "deck-cafe",
    term: "Ich hätte gern",
    translation: "I would like",
    article: "",
    plural: "",
    level: "A1",
    tags: ["phrase", "ordering", "politeness"],
    example: "Ich hätte gern einen Tee und ein Stück Kuchen.",
    exampleTranslation: "I would like a tea and a piece of cake.",
    note: "An especially useful phrase for cafes, bakeries, and shops.",
  },
  {
    id: "card-danke",
    deckId: "deck-cafe",
    term: "Danke",
    translation: "thanks",
    article: "",
    plural: "",
    level: "A1",
    tags: ["phrase", "social", "politeness"],
    example: "Danke, das hilft mir sehr.",
    exampleTranslation: "Thanks, that helps me a lot.",
    note: "Short, flexible, and one of the first words learners should automate.",
  },
  {
    id: "card-bitte",
    deckId: "deck-cafe",
    term: "Bitte",
    translation: "please, you're welcome",
    article: "",
    plural: "",
    level: "A1",
    tags: ["phrase", "social", "politeness"],
    example: "Ein Wasser, bitte.",
    exampleTranslation: "A water, please.",
    note: "Context changes the meaning, so example-heavy repetition helps.",
  },
  {
    id: "card-stadt",
    deckId: "deck-nouns",
    term: "Stadt",
    translation: "city",
    article: "die",
    plural: "die Städte",
    level: "A1",
    tags: ["place", "noun", "plural-change"],
    example: "Berlin ist eine große Stadt.",
    exampleTranslation: "Berlin is a big city.",
    note: "The plural adds an umlaut, which makes it a great pattern card.",
  },
  {
    id: "card-fenster",
    deckId: "deck-nouns",
    term: "Fenster",
    translation: "window",
    article: "das",
    plural: "die Fenster",
    level: "A1",
    tags: ["home", "noun", "neuter"],
    example: "Das Fenster ist offen.",
    exampleTranslation: "The window is open.",
    note: "A common neuter noun with an unchanged plural form.",
  },
  {
    id: "card-wohnung",
    deckId: "deck-nouns",
    term: "Wohnung",
    translation: "apartment",
    article: "die",
    plural: "die Wohnungen",
    level: "A1",
    tags: ["home", "noun", "housing"],
    example: "Die Wohnung ist klein, aber hell.",
    exampleTranslation: "The apartment is small but bright.",
    note: "Useful for housing conversations and bureaucratic tasks.",
  },
  {
    id: "card-frage",
    deckId: "deck-nouns",
    term: "Frage",
    translation: "question",
    article: "die",
    plural: "die Fragen",
    level: "A1",
    tags: ["conversation", "noun", "classroom"],
    example: "Ich habe eine Frage.",
    exampleTranslation: "I have a question.",
    note: "Very high utility in class, at work, and in everyday conversations.",
  },
  {
    id: "card-termin",
    deckId: "deck-nouns",
    term: "Termin",
    translation: "appointment",
    article: "der",
    plural: "die Termine",
    level: "A2",
    tags: ["bureaucracy", "calendar", "noun"],
    example: "Ich habe morgen einen Termin beim Arzt.",
    exampleTranslation: "I have a doctor's appointment tomorrow.",
    note: "Essential for healthcare, office, and administration contexts.",
  },
  {
    id: "card-zug",
    deckId: "deck-nouns",
    term: "Zug",
    translation: "train",
    article: "der",
    plural: "die Züge",
    level: "A1",
    tags: ["transport", "noun", "plural-change"],
    example: "Der Zug kommt um acht Uhr an.",
    exampleTranslation: "The train arrives at eight o'clock.",
    note: "Another useful umlaut plural pattern card.",
  },
  {
    id: "card-umsteigen",
    deckId: "deck-travel",
    term: "umsteigen",
    translation: "to change trains, switch lines",
    article: "",
    plural: "",
    level: "A2",
    tags: ["transport", "verb", "travel"],
    example: "In München müssen wir in die U-Bahn umsteigen.",
    exampleTranslation: "In Munich we have to switch to the subway.",
    note: "Often appears with in + accusative when changing into another vehicle or line.",
    partOfSpeech: "verb",
    verbForms: {
      auxiliary: "sein",
      present: "er/sie/es steigt um",
      preterite: "stieg um",
      participle: "umgestiegen",
      imperative: "steig um",
      usagePattern: "in + Akk",
    },
  },
  {
    id: "card-sich-beeilen",
    deckId: "deck-travel",
    term: "sich beeilen",
    translation: "to hurry",
    article: "",
    plural: "",
    level: "A2",
    tags: ["verb", "movement", "reflexive"],
    example: "Wir müssen uns beeilen, sonst verpassen wir den Zug.",
    exampleTranslation: "We have to hurry, otherwise we'll miss the train.",
    note: "A reflexive verb worth pairing with subject pronouns in practice.",
    partOfSpeech: "verb",
    verbForms: {
      auxiliary: "haben",
      present: "er/sie/es beeilt sich",
      preterite: "beeilte sich",
      participle: "sich beeilt",
      imperative: "beeil dich",
      usagePattern: "reflexive",
    },
  },
  {
    id: "card-verpassen",
    deckId: "deck-travel",
    term: "verpassen",
    translation: "to miss",
    article: "",
    plural: "",
    level: "A2",
    tags: ["verb", "transport", "time"],
    example: "Ich will den Bus nicht verpassen.",
    exampleTranslation: "I don't want to miss the bus.",
    note: "Common with transport and deadlines.",
    partOfSpeech: "verb",
    verbForms: {
      auxiliary: "haben",
      present: "er/sie/es verpasst",
      preterite: "verpasste",
      participle: "verpasst",
      imperative: "verpass",
      usagePattern: "Akk object",
    },
  },
  {
    id: "card-ankommen",
    deckId: "deck-travel",
    term: "ankommen",
    translation: "to arrive",
    article: "",
    plural: "",
    level: "A2",
    tags: ["verb", "transport", "separable"],
    example: "Wann kommt ihr in Hamburg an?",
    exampleTranslation: "When are you arriving in Hamburg?",
    note: "A good starter card for separable-prefix verbs.",
    partOfSpeech: "verb",
    verbForms: {
      auxiliary: "sein",
      present: "er/sie/es kommt an",
      preterite: "kam an",
      participle: "angekommen",
      imperative: "komm an",
      usagePattern: "in + Dat / bei",
    },
  },
  {
    id: "card-verspaetung",
    deckId: "deck-travel",
    term: "Verspätung",
    translation: "delay",
    article: "die",
    plural: "die Verspätungen",
    level: "A2",
    tags: ["transport", "noun", "travel"],
    example: "Der Zug hat zwanzig Minuten Verspätung.",
    exampleTranslation: "The train is delayed by twenty minutes.",
    note: "Extremely practical if you travel by train in Germany.",
  },
  {
    id: "card-fahrkarte",
    deckId: "deck-travel",
    term: "Fahrkarte",
    translation: "ticket",
    article: "die",
    plural: "die Fahrkarten",
    level: "A1",
    tags: ["transport", "noun", "purchase"],
    example: "Wo kann ich eine Fahrkarte kaufen?",
    exampleTranslation: "Where can I buy a ticket?",
    note: "You may also encounter Ticket in everyday use, but Fahrkarte is worth knowing.",
  },
  {
    id: "card-wichtig",
    deckId: "deck-descriptions",
    term: "wichtig",
    translation: "important",
    article: "",
    plural: "",
    level: "A2",
    tags: ["adjective", "opinion", "description"],
    example: "Das ist für mich sehr wichtig.",
    exampleTranslation: "That is very important to me.",
    note: "Often used with für + accusative to mark relevance.",
    partOfSpeech: "adjective",
    adjectiveForms: {
      comparative: "wichtiger",
      superlative: "am wichtigsten",
      usage: "wichtig für + Akk",
    },
  },
  {
    id: "card-schnell",
    deckId: "deck-descriptions",
    term: "schnell",
    translation: "fast, quick",
    article: "",
    plural: "",
    level: "A1",
    tags: ["adjective", "adverbial", "description"],
    example: "Der Zug ist heute besonders schnell.",
    exampleTranslation: "The train is especially fast today.",
    note: "Works both as an adjective and adverb in everyday German.",
    partOfSpeech: "adjective",
    adjectiveForms: {
      comparative: "schneller",
      superlative: "am schnellsten",
      usage: "predicative or adverbial",
    },
  },
  {
    id: "card-gross",
    deckId: "deck-descriptions",
    term: "groß",
    translation: "big, tall",
    article: "",
    plural: "",
    level: "A1",
    tags: ["adjective", "irregular", "description"],
    example: "Berlin ist größer als meine Heimatstadt.",
    exampleTranslation: "Berlin is bigger than my hometown.",
    note: "A helpful adjective because the comparative adds an umlaut.",
    partOfSpeech: "adjective",
    adjectiveForms: {
      comparative: "größer",
      superlative: "am größten",
      usage: "größer als",
    },
  },
];

function createSeedState() {
  const now = new Date().toISOString();
  return {
    decks: clone(seedDecks).map((deck) => ({
      ...deck,
      createdAt: now,
      updatedAt: now,
    })),
    cards: clone(seedCards).map((card) => ({
      ...card,
      createdAt: now,
      updatedAt: now,
    })),
    progress: {},
    sessions: [],
    preferences: {
      selectedDeckId: "all",
      dailyGoal: 12,
      deviceName: "My device",
      activeView: "library",
      progressSection: "snapshot",
      studioSection: "cards",
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

function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function setDataStatus(message) {
  elements.dataStatusText.textContent = message;
}

function setInstallStatus(message) {
  elements.installStatusText.textContent = message;
}

function setSyncStatus(message) {
  if (elements.syncStatusText) {
    elements.syncStatusText.textContent = message;
  }
}

function setAuthStatus(message) {
  if (elements.authStatusText) {
    elements.authStatusText.textContent = message;
  }
}

function setPasswordStatus(message) {
  if (elements.passwordStatusText) {
    elements.passwordStatusText.textContent = message;
  }
}

function setSessionStatus(message) {
  if (elements.sessionStatusText) {
    elements.sessionStatusText.textContent = message;
  }
}

function persistAuthToken(token) {
  authState.token = token;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

function renderSessionList() {
  if (!elements.sessionList) {
    return;
  }

  const busy = authState.syncing || authState.changingPassword;
  if (!authState.account) {
    elements.sessionList.innerHTML = "";
    setSessionStatus("Active devices will appear here after sign-in.");
    return;
  }

  if (authState.sessions.length === 0) {
    elements.sessionList.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">No device list yet</p>
        <p class="empty-copy">Refresh devices to pull the latest active sessions from the server.</p>
      </div>
    `;
    setSessionStatus("Active devices will appear here after your first refresh.");
    return;
  }

  elements.sessionList.innerHTML = authState.sessions
    .map((session) => {
      const currentLabel = session.isCurrent ? "This device" : "Active session";
      return `
        <article class="session-item">
          <div class="session-copy">
            <strong>${session.deviceName}</strong>
            <p class="session-meta">
              ${currentLabel} · last active ${formatDate(session.lastUsedAt)} · expires ${formatDate(session.expiresAt)}
            </p>
          </div>
          ${
            session.isCurrent
              ? '<span class="pill">Current</span>'
              : `<button class="button button-ghost" type="button" data-action="revoke-session" data-session-id="${session.id}" ${busy ? "disabled" : ""}>Sign out</button>`
          }
        </article>
      `;
    })
    .join("");

  setSessionStatus(
    `${authState.sessions.length} active device${authState.sessions.length === 1 ? "" : "s"} on this account.`,
  );
}

function renderAuth() {
  const loggedIn = Boolean(authState.account);
  const busy = authState.syncing || authState.changingPassword;
  const backendReady = backendState.checked && backendState.available;
  elements.authLoggedOut.classList.toggle("hidden", loggedIn || !backendReady);
  elements.authLoggedIn.classList.toggle("hidden", !loggedIn || !backendReady);
  if (document.activeElement !== elements.deviceNameInput) {
    elements.deviceNameInput.value = appState.preferences.deviceName;
  }
  elements.authEmailInput.disabled = busy || !backendReady;
  elements.authPasswordInput.disabled = busy || !backendReady;
  elements.deviceNameInput.disabled = busy || !backendReady;
  elements.registerBtn.disabled = busy || !backendReady;
  elements.loginBtn.disabled = busy || !backendReady;

  if (!backendState.checked) {
    elements.accountEmailText.textContent = "";
    elements.accountMetaText.textContent = "Checking cloud sync availability.";
    elements.syncNowBtn.disabled = true;
    elements.pullServerBtn.disabled = true;
    elements.logoutBtn.disabled = true;
    elements.changePasswordBtn.disabled = true;
    elements.refreshSessionsBtn.disabled = true;
    elements.currentPasswordInput.value = "";
    elements.newPasswordInput.value = "";
    renderSessionList();
    setPasswordStatus("Checking cloud sync availability.");
    setSessionStatus("Checking cloud sync availability.");
    setAuthStatus("Checking cloud sync availability...");
    return;
  }

  if (!backendState.available) {
    elements.accountEmailText.textContent = "";
    elements.accountMetaText.textContent = "Hosted PWA mode keeps your study data on this device.";
    elements.syncNowBtn.disabled = true;
    elements.pullServerBtn.disabled = true;
    elements.logoutBtn.disabled = true;
    elements.changePasswordBtn.disabled = true;
    elements.refreshSessionsBtn.disabled = true;
    elements.currentPasswordInput.value = "";
    elements.newPasswordInput.value = "";
    renderSessionList();
    setPasswordStatus("Cloud sync is not connected on this HTTPS deployment yet.");
    setSessionStatus("Use Export sync, Merge sync, or JSON export to move progress between devices.");
    setAuthStatus(
      "This HTTPS build is ready for iPad install. Cloud accounts are not connected here yet, so use Export sync, Merge sync, or JSON export to move decks between devices.",
    );
    return;
  }

  if (!loggedIn) {
    elements.accountEmailText.textContent = "";
    elements.accountMetaText.textContent = "Server-backed sync is ready.";
    elements.syncNowBtn.disabled = true;
    elements.pullServerBtn.disabled = true;
    elements.logoutBtn.disabled = true;
    elements.changePasswordBtn.disabled = true;
    elements.refreshSessionsBtn.disabled = true;
    elements.currentPasswordInput.value = "";
    elements.newPasswordInput.value = "";
    setPasswordStatus("Changing your password signs out your other devices.");
    renderSessionList();
    return;
  }

  const currentSession = authState.sessions.find((entry) => entry.id === authState.currentSessionId);
  elements.accountEmailText.textContent = authState.account.email;
  elements.accountMetaText.textContent = authState.lastSyncedAt
    ? `Last synced ${formatDate(authState.lastSyncedAt)}${currentSession ? ` from ${currentSession.deviceName}` : ""}.`
    : `Signed in${currentSession ? ` on ${currentSession.deviceName}` : ""}. Sync to create the first cloud snapshot.`;
  elements.syncNowBtn.disabled = busy;
  elements.pullServerBtn.disabled = busy;
  elements.logoutBtn.disabled = busy;
  elements.changePasswordBtn.disabled = busy;
  elements.refreshSessionsBtn.disabled = busy;
  renderSessionList();
}

function validateAuthFields() {
  const email = elements.authEmailInput.value.trim();
  const password = elements.authPasswordInput.value;
  const deviceName = elements.deviceNameInput.value.trim() || appState.preferences.deviceName;

  if (!email.includes("@")) {
    throw new Error("Enter a valid email address.");
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`Use a password with at least ${PASSWORD_MIN_LENGTH} characters.`);
  }

  appState.preferences.deviceName = deviceName;
  saveState();
  return { email, password, deviceName };
}

async function apiRequest(path, options = {}) {
  if (path.startsWith("/api/") && backendState.checked && !backendState.available) {
    throw new Error(
      "Cloud sync is not connected on this HTTPS deployment yet. Use Export sync, Merge sync, or JSON export to move progress between devices.",
    );
  }

  const headers = {
    Accept: "application/json",
    ...(options.headers ?? {}),
  };
  if (authState.token) {
    headers.Authorization = `Bearer ${authState.token}`;
  }
  const hasBody = options.body !== undefined;
  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(path, {
    method: options.method ?? "GET",
    headers,
    body: hasBody ? JSON.stringify(options.body) : undefined,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401 && authState.token) {
      persistAuthToken("");
      authState.account = null;
      authState.sessions = [];
      authState.currentSessionId = null;
      renderAuth();
    }
    throw new Error(payload?.error ?? `Request failed with status ${response.status}.`);
  }

  return payload;
}

async function detectBackendSupport() {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timeoutId = controller
    ? window.setTimeout(() => {
        controller.abort();
      }, API_HEALTH_TIMEOUT_MS)
    : null;

  try {
    const response = await fetch("/api/health", {
      headers: { Accept: "application/json" },
      signal: controller?.signal,
    });
    const isJson = response.headers.get("content-type")?.includes("application/json");
    const payload = isJson ? await response.json().catch(() => null) : null;
    backendState.available = response.ok && payload?.ok === true;
  } catch (error) {
    backendState.available = false;
  } finally {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    backendState.checked = true;
    renderAuth();
  }

  return backendState.available;
}

function scheduleServerSync() {
  if (!authState.account || authState.suppressAutoSync) {
    return;
  }

  window.clearTimeout(authState.autoSyncTimer);
  authState.autoSyncTimer = window.setTimeout(() => {
    syncAccountState({ quiet: true }).catch((error) => {
      setAuthStatus(`Background sync failed: ${error.message}`);
    });
  }, 900);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function transliterateGerman(value) {
  return String(value ?? "")
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss")
    .replaceAll("Ä", "ae")
    .replaceAll("Ö", "oe")
    .replaceAll("Ü", "ue");
}

function normalizeAnswerText(value) {
  return transliterateGerman(value)
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?[\]"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshteinDistance(left, right) {
  const a = normalizeAnswerText(left);
  const b = normalizeAnswerText(right);
  if (!a || !b) {
    return Math.max(a.length, b.length);
  }

  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let row = 0; row <= a.length; row += 1) {
    matrix[row][0] = row;
  }
  for (let column = 0; column <= b.length; column += 1) {
    matrix[0][column] = column;
  }
  for (let row = 1; row <= a.length; row += 1) {
    for (let column = 1; column <= b.length; column += 1) {
      const cost = a[row - 1] === b[column - 1] ? 0 : 1;
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

function withTimestamp(entity, fallback = new Date().toISOString()) {
  return {
    ...entity,
    createdAt: entity.createdAt ?? fallback,
    updatedAt: entity.updatedAt ?? fallback,
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
  return withTimestamp(deck);
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
    ...card,
    tags: Array.isArray(card.tags) ? card.tags : splitTagField(card.tags),
    partOfSpeech: inferPartOfSpeech(card),
    usagePattern: String(card?.usagePattern ?? card?.verbForms?.usagePattern ?? "").trim(),
    verbForms: normalizeVerbForms(card?.verbForms),
    adjectiveForms: normalizeAdjectiveForms(card?.adjectiveForms),
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

function normalizeState(rawState) {
  const seed = createSeedState();
  return {
    ...seed,
    ...rawState,
    decks: Array.isArray(rawState?.decks) ? rawState.decks.map(normalizeDeckEntry) : seed.decks,
    cards: Array.isArray(rawState?.cards) ? rawState.cards.map(normalizeCardEntry) : seed.cards,
    progress: Object.fromEntries(
      Object.entries(rawState?.progress ?? {}).map(([cardId, progress]) => [cardId, normalizeProgressEntry(progress)]),
    ),
    sessions: Array.isArray(rawState?.sessions) ? rawState.sessions : [],
    preferences: {
      ...seed.preferences,
      ...(rawState?.preferences ?? {}),
      activeView: normalizeView(rawState?.preferences?.activeView ?? seed.preferences.activeView),
      progressSection: normalizeProgressSection(
        rawState?.preferences?.progressSection ?? seed.preferences.progressSection,
      ),
      studioSection: normalizeStudioSection(rawState?.preferences?.studioSection ?? seed.preferences.studioSection),
    },
    tombstones: {
      decks: normalizeTombstoneList(rawState?.tombstones?.decks),
      cards: normalizeTombstoneList(rawState?.tombstones?.cards),
    },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createSeedState();
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.decks) || !Array.isArray(parsed.cards)) {
      return createSeedState();
    }

    return normalizeState(parsed);
  } catch (error) {
    console.warn("Failed to load saved state, falling back to seed data.", error);
    return createSeedState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  scheduleServerSync();
}

const appState = loadState();

function createSessionSummary() {
  return {
    reviewed: 0,
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  };
}

const sessionState = {
  queue: [],
  currentIndex: 0,
  revealed: false,
  source: "due",
  deckId: "all",
  completed: false,
  summary: createSessionSummary(),
  typedAnswer: "",
  lastEvaluation: null,
  autoPlayedKey: null,
};

const studioState = {
  editingDeckId: null,
  editingCardId: null,
};

const installState = {
  deferredPrompt: null,
  installed: window.matchMedia?.("(display-mode: standalone)")?.matches ?? false,
};

const authState = {
  token: localStorage.getItem(AUTH_TOKEN_KEY) ?? "",
  account: null,
  syncing: false,
  lastSyncedAt: null,
  autoSyncTimer: null,
  suppressAutoSync: false,
  sessions: [],
  currentSessionId: null,
  changingPassword: false,
};

const backendState = {
  checked: false,
  available: false,
};

const audioState = {
  mediaRecorder: null,
  chunks: [],
  stream: null,
  currentRecordingUrl: null,
  isRecording: false,
};

const uiState = {
  activeSheet: "",
  navOpen: false,
  commandOpen: false,
  commandIndex: 0,
  commandResults: [],
  progressMenuOpen: false,
  studioMenuOpen: false,
  swipePointerId: null,
  swipeTrackingCardId: "",
  openSwipeCardId: "",
  swipeStartX: 0,
  swipeBaseOffset: 0,
};

const MANAGED_CARD_SWIPE_WIDTH = 214;

const elements = {
  appSidebar: document.getElementById("appSidebar"),
  sidebarBackdrop: document.getElementById("sidebarBackdrop"),
  menuToggleBtn: document.getElementById("menuToggleBtn"),
  closeSidebarBtn: document.getElementById("closeSidebarBtn"),
  commandSearchInput: document.getElementById("commandSearchInput"),
  commandResultsPanel: document.getElementById("commandResultsPanel"),
  viewTabs: Array.from(document.querySelectorAll("[data-view-target]")),
  viewPanels: Array.from(document.querySelectorAll("[data-view-panel]")),
  progressSectionTabs: Array.from(document.querySelectorAll("[data-progress-target]")),
  progressSectionPanels: Array.from(document.querySelectorAll("[data-progress-panel]")),
  studioSectionTabs: Array.from(document.querySelectorAll("[data-studio-target]")),
  studioSectionPanels: Array.from(document.querySelectorAll("[data-studio-panel]")),
  progressMenuToggleBtn: document.getElementById("progressMenuToggleBtn"),
  progressMenuSummary: document.getElementById("progressMenuSummary"),
  progressMenuNav: document.getElementById("progressMenuNav"),
  studioMenuToggleBtn: document.getElementById("studioMenuToggleBtn"),
  studioMenuSummary: document.getElementById("studioMenuSummary"),
  studioMenuNav: document.getElementById("studioMenuNav"),
  activeViewTitle: document.getElementById("activeViewTitle"),
  activeViewMeta: document.getElementById("activeViewMeta"),
  libraryNavMeta: document.getElementById("libraryNavMeta"),
  studyNavMeta: document.getElementById("studyNavMeta"),
  progressNavMeta: document.getElementById("progressNavMeta"),
  studioNavMeta: document.getElementById("studioNavMeta"),
  dueCount: document.getElementById("dueCount"),
  todayReviews: document.getElementById("todayReviews"),
  streakCount: document.getElementById("streakCount"),
  masteredCount: document.getElementById("masteredCount"),
  dailyGoalText: document.getElementById("dailyGoalText"),
  averageEaseText: document.getElementById("averageEaseText"),
  nextDueText: document.getElementById("nextDueText"),
  searchInput: document.getElementById("searchInput"),
  levelFilter: document.getElementById("levelFilter"),
  deckGrid: document.getElementById("deckGrid"),
  studyDueBtn: document.getElementById("studyDueBtn"),
  studyMixedBtn: document.getElementById("studyMixedBtn"),
  studyWeakBtn: document.getElementById("studyWeakBtn"),
  studyListeningBtn: document.getElementById("studyListeningBtn"),
  topbarStudyBtn: document.getElementById("topbarStudyBtn"),
  installBtn: document.getElementById("installBtn"),
  installStatusText: document.getElementById("installStatusText"),
  studyEmpty: document.getElementById("studyEmpty"),
  studyArea: document.getElementById("studyArea"),
  sessionStatus: document.getElementById("sessionStatus"),
  queueChip: document.getElementById("queueChip"),
  modeBadge: document.getElementById("modeBadge"),
  promptTitle: document.getElementById("promptTitle"),
  promptSubtitle: document.getElementById("promptSubtitle"),
  typedAnswerLabel: document.getElementById("typedAnswerLabel"),
  typedAnswerInput: document.getElementById("typedAnswerInput"),
  checkAnswerBtn: document.getElementById("checkAnswerBtn"),
  typedFeedbackText: document.getElementById("typedFeedbackText"),
  revealBtn: document.getElementById("revealBtn"),
  answerPanel: document.getElementById("answerPanel"),
  answerMain: document.getElementById("answerMain"),
  translationText: document.getElementById("translationText"),
  posPill: document.getElementById("posPill"),
  articlePill: document.getElementById("articlePill"),
  pluralPill: document.getElementById("pluralPill"),
  levelPill: document.getElementById("levelPill"),
  noteText: document.getElementById("noteText"),
  specialFormsPanel: document.getElementById("specialFormsPanel"),
  exampleText: document.getElementById("exampleText"),
  exampleTranslation: document.getElementById("exampleTranslation"),
  studyRepText: document.getElementById("studyRepText"),
  studyIntervalText: document.getElementById("studyIntervalText"),
  studyNextGoodText: document.getElementById("studyNextGoodText"),
  pronounceBtn: document.getElementById("pronounceBtn"),
  recordBtn: document.getElementById("recordBtn"),
  stopRecordBtn: document.getElementById("stopRecordBtn"),
  playRecordBtn: document.getElementById("playRecordBtn"),
  recordingStatusText: document.getElementById("recordingStatusText"),
  requeueBtn: document.getElementById("requeueBtn"),
  progressBars: document.getElementById("progressBars"),
  weakSpotList: document.getElementById("weakSpotList"),
  activityList: document.getElementById("activityList"),
  goalForm: document.getElementById("goalForm"),
  dailyGoalInput: document.getElementById("dailyGoalInput"),
  goalStatusText: document.getElementById("goalStatusText"),
  dataStatusText: document.getElementById("dataStatusText"),
  syncStatusText: document.getElementById("syncStatusText"),
  authLoggedOut: document.getElementById("authLoggedOut"),
  authLoggedIn: document.getElementById("authLoggedIn"),
  authEmailInput: document.getElementById("authEmailInput"),
  authPasswordInput: document.getElementById("authPasswordInput"),
  deviceNameInput: document.getElementById("deviceNameInput"),
  registerBtn: document.getElementById("registerBtn"),
  loginBtn: document.getElementById("loginBtn"),
  accountEmailText: document.getElementById("accountEmailText"),
  accountMetaText: document.getElementById("accountMetaText"),
  authStatusText: document.getElementById("authStatusText"),
  syncNowBtn: document.getElementById("syncNowBtn"),
  pullServerBtn: document.getElementById("pullServerBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  passwordForm: document.getElementById("passwordForm"),
  currentPasswordInput: document.getElementById("currentPasswordInput"),
  newPasswordInput: document.getElementById("newPasswordInput"),
  changePasswordBtn: document.getElementById("changePasswordBtn"),
  passwordStatusText: document.getElementById("passwordStatusText"),
  refreshSessionsBtn: document.getElementById("refreshSessionsBtn"),
  sessionList: document.getElementById("sessionList"),
  sessionStatusText: document.getElementById("sessionStatusText"),
  exportJsonBtn: document.getElementById("exportJsonBtn"),
  importJsonBtn: document.getElementById("importJsonBtn"),
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  importCsvBtn: document.getElementById("importCsvBtn"),
  exportSyncBtn: document.getElementById("exportSyncBtn"),
  importSyncBtn: document.getElementById("importSyncBtn"),
  importInput: document.getElementById("importInput"),
  csvImportInput: document.getElementById("csvImportInput"),
  syncImportInput: document.getElementById("syncImportInput"),
  resetBtn: document.getElementById("resetBtn"),
  openCardSheetBtn: document.getElementById("openCardSheetBtn"),
  openDeckSheetBtn: document.getElementById("openDeckSheetBtn"),
  openCardSheetFromManagerBtn: document.getElementById("openCardSheetFromManagerBtn"),
  openDeckSheetFromManagerBtn: document.getElementById("openDeckSheetFromManagerBtn"),
  jumpManagerBtn: document.getElementById("jumpManagerBtn"),
  jumpManagerFromDecksBtn: document.getElementById("jumpManagerFromDecksBtn"),
  sheetOverlay: document.getElementById("sheetOverlay"),
  sheetBackdrop: document.getElementById("sheetBackdrop"),
  sheetCardPanel: document.getElementById("sheetCardPanel"),
  sheetDeckPanel: document.getElementById("sheetDeckPanel"),
  closeCardSheetBtn: document.getElementById("closeCardSheetBtn"),
  closeDeckSheetBtn: document.getElementById("closeDeckSheetBtn"),
  deckForm: document.getElementById("deckForm"),
  cardForm: document.getElementById("cardForm"),
  deckFormTitle: document.getElementById("deckFormTitle"),
  deckFormIntro: document.getElementById("deckFormIntro"),
  deckSubmitBtn: document.getElementById("deckSubmitBtn"),
  deckCancelBtn: document.getElementById("deckCancelBtn"),
  deckName: document.getElementById("deckName"),
  deckLevel: document.getElementById("deckLevel"),
  deckFocus: document.getElementById("deckFocus"),
  deckDescription: document.getElementById("deckDescription"),
  cardFormTitle: document.getElementById("cardFormTitle"),
  cardFormIntro: document.getElementById("cardFormIntro"),
  cardSubmitBtn: document.getElementById("cardSubmitBtn"),
  cardCancelBtn: document.getElementById("cardCancelBtn"),
  cardDeckSelect: document.getElementById("cardDeckSelect"),
  cardPartOfSpeech: document.getElementById("cardPartOfSpeech"),
  cardTerm: document.getElementById("cardTerm"),
  cardTranslation: document.getElementById("cardTranslation"),
  nounFields: document.getElementById("nounFields"),
  cardArticle: document.getElementById("cardArticle"),
  cardPlural: document.getElementById("cardPlural"),
  verbFields: document.getElementById("verbFields"),
  cardVerbAuxiliary: document.getElementById("cardVerbAuxiliary"),
  cardVerbPresent: document.getElementById("cardVerbPresent"),
  cardVerbPreterite: document.getElementById("cardVerbPreterite"),
  cardVerbParticiple: document.getElementById("cardVerbParticiple"),
  cardVerbImperative: document.getElementById("cardVerbImperative"),
  cardUsagePattern: document.getElementById("cardUsagePattern"),
  adjectiveFields: document.getElementById("adjectiveFields"),
  cardAdjectiveComparative: document.getElementById("cardAdjectiveComparative"),
  cardAdjectiveSuperlative: document.getElementById("cardAdjectiveSuperlative"),
  cardAdjectiveUsage: document.getElementById("cardAdjectiveUsage"),
  cardLevel: document.getElementById("cardLevel"),
  cardExample: document.getElementById("cardExample"),
  cardExampleTranslation: document.getElementById("cardExampleTranslation"),
  cardNote: document.getElementById("cardNote"),
  cardTags: document.getElementById("cardTags"),
  managerSearchInput: document.getElementById("managerSearchInput"),
  managerFilter: document.getElementById("managerFilter"),
  selectedDeckPanel: document.getElementById("selectedDeckPanel"),
  managedCardList: document.getElementById("managedCardList"),
  ratingButtons: Array.from(document.querySelectorAll("[data-score]")),
};

function getDeckById(deckId) {
  return appState.decks.find((deck) => deck.id === deckId) ?? null;
}

function getCardById(cardId) {
  return appState.cards.find((card) => card.id === cardId) ?? null;
}

function getManagerDeckId() {
  if (appState.preferences.selectedDeckId !== "all" && getDeckById(appState.preferences.selectedDeckId)) {
    return appState.preferences.selectedDeckId;
  }

  return appState.decks[0]?.id ?? null;
}

function isCompactNavigationViewport() {
  return window.matchMedia("(max-width: 780px)").matches;
}

function isSwipeViewport() {
  return window.matchMedia("(max-width: 780px)").matches;
}

function setSectionMenuOpen(sectionKey, isOpen) {
  if (sectionKey === "progress") {
    uiState.progressMenuOpen = Boolean(isOpen);
  }
  if (sectionKey === "studio") {
    uiState.studioMenuOpen = Boolean(isOpen);
  }
}

function renderSectionMenus() {
  const compact = isCompactNavigationViewport();
  const progressSection = normalizeProgressSection(appState.preferences.progressSection);
  const studioSection = normalizeStudioSection(appState.preferences.studioSection);
  const progressLabel = {
    snapshot: "Snapshot",
    sync: "Sync & backup",
    reviews: "Review log",
  };
  const studioLabel = {
    cards: "Card builder",
    decks: "Deck settings",
    manage: "Collection manager",
  };

  elements.progressMenuSummary.textContent = progressLabel[progressSection];
  elements.studioMenuSummary.textContent = studioLabel[studioSection];

  const progressOpen = !compact || uiState.progressMenuOpen;
  const studioOpen = !compact || uiState.studioMenuOpen;
  elements.progressMenuNav.classList.toggle("is-open", progressOpen);
  elements.studioMenuNav.classList.toggle("is-open", studioOpen);
  elements.progressMenuToggleBtn.setAttribute("aria-expanded", String(progressOpen));
  elements.studioMenuToggleBtn.setAttribute("aria-expanded", String(studioOpen));
  elements.progressMenuToggleBtn.querySelector(".panel-switcher-icon").textContent = progressOpen ? "−" : "+";
  elements.studioMenuToggleBtn.querySelector(".panel-switcher-icon").textContent = studioOpen ? "−" : "+";
}

function closeCommandPalette() {
  uiState.commandOpen = false;
  uiState.commandIndex = 0;
  uiState.commandResults = [];
  elements.commandResultsPanel.classList.add("hidden");
  elements.commandResultsPanel.innerHTML = "";
}

function buildCommandResults(query) {
  const normalizedQuery = query.trim().toLowerCase();
  const quickActions = [
    {
      id: "study-due",
      type: "Action",
      title: "Study due cards",
      meta: "Start the cards currently due in your selected deck.",
      run: () => startSession(appState.preferences.selectedDeckId ?? "all", "due"),
    },
    {
      id: "mix-all",
      type: "Action",
      title: "Mix all decks",
      meta: "Launch a mixed review across your full library.",
      run: () => startSession("all", "all"),
    },
    {
      id: "new-card",
      type: "Action",
      title: "Create a new card",
      meta: "Open the focused card editor sheet.",
      run: () => openCardSheet({ section: "cards" }),
    },
    {
      id: "manager",
      type: "Action",
      title: "Open collection manager",
      meta: "Jump to the card manager for the selected deck.",
      run: () => {
        setActiveView("studio", { persist: false });
        setStudioSection("manage");
      },
    },
    {
      id: "sync",
      type: "Action",
      title: "Open sync & backup",
      meta: "Jump straight to exports, account sync, and recovery tools.",
      run: () => {
        setActiveView("progress", { persist: false });
        setProgressSection("sync");
      },
    },
  ].filter((item) => !normalizedQuery || `${item.title} ${item.meta}`.toLowerCase().includes(normalizedQuery));

  const deckResults = appState.decks
    .filter((deck) => {
      if (!normalizedQuery) {
        return false;
      }
      const deckHaystack = `${deck.name} ${deck.focus} ${deck.description}`.toLowerCase();
      return deckHaystack.includes(normalizedQuery);
    })
    .slice(0, 4)
    .map((deck) => {
      const cards = getCardsForDeck(deck.id).length;
      return {
        id: `deck:${deck.id}`,
        type: "Deck",
        title: deck.name,
        meta: `${deck.focus} · ${deck.level} · ${cards} card${cards === 1 ? "" : "s"}`,
        run: () => {
          appState.preferences.selectedDeckId = deck.id;
          setActiveView("studio", { persist: false });
          setStudioSection("manage");
          render();
          saveState();
        },
      };
    });

  const cardResults = appState.cards
    .filter((card) => {
      if (!normalizedQuery) {
        return false;
      }
      const haystack = [
        getCardDisplayTerm(card),
        card.translation,
        card.example,
        card.note,
        card.usagePattern,
        ...card.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    })
    .slice(0, 5)
    .map((card) => ({
      id: `card:${card.id}`,
      type: "Card",
      title: getCardDisplayTerm(card),
      meta: `${getDeckById(card.deckId)?.name ?? "Deck"} · ${card.translation}`,
      run: () => loadCardIntoForm(card.id),
    }));

  return [...quickActions.slice(0, normalizedQuery ? 2 : 4), ...deckResults, ...cardResults].slice(0, 8);
}

function renderCommandPalette() {
  if (!uiState.commandOpen) {
    closeCommandPalette();
    return;
  }

  uiState.commandResults = buildCommandResults(elements.commandSearchInput.value);
  if (uiState.commandResults.length === 0) {
    elements.commandResultsPanel.classList.add("hidden");
    elements.commandResultsPanel.innerHTML = "";
    return;
  }

  uiState.commandIndex = Math.min(uiState.commandIndex, uiState.commandResults.length - 1);
  elements.commandResultsPanel.innerHTML = uiState.commandResults
    .map(
      (item, index) => `
        <button
          class="command-result ${index === uiState.commandIndex ? "is-active" : ""}"
          type="button"
          data-command-index="${index}"
        >
          <span class="command-result-copy">
            <span class="command-result-title">${item.title}</span>
            <span class="command-result-meta">${item.meta}</span>
          </span>
          <span class="command-result-type">${item.type}</span>
        </button>
      `,
    )
    .join("");
  elements.commandResultsPanel.classList.remove("hidden");
}

function executeCommandResult(index) {
  const item = uiState.commandResults[index];
  if (!item) {
    return;
  }

  elements.commandSearchInput.value = "";
  closeCommandPalette();
  item.run();
}

function focusCommandSearch() {
  elements.commandSearchInput.focus();
  elements.commandSearchInput.select();
  uiState.commandOpen = true;
  renderCommandPalette();
}

function closeManagedCardSwipe() {
  uiState.openSwipeCardId = "";
  elements.managedCardList.querySelectorAll(".managed-card").forEach((card) => {
    card.style.setProperty("--swipe-offset", "0px");
    card.classList.remove("is-swipe-open");
  });
}

function setManagedCardSwipe(cardId, offset) {
  elements.managedCardList.querySelectorAll(".managed-card").forEach((card) => {
    const isTarget = card.dataset.swipeCardId === cardId;
    const nextOffset = isTarget ? offset : 0;
    card.style.setProperty("--swipe-offset", `${nextOffset}px`);
    card.classList.toggle("is-swipe-open", isTarget && nextOffset <= -100);
  });
  uiState.openSwipeCardId = offset <= -100 ? cardId : "";
}

function handleCommandInputKeydown(event) {
  if (!uiState.commandOpen) {
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    uiState.commandIndex = Math.min(uiState.commandIndex + 1, Math.max(uiState.commandResults.length - 1, 0));
    renderCommandPalette();
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    uiState.commandIndex = Math.max(uiState.commandIndex - 1, 0);
    renderCommandPalette();
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    executeCommandResult(uiState.commandIndex);
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeCommandPalette();
    elements.commandSearchInput.blur();
  }
}

function handleManagedCardPointerDown(event) {
  if (!isSwipeViewport() || event.pointerType === "mouse") {
    return;
  }

  const surface = event.target.closest(".managed-card-surface");
  if (!surface) {
    if (!event.target.closest(".managed-card") && uiState.openSwipeCardId) {
      closeManagedCardSwipe();
    }
    return;
  }

  const card = surface.closest(".managed-card");
  if (!card) {
    return;
  }

  uiState.swipePointerId = event.pointerId;
  uiState.swipeTrackingCardId = card.dataset.swipeCardId;
  uiState.swipeStartX = event.clientX;
  uiState.swipeBaseOffset = card.classList.contains("is-swipe-open") ? -MANAGED_CARD_SWIPE_WIDTH : 0;
  surface.setPointerCapture?.(event.pointerId);
}

function handleManagedCardPointerMove(event) {
  if (!isSwipeViewport() || uiState.swipePointerId !== event.pointerId || !uiState.swipeTrackingCardId) {
    return;
  }

  const delta = event.clientX - uiState.swipeStartX;
  const nextOffset = Math.max(-MANAGED_CARD_SWIPE_WIDTH, Math.min(0, uiState.swipeBaseOffset + delta));
  elements.managedCardList.querySelectorAll(".managed-card").forEach((card) => {
    const isTarget = card.dataset.swipeCardId === uiState.swipeTrackingCardId;
    card.style.setProperty("--swipe-offset", `${isTarget ? nextOffset : 0}px`);
    card.classList.toggle("is-swipe-open", false);
  });
}

function finishManagedCardSwipe(event) {
  if (uiState.swipePointerId !== event.pointerId) {
    return;
  }

  const cardId = uiState.swipeTrackingCardId;
  const card = cardId
    ? elements.managedCardList.querySelector(`[data-swipe-card-id="${cardId}"]`)
    : null;
  const currentOffset = Number.parseFloat(card?.style.getPropertyValue("--swipe-offset") ?? "0");
  if (cardId && currentOffset <= -100) {
    setManagedCardSwipe(cardId, -MANAGED_CARD_SWIPE_WIDTH);
  } else {
    closeManagedCardSwipe();
  }

  uiState.swipePointerId = null;
  uiState.swipeTrackingCardId = "";
  uiState.swipeStartX = 0;
  uiState.swipeBaseOffset = 0;
  event.target.releasePointerCapture?.(event.pointerId);
}

function setNavigationOpen(isOpen) {
  const nextState = Boolean(isOpen) && isCompactNavigationViewport();
  uiState.navOpen = nextState;
  if (nextState) {
    closeCommandPalette();
  }
  document.body.classList.toggle("nav-open", nextState);
  elements.appSidebar?.classList.toggle("is-open", nextState);
  elements.sidebarBackdrop?.classList.toggle("hidden", !nextState);
  elements.menuToggleBtn?.setAttribute("aria-expanded", String(nextState));
}

function renderViewNavigation() {
  const activeView = normalizeView(appState.preferences.activeView);
  const dueCount = getDueCards("all").length;
  const activeQueueCount = sessionState.completed ? 0 : sessionState.queue.length;
  const customDeckCount = appState.decks.filter((deck) => !seedDecks.some((seedDeck) => seedDeck.id === deck.id)).length;
  const titleMap = {
    library: "Library",
    study: "Study",
    progress: "Progress",
    studio: "Studio",
  };

  elements.libraryNavMeta.textContent = `${appState.decks.length} deck${appState.decks.length === 1 ? "" : "s"} ready to browse.`;
  elements.studyNavMeta.textContent = activeQueueCount
    ? `${activeQueueCount} card${activeQueueCount === 1 ? "" : "s"} in your current queue.`
    : `${dueCount} due now across your library.`;
  elements.progressNavMeta.textContent = `${computeStreak()} day streak with ${getMistakeCards("all").length} weak-card focus point${getMistakeCards("all").length === 1 ? "" : "s"}.`;
  elements.studioNavMeta.textContent = customDeckCount
    ? `${customDeckCount} custom deck${customDeckCount === 1 ? "" : "s"} in your collection.`
    : "Create your own decks, cards, and grammar notes.";

  const metaMap = {
    library: elements.libraryNavMeta.textContent,
    study: elements.studyNavMeta.textContent,
    progress: elements.progressNavMeta.textContent,
    studio: elements.studioNavMeta.textContent,
  };

  if (elements.activeViewTitle) {
    elements.activeViewTitle.textContent = titleMap[activeView] ?? "Wortwald";
  }
  if (elements.activeViewMeta) {
    elements.activeViewMeta.textContent = metaMap[activeView] ?? "";
  }

  elements.viewTabs.forEach((tab) => {
    const isActive = tab.dataset.viewTarget === activeView;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });

  elements.viewPanels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.viewPanel !== activeView);
  });
}

function renderPanelSectionNavigation() {
  const progressSection = normalizeProgressSection(appState.preferences.progressSection);
  elements.progressSectionTabs.forEach((tab) => {
    const isActive = tab.dataset.progressTarget === progressSection;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });
  elements.progressSectionPanels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.progressPanel !== progressSection);
  });

  const studioSection = normalizeStudioSection(appState.preferences.studioSection);
  elements.studioSectionTabs.forEach((tab) => {
    const isActive = tab.dataset.studioTarget === studioSection;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });
  elements.studioSectionPanels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.studioPanel !== studioSection);
  });

  renderSectionMenus();
}

function renderSheet() {
  const hasSheet = uiState.activeSheet === "card" || uiState.activeSheet === "deck";
  elements.sheetOverlay.classList.toggle("hidden", !hasSheet);
  elements.sheetCardPanel.classList.toggle("hidden", uiState.activeSheet !== "card");
  elements.sheetDeckPanel.classList.toggle("hidden", uiState.activeSheet !== "deck");
  document.body.classList.toggle("sheet-open", hasSheet);
}

function closeSheet(options = {}) {
  const previousSheet = uiState.activeSheet;
  uiState.activeSheet = "";
  renderSheet();
  if (options.resetCard && previousSheet === "card") {
    resetCardForm();
  }
  if (options.resetDeck && previousSheet === "deck") {
    resetDeckForm();
  }
}

function openCardSheet(options = {}) {
  if (options.reset !== false) {
    resetCardForm();
  }
  closeCommandPalette();
  setNavigationOpen(false);
  setActiveView("studio", { persist: false });
  setStudioSection(options.section ?? "cards", { persist: false });
  uiState.activeSheet = "card";
  render();
  window.setTimeout(() => {
    elements.cardTerm.focus();
  }, 0);
  if (options.persist !== false) {
    saveState();
  }
}

function openDeckSheet(options = {}) {
  if (options.reset !== false) {
    resetDeckForm();
  }
  closeCommandPalette();
  setNavigationOpen(false);
  setActiveView("studio", { persist: false });
  setStudioSection(options.section ?? "decks", { persist: false });
  uiState.activeSheet = "deck";
  render();
  window.setTimeout(() => {
    elements.deckName.focus();
  }, 0);
  if (options.persist !== false) {
    saveState();
  }
}

function setActiveView(view, options = {}) {
  const nextView = normalizeView(view);
  if (nextView !== "studio" && uiState.activeSheet) {
    closeSheet({ resetCard: true, resetDeck: true });
  }
  setNavigationOpen(false);
  closeCommandPalette();
  appState.preferences.activeView = nextView;
  renderViewNavigation();
  if (options.persist !== false) {
    saveState();
  }
}

function setProgressSection(section, options = {}) {
  appState.preferences.progressSection = normalizeProgressSection(section);
  setSectionMenuOpen("progress", false);
  renderPanelSectionNavigation();
  if (options.persist !== false) {
    saveState();
  }
}

function setStudioSection(section, options = {}) {
  appState.preferences.studioSection = normalizeStudioSection(section);
  setSectionMenuOpen("studio", false);
  renderPanelSectionNavigation();
  if (options.persist !== false) {
    saveState();
  }
}

function getCardsForDeck(deckId) {
  if (deckId === "all") {
    return appState.cards;
  }

  return appState.cards.filter((card) => card.deckId === deckId);
}

function getProgress(cardId) {
  return normalizeProgressEntry(appState.progress[cardId] ?? {});
}

function getCardDisplayTerm(card) {
  if (card.partOfSpeech === "noun" && card.article) {
    return `${card.article} ${card.term}`;
  }
  return card.term;
}

function getPartOfSpeechLabel(partOfSpeech) {
  const labels = {
    noun: "Noun",
    verb: "Verb",
    adjective: "Adjective",
    phrase: "Phrase",
  };
  return labels[partOfSpeech] ?? "Card";
}

function renderSpecialForms(card) {
  const blocks = [];
  const verbForms = normalizeVerbForms(card.verbForms);
  const adjectiveForms = normalizeAdjectiveForms(card.adjectiveForms);

  if (card.partOfSpeech === "verb") {
    const verbFields = [
      ["Auxiliary", verbForms.auxiliary],
      ["Present", verbForms.present],
      ["Simple past", verbForms.preterite],
      ["Past participle", verbForms.participle],
      ["Imperative", verbForms.imperative],
      ["Pattern", card.usagePattern || verbForms.usagePattern],
    ].filter(([, value]) => value);

    if (verbFields.length > 0) {
      blocks.push(`
        <article class="form-card">
          <p class="mini-label">Tense snapshots</p>
          <div class="form-grid">
            ${verbFields
              .map(
                ([label, value]) => `
                  <div class="form-cell">
                    <span>${label}</span>
                    <strong>${value}</strong>
                  </div>`,
              )
              .join("")}
          </div>
        </article>
      `);
    }
  }

  if (card.partOfSpeech === "adjective") {
    const adjectiveFields = [
      ["Comparative", adjectiveForms.comparative],
      ["Superlative", adjectiveForms.superlative],
      ["Usage", adjectiveForms.usage || card.usagePattern],
    ].filter(([, value]) => value);

    if (adjectiveFields.length > 0) {
      blocks.push(`
        <article class="form-card">
          <p class="mini-label">Adjective forms</p>
          <div class="form-grid">
            ${adjectiveFields
              .map(
                ([label, value]) => `
                  <div class="form-cell">
                    <span>${label}</span>
                    <strong>${value}</strong>
                  </div>`,
              )
              .join("")}
          </div>
        </article>
      `);
    }
  }

  if (card.partOfSpeech === "phrase" && card.note) {
    blocks.push(`
      <article class="form-card">
        <p class="mini-label">Phrase focus</p>
        <div class="form-grid">
          <div class="form-cell">
            <span>Usage</span>
            <strong>${card.note}</strong>
          </div>
        </div>
      </article>
    `);
  }

  elements.specialFormsPanel.innerHTML = blocks.join("");
  elements.specialFormsPanel.classList.toggle("hidden", blocks.length === 0);
}

function clearVariantFieldVisibility() {
  elements.nounFields.classList.add("hidden");
  elements.verbFields.classList.add("hidden");
  elements.adjectiveFields.classList.add("hidden");
}

function applyCardTypeUI() {
  const type = elements.cardPartOfSpeech.value;
  clearVariantFieldVisibility();

  const termConfig = {
    noun: {
      label: "German noun",
      placeholder: "Rechnung",
      translation: "bill, invoice",
      intro: "Capture article instinct, plural patterns, and example-heavy usage.",
    },
    verb: {
      label: "German infinitive",
      placeholder: "umsteigen",
      translation: "to change trains",
      intro: "Save the base verb plus tense snapshots learners usually memorize together.",
    },
    adjective: {
      label: "German adjective",
      placeholder: "wichtig",
      translation: "important",
      intro: "Keep the positive, comparative, and superlative forms close together.",
    },
    phrase: {
      label: "German phrase",
      placeholder: "Ich hätte gern",
      translation: "I would like",
      intro: "Use phrases for reusable chunks, politeness formulas, and set expressions.",
    },
  }[type] ?? {
    label: "German term",
    placeholder: "Rechnung",
    translation: "meaning",
    intro: "Add your own terms, examples, and notes.",
  };

  const termLabel = elements.cardTerm.closest(".field")?.querySelector("span");
  const translationLabel = elements.cardTranslation.closest(".field")?.querySelector("span");
  if (termLabel) {
    termLabel.textContent = termConfig.label;
  }
  if (translationLabel) {
    translationLabel.textContent = type === "phrase" ? "English meaning" : "English gloss";
  }
  elements.cardTerm.placeholder = termConfig.placeholder;
  elements.cardTranslation.placeholder = termConfig.translation;
  if (!studioState.editingCardId) {
    elements.cardFormIntro.textContent = termConfig.intro;
  }

  if (type === "noun") {
    elements.nounFields.classList.remove("hidden");
  }
  if (type === "verb") {
    elements.verbFields.classList.remove("hidden");
  }
  if (type === "adjective") {
    elements.adjectiveFields.classList.remove("hidden");
  }
}

function createBlankProgressEntry(updatedAt = new Date().toISOString()) {
  return normalizeProgressEntry({
    repetitions: 0,
    intervalDays: 0,
    ease: 2.5,
    stability: 0.4,
    difficulty: 5,
    dueAt: null,
    lapses: 0,
    lastReviewedAt: null,
    lastScore: null,
    updatedAt,
    lastTypedScore: null,
    lastRecordingAt: null,
  });
}

function mergeTombstoneLists(left, right) {
  const map = new Map();
  [...(left ?? []), ...(right ?? [])].forEach((entry) => {
    const normalized = normalizeTombstoneEntry(entry);
    if (!normalized.id) {
      return;
    }
    const existing = map.get(normalized.id);
    if (!existing || entityTimestamp(normalized) >= entityTimestamp(existing)) {
      map.set(normalized.id, normalized);
    }
  });
  return [...map.values()].sort((a, b) => entityTimestamp(b) - entityTimestamp(a)).slice(0, 500);
}

function addDeckTombstone(deckId, updatedAt = new Date().toISOString()) {
  appState.tombstones.decks = mergeTombstoneLists(appState.tombstones.decks, [{ id: deckId, updatedAt }]);
}

function addCardTombstone(cardId, updatedAt = new Date().toISOString()) {
  appState.tombstones.cards = mergeTombstoneLists(appState.tombstones.cards, [{ id: cardId, updatedAt }]);
}

function formatInterval(intervalDays) {
  if (!intervalDays) {
    return "New card";
  }

  if (intervalDays === 1) {
    return "1 day";
  }

  return `${intervalDays} days`;
}

function isDue(card) {
  const progress = getProgress(card.id);
  if (!progress.dueAt) {
    return true;
  }

  return new Date(progress.dueAt).getTime() <= Date.now();
}

function getDueCards(deckId = "all") {
  return getCardsForDeck(deckId)
    .filter((card) => isDue(card))
    .sort((left, right) => {
      const leftDue = getProgress(left.id).dueAt ?? "";
      const rightDue = getProgress(right.id).dueAt ?? "";
      return leftDue.localeCompare(rightDue);
    });
}

function getDuePriority(card) {
  const progress = getProgress(card.id);
  const dueAt = progress.dueAt ? new Date(progress.dueAt).getTime() : 0;
  const overdueDays = progress.dueAt ? Math.max(0, (Date.now() - dueAt) / 86400000) : 3;
  const easePenalty = Math.max(0, 2.6 - (progress.ease ?? 2.5));
  const lapseWeight = (progress.lapses ?? 0) * 1.75;
  const newCardWeight = progress.repetitions === 0 ? 1.2 : 0;
  return overdueDays * 3 + lapseWeight + easePenalty + newCardWeight;
}

function sortDueCards(cards) {
  return [...cards].sort((left, right) => getDuePriority(right) - getDuePriority(left));
}

function sortMixedCards(cards) {
  return [...cards].sort((left, right) => {
    const leftProgress = getProgress(left.id);
    const rightProgress = getProgress(right.id);
    const leftScore =
      (leftProgress.repetitions === 0 ? 5 : 0) + (leftProgress.lapses ?? 0) + Math.max(0, 2.5 - leftProgress.ease);
    const rightScore =
      (rightProgress.repetitions === 0 ? 5 : 0) + (rightProgress.lapses ?? 0) + Math.max(0, 2.5 - rightProgress.ease);
    if (leftScore !== rightScore) {
      return rightScore - leftScore;
    }

    return left.term.localeCompare(right.term);
  });
}

function getUpcomingCard(deckId = "all") {
  const candidates = getCardsForDeck(deckId)
    .filter((card) => !isDue(card))
    .sort((left, right) => {
      const leftDue = new Date(getProgress(left.id).dueAt).getTime();
      const rightDue = new Date(getProgress(right.id).dueAt).getTime();
      return leftDue - rightDue;
    });

  return candidates[0] ?? null;
}

function formatDate(dateString, options = {}) {
  if (!dateString) {
    return "Ready now";
  }

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    ...options,
  }).format(date);
}

function getTodayKey(dateString = new Date().toISOString()) {
  return new Date(dateString).toISOString().slice(0, 10);
}

function computeStreak() {
  const uniqueDays = [...new Set(appState.sessions.map((entry) => getTodayKey(entry.timestamp)))]
    .sort()
    .reverse();

  if (uniqueDays.length === 0) {
    return 0;
  }

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (const day of uniqueDays) {
    const candidate = new Date(day);
    candidate.setHours(0, 0, 0, 0);
    const difference = Math.round((cursor - candidate) / 86400000);
    if (difference === 0 || (difference === 1 && streak === 0)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    if (difference > 1) {
      break;
    }
  }

  return streak;
}

function getMasteredCount() {
  return appState.cards.filter((card) => getProgress(card.id).intervalDays >= 14).length;
}

function getTodayReviewCount() {
  const today = getTodayKey();
  return appState.sessions.filter((entry) => getTodayKey(entry.timestamp) === today).length;
}

function getAverageEase() {
  const values = Object.values(appState.progress).map((progress) => progress.ease ?? 2.5);
  if (values.length === 0) {
    return 2.5;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getWeakSpots() {
  const tagScores = new Map();
  const strugglingCards = appState.cards
    .map((card) => ({ card, progress: getProgress(card.id) }))
    .filter(({ progress }) => progress.lapses > 0 || progress.ease < 2.2)
    .sort((left, right) => {
      const leftScore = left.progress.lapses * 2 + (2.5 - left.progress.ease);
      const rightScore = right.progress.lapses * 2 + (2.5 - right.progress.ease);
      return rightScore - leftScore;
    });

  strugglingCards.forEach(({ card, progress }) => {
    card.tags.forEach((tag) => {
      const current = tagScores.get(tag) ?? 0;
      tagScores.set(tag, current + progress.lapses + Math.max(0, 2.5 - progress.ease));
    });
  });

  return {
    cards: strugglingCards.slice(0, 3),
    tags: [...tagScores.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5),
  };
}

function getMistakeCards(deckId = "all") {
  return getCardsForDeck(deckId)
    .filter((card) => {
      const progress = getProgress(card.id);
      return (progress.lapses ?? 0) > 0 || (progress.ease ?? 2.5) < 2.2 || progress.lastTypedScore === "again";
    })
    .sort((left, right) => getDuePriority(right) - getDuePriority(left));
}

function pickMode(card, source = "due") {
  if (source === "listening") {
    return "listening";
  }

  const progress = getProgress(card.id);
  const modes = ["translation"];

  if (card.article) {
    modes.push("article");
  }

  if (card.example) {
    modes.push("cloze");
  }

  if (!card.article) {
    modes.push("reverse");
  }

  const index = (progress.repetitions + card.term.length) % modes.length;
  return modes[index];
}

function buildPrompt(card, mode) {
  const baseAnswer = getCardDisplayTerm(card);
  switch (mode) {
    case "article":
      return {
        badge: "Article Drill",
        title: card.term,
        subtitle: "Recall the correct article before revealing the full answer.",
        answerMain: card.term,
        translation: card.translation,
      };
    case "cloze": {
      const hiddenTerm = card.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const sentence = card.example.replace(new RegExp(hiddenTerm, "i"), "_____");
      return {
        badge: "Cloze",
        title: sentence,
        subtitle: "Fill the gap and say the base German term aloud.",
        answerMain: baseAnswer,
        translation: card.translation,
      };
    }
    case "listening":
      return {
        badge: "Listening",
        title: "Listen to the German prompt and type what you hear.",
        subtitle: "Use Play prompt if you need another pass before checking.",
        answerMain: baseAnswer,
        translation: card.translation,
      };
    case "reverse":
      return {
        badge: "Reverse",
        title: card.term,
        subtitle: "Say the meaning in English before you peek.",
        answerMain: card.term,
        translation: card.translation,
      };
    default:
      return {
        badge: "Translation",
        title: card.translation,
        subtitle:
          card.partOfSpeech === "verb"
            ? "Produce the German infinitive and recall the tense snapshots after reveal."
            : card.partOfSpeech === "adjective"
              ? "Produce the German adjective and check the comparison forms after reveal."
              : "Produce the German term and any useful article or pattern.",
        answerMain: baseAnswer,
        translation: card.translation,
      };
  }
}

function getTypedAnswerLabel(mode) {
  if (mode === "article") {
    return "Type the article or the full noun";
  }
  if (mode === "reverse") {
    return "Type the English meaning";
  }
  if (mode === "listening") {
    return "Type the German you hear";
  }
  return "Type your answer";
}

function getExpectedAnswers(card, mode) {
  const fullGerman = getCardDisplayTerm(card);
  if (mode === "article") {
    return {
      primary: [card.article, fullGerman].filter(Boolean),
      secondary: [card.term].filter(Boolean),
    };
  }

  if (mode === "reverse") {
    const translations = String(card.translation)
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
    return {
      primary: translations,
      secondary: [],
    };
  }

  return {
    primary: [fullGerman, card.term].filter(Boolean),
    secondary: [],
  };
}

function evaluateTypedAnswer(userInput, card, mode) {
  const answer = String(userInput ?? "").trim();
  if (!answer) {
    return {
      grade: "miss",
      suggestedScore: "again",
      message: "No typed answer yet. Reveal if you want to self-rate instead.",
    };
  }

  const expected = getExpectedAnswers(card, mode);
  const normalizedInput = normalizeAnswerText(answer);
  const primaryMatches = expected.primary.map((value) => normalizeAnswerText(value)).filter(Boolean);
  const secondaryMatches = expected.secondary.map((value) => normalizeAnswerText(value)).filter(Boolean);

  if (primaryMatches.includes(normalizedInput)) {
    return {
      grade: "perfect",
      suggestedScore: "easy",
      message: "Perfect recall. You matched the target answer cleanly.",
    };
  }

  if (secondaryMatches.includes(normalizedInput)) {
    return {
      grade: "close",
      suggestedScore: "good",
      message: "Close. The core word is right, but you missed part of the preferred form.",
    };
  }

  const bestDistance = [...primaryMatches, ...secondaryMatches].reduce((best, candidate) => {
    return Math.min(best, levenshteinDistance(normalizedInput, candidate));
  }, Number.POSITIVE_INFINITY);

  if (Number.isFinite(bestDistance) && bestDistance <= 2) {
    return {
      grade: "close",
      suggestedScore: "hard",
      message: "Almost there. This looks like a small spelling or form slip.",
    };
  }

  if (mode === "reverse") {
    const anyWordMatch = primaryMatches.some((candidate) =>
      candidate.split(" ").some((token) => token && normalizedInput.includes(token)),
    );
    if (anyWordMatch) {
      return {
        grade: "partial",
        suggestedScore: "hard",
        message: "Partial meaning captured. The idea is close, but not fully precise yet.",
      };
    }
  }

  if (mode !== "reverse" && normalizeAnswerText(card.term) === normalizedInput) {
    return {
      grade: "partial",
      suggestedScore: "hard",
      message: "The base word is right. Tighten the article or full expression next time.",
    };
  }

  return {
    grade: "miss",
    suggestedScore: "again",
    message: "Not quite. Use the reveal, listen again, and repeat it aloud once.",
  };
}

function createQueue(deckId, source = "due") {
  const goal = Math.max(1, Number(appState.preferences.dailyGoal) || 12);
  let cards;
  if (source === "all") {
    cards = sortMixedCards(getCardsForDeck(deckId)).slice(0, Math.max(goal, 12));
  } else if (source === "mistakes") {
    cards = getMistakeCards(deckId).slice(0, goal);
  } else if (source === "listening") {
    cards = sortMixedCards(getCardsForDeck(deckId))
      .filter((card) => card.example || card.term)
      .slice(0, Math.max(goal, 10));
  } else {
    cards = sortDueCards(getDueCards(deckId)).slice(0, goal);
  }

  return cards.map((card) => ({
    cardId: card.id,
    mode: pickMode(card, source),
  }));
}

function startSession(deckId = "all", source = "due") {
  setNavigationOpen(false);
  closeCommandPalette();
  const queue = createQueue(deckId, source);
  const fallback = source === "due" ? getUpcomingCard(deckId) : null;

  sessionState.queue = queue;
  sessionState.currentIndex = 0;
  sessionState.revealed = false;
  sessionState.source = source;
  sessionState.deckId = deckId;
  sessionState.completed = false;
  sessionState.summary = createSessionSummary();
  sessionState.typedAnswer = "";
  sessionState.lastEvaluation = null;
  sessionState.autoPlayedKey = null;
  if (audioState.isRecording && audioState.mediaRecorder) {
    audioState.mediaRecorder.stop();
    audioState.isRecording = false;
  }
  if (audioState.currentRecordingUrl) {
    URL.revokeObjectURL(audioState.currentRecordingUrl);
    audioState.currentRecordingUrl = null;
  }
  if (deckId !== "all") {
    appState.preferences.selectedDeckId = deckId;
  }
  appState.preferences.activeView = "study";

  if (queue.length === 0) {
    elements.studyArea.classList.add("hidden");
    elements.studyEmpty.classList.remove("hidden");
    if (fallback) {
      const deckName = getDeckById(fallback.deckId)?.name ?? "this deck";
      elements.studyEmpty.innerHTML = `
        <p class="empty-title">Nothing is due right now</p>
        <p class="empty-copy">
          Your next card in ${deckName} comes back on ${formatDate(getProgress(fallback.id).dueAt)}.
          Use "Mix all decks" if you want extra practice anyway.
        </p>
      `;
    } else {
      elements.studyEmpty.innerHTML = `
        <p class="empty-title">No cards available yet</p>
        <p class="empty-copy">
          Add a card in the studio below or start with the built-in demo decks.
        </p>
      `;
    }
    elements.sessionStatus.textContent = "No active queue";
    saveState();
    render();
    return;
  }

  elements.studyEmpty.classList.add("hidden");
  elements.studyArea.classList.remove("hidden");
  saveState();
  render();
}

function getCurrentQueueItem() {
  return sessionState.queue[sessionState.currentIndex] ?? null;
}

function getCurrentCard() {
  const item = getCurrentQueueItem();
  if (!item) {
    return null;
  }

  return appState.cards.find((card) => card.id === item.cardId) ?? null;
}

function scheduleReview(progress, score) {
  const now = Date.now();
  const previousEase = progress.ease ?? 2.5;
  const previousInterval = progress.intervalDays ?? 0;
  const elapsedDays = progress.lastReviewedAt
    ? Math.max(0, (now - new Date(progress.lastReviewedAt).getTime()) / 86400000)
    : 0;
  const previousStability = progress.stability ?? Math.max(0.4, previousInterval || 0.4);
  const previousDifficulty = progress.difficulty ?? clamp(8 - previousEase * 2, 1.5, 8.5);
  const reviewedAt = new Date(now).toISOString();

  if (score === "again") {
    const difficulty = clamp(previousDifficulty + 0.65, 1, 10);
    const stability = clamp(0.25 + elapsedDays * 0.08, 0.2, 2);
    return {
      ...progress,
      repetitions: 0,
      intervalDays: 0,
      ease: clamp(3.45 - difficulty * 0.22, 1.3, 3.4),
      stability,
      difficulty,
      dueAt: new Date(now + 15 * 60 * 1000).toISOString(),
      lapses: (progress.lapses ?? 0) + 1,
      lastReviewedAt: reviewedAt,
      lastScore: score,
      updatedAt: reviewedAt,
    };
  }

  if (score === "hard") {
    const difficulty = clamp(previousDifficulty + 0.2, 1, 10);
    const stability = clamp(previousStability * 1.25 + 0.45 + elapsedDays * 0.25, 0.5, 120);
    const intervalDays = Math.max(1, Math.round(stability));
    return {
      ...progress,
      repetitions: (progress.repetitions ?? 0) + 1,
      intervalDays,
      ease: clamp(3.45 - difficulty * 0.2, 1.3, 3.4),
      stability,
      difficulty,
      dueAt: new Date(now + intervalDays * 86400000).toISOString(),
      lastReviewedAt: reviewedAt,
      lastScore: score,
      updatedAt: reviewedAt,
    };
  }

  if (score === "easy") {
    const difficulty = clamp(previousDifficulty - 0.32, 1, 10);
    const stability = clamp(previousStability * 2.35 + 2.1 + elapsedDays * 0.6, 1.5, 365);
    const intervalDays = Math.max(4, Math.round(stability));
    return {
      ...progress,
      repetitions: (progress.repetitions ?? 0) + 1,
      intervalDays,
      ease: clamp(3.45 - difficulty * 0.19, 1.3, 3.4),
      stability,
      difficulty,
      dueAt: new Date(now + intervalDays * 86400000).toISOString(),
      lastReviewedAt: reviewedAt,
      lastScore: score,
      updatedAt: reviewedAt,
    };
  }

  const difficulty = clamp(previousDifficulty - 0.12, 1, 10);
  const stability = clamp(previousStability * 1.75 + 1.1 + elapsedDays * 0.4, 1, 240);
  const intervalDays = previousInterval === 0 ? 1 : previousInterval === 1 ? 3 : Math.max(2, Math.round(stability));
  return {
    ...progress,
    repetitions: (progress.repetitions ?? 0) + 1,
    intervalDays,
    ease: clamp(3.45 - difficulty * 0.2, 1.3, 3.4),
    stability,
    difficulty,
    dueAt: new Date(now + intervalDays * 86400000).toISOString(),
    lastReviewedAt: reviewedAt,
    lastScore: score,
    updatedAt: reviewedAt,
  };
}

function rateCurrentCard(score) {
  const card = getCurrentCard();
  const currentItem = getCurrentQueueItem();
  if (!card || !sessionState.revealed) {
    return;
  }

  const nextProgress = scheduleReview(getProgress(card.id), score);
  if (sessionState.lastEvaluation?.suggestedScore) {
    nextProgress.lastTypedScore = sessionState.lastEvaluation.suggestedScore;
  }
  appState.progress[card.id] = nextProgress;
  sessionState.summary.reviewed += 1;
  sessionState.summary[score] += 1;
  appState.sessions.unshift({
    id: createId("session"),
    cardId: card.id,
    deckId: card.deckId,
    term: card.term,
    score,
    timestamp: new Date().toISOString(),
  });
  appState.sessions = appState.sessions.slice(0, 80);

  if (score === "again") {
    sessionState.queue.push({
      cardId: card.id,
      mode: currentItem?.mode ?? "translation",
    });
  }

  sessionState.currentIndex += 1;
  sessionState.revealed = false;
  sessionState.typedAnswer = "";
  sessionState.lastEvaluation = null;

  if (sessionState.currentIndex >= sessionState.queue.length) {
    sessionState.completed = true;
    sessionState.queue = [];
    sessionState.currentIndex = 0;
  }

  saveState();
  render();
}

function checkTypedAnswer() {
  const card = getCurrentCard();
  const item = getCurrentQueueItem();
  if (!card || !item) {
    return;
  }

  sessionState.typedAnswer = elements.typedAnswerInput.value;
  sessionState.lastEvaluation = evaluateTypedAnswer(sessionState.typedAnswer, card, item.mode);
  sessionState.revealed = true;
  renderStudy();
}

function pronounceCurrentCard(force = false) {
  const card = getCurrentCard();
  if (!card || !("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(getCardDisplayTerm(card));
  utterance.lang = "de-DE";
  utterance.rate = force ? 0.87 : 0.93;
  window.speechSynthesis.speak(utterance);
}

function updateRecordingUI(message) {
  if (message) {
    elements.recordingStatusText.textContent = message;
  }
  elements.recordBtn.classList.toggle("hidden", audioState.isRecording);
  elements.stopRecordBtn.classList.toggle("hidden", !audioState.isRecording);
  elements.playRecordBtn.disabled = !audioState.currentRecordingUrl;
}

async function startAnswerRecording() {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    updateRecordingUI("This browser does not support microphone recording.");
    return;
  }

  if (audioState.isRecording) {
    return;
  }

  try {
    if (!audioState.stream) {
      audioState.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }

    audioState.chunks = [];
    audioState.mediaRecorder = new MediaRecorder(audioState.stream);
    audioState.mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        audioState.chunks.push(event.data);
      }
    });
    audioState.mediaRecorder.addEventListener("stop", () => {
      const blob = new Blob(audioState.chunks, { type: "audio/webm" });
      if (audioState.currentRecordingUrl) {
        URL.revokeObjectURL(audioState.currentRecordingUrl);
      }
      audioState.currentRecordingUrl = URL.createObjectURL(blob);
      audioState.isRecording = false;
      const currentCard = getCurrentCard();
      if (currentCard) {
        const nextProgress = normalizeProgressEntry(getProgress(currentCard.id));
        nextProgress.lastRecordingAt = new Date().toISOString();
        nextProgress.updatedAt = nextProgress.lastRecordingAt;
        appState.progress[currentCard.id] = nextProgress;
        saveState();
      }
      updateRecordingUI("Recording saved for this review turn. Play it back and compare with the prompt.");
    });

    audioState.mediaRecorder.start();
    audioState.isRecording = true;
    updateRecordingUI("Recording... say your answer clearly, then stop and listen back.");
  } catch (error) {
    console.warn("Microphone recording failed.", error);
    updateRecordingUI("Microphone access failed. Check browser permissions and try again.");
  }
}

function stopAnswerRecording() {
  if (!audioState.isRecording || !audioState.mediaRecorder) {
    return;
  }

  audioState.mediaRecorder.stop();
}

function playLastRecording() {
  if (!audioState.currentRecordingUrl) {
    updateRecordingUI("No take yet. Record yourself once and then play it back.");
    return;
  }

  const audio = new Audio(audioState.currentRecordingUrl);
  audio.play().catch(() => {
    updateRecordingUI("Playback failed in this browser session.");
  });
}

function releaseAudioResources() {
  if (audioState.currentRecordingUrl) {
    URL.revokeObjectURL(audioState.currentRecordingUrl);
    audioState.currentRecordingUrl = null;
  }
  if (audioState.stream) {
    audioState.stream.getTracks().forEach((track) => track.stop());
    audioState.stream = null;
  }
  audioState.mediaRecorder = null;
  audioState.chunks = [];
  audioState.isRecording = false;
}

function resetDeckForm() {
  studioState.editingDeckId = null;
  elements.deckForm.reset();
  elements.deckFormTitle.textContent = "New deck";
  elements.deckFormIntro.textContent = "Organize vocabulary by topic, level, or real-life context.";
  elements.deckSubmitBtn.textContent = "Create deck";
  elements.deckCancelBtn.classList.add("hidden");
}

function resetCardForm() {
  studioState.editingCardId = null;
  elements.cardForm.reset();
  elements.cardPartOfSpeech.value = "noun";
  elements.cardFormTitle.textContent = "New card";
  elements.cardFormIntro.textContent = "Add your own nouns, verbs, adjectives, examples, and notes.";
  elements.cardSubmitBtn.textContent = "Save card";
  elements.cardCancelBtn.classList.add("hidden");
  renderDeckSelects();
  applyCardTypeUI();
}

function loadDeckIntoForm(deckId) {
  const deck = getDeckById(deckId);
  if (!deck) {
    return;
  }

  closeCommandPalette();
  appState.preferences.selectedDeckId = deck.id;
  setActiveView("studio");
  setStudioSection(appState.preferences.studioSection === "manage" ? "manage" : "decks", { persist: false });
  studioState.editingDeckId = deck.id;
  elements.deckName.value = deck.name;
  elements.deckLevel.value = deck.level;
  elements.deckFocus.value = deck.focus;
  elements.deckDescription.value = deck.description;
  elements.deckFormTitle.textContent = "Edit deck";
  elements.deckFormIntro.textContent = "Tighten the deck framing, level, and description.";
  elements.deckSubmitBtn.textContent = "Update deck";
  elements.deckCancelBtn.classList.remove("hidden");
  uiState.activeSheet = "deck";
  render();
}

function loadCardIntoForm(cardId) {
  const card = getCardById(cardId);
  if (!card) {
    return;
  }

  const verbForms = normalizeVerbForms(card.verbForms);
  const adjectiveForms = normalizeAdjectiveForms(card.adjectiveForms);
  closeCommandPalette();
  appState.preferences.selectedDeckId = card.deckId;
  setActiveView("studio");
  setStudioSection(appState.preferences.studioSection === "manage" ? "manage" : "cards", { persist: false });
  studioState.editingCardId = card.id;
  elements.cardDeckSelect.value = card.deckId;
  elements.cardPartOfSpeech.value = card.partOfSpeech;
  elements.cardTerm.value = card.term;
  elements.cardTranslation.value = card.translation;
  elements.cardArticle.value = card.article;
  elements.cardPlural.value = card.plural;
  elements.cardVerbAuxiliary.value = verbForms.auxiliary;
  elements.cardVerbPresent.value = verbForms.present;
  elements.cardVerbPreterite.value = verbForms.preterite;
  elements.cardVerbParticiple.value = verbForms.participle;
  elements.cardVerbImperative.value = verbForms.imperative;
  elements.cardUsagePattern.value = card.usagePattern || verbForms.usagePattern;
  elements.cardAdjectiveComparative.value = adjectiveForms.comparative;
  elements.cardAdjectiveSuperlative.value = adjectiveForms.superlative;
  elements.cardAdjectiveUsage.value = adjectiveForms.usage;
  elements.cardLevel.value = card.level;
  elements.cardExample.value = card.example;
  elements.cardExampleTranslation.value = card.exampleTranslation;
  elements.cardNote.value = card.note;
  elements.cardTags.value = card.tags.join(", ");
  elements.cardFormTitle.textContent = "Edit card";
  elements.cardFormIntro.textContent = "Refine wording, grammar notes, or move this card into a better deck.";
  elements.cardSubmitBtn.textContent = "Update card";
  elements.cardCancelBtn.classList.remove("hidden");
  applyCardTypeUI();
  uiState.activeSheet = "card";
  render();
}

function syncSessionAfterDataChange() {
  const validCards = new Set(appState.cards.map((card) => card.id));
  sessionState.queue = sessionState.queue.filter((item) => validCards.has(item.cardId));

  if (sessionState.currentIndex >= sessionState.queue.length) {
    sessionState.currentIndex = Math.max(0, sessionState.queue.length - 1);
  }

  if (sessionState.deckId !== "all" && !getDeckById(sessionState.deckId)) {
    sessionState.deckId = "all";
  }

  if (sessionState.queue.length === 0) {
    sessionState.currentIndex = 0;
    sessionState.revealed = false;
    sessionState.completed = false;
  }
}

function renderDeckSelects() {
  const editingCardDeckId = studioState.editingCardId ? getCardById(studioState.editingCardId)?.deckId : null;
  const desiredDeckId =
    editingCardDeckId ??
    elements.cardDeckSelect.value ??
    getManagerDeckId() ??
    appState.decks[0]?.id ??
    "";
  const options = appState.decks
    .map(
      (deck) =>
        `<option value="${deck.id}">${deck.name}</option>`,
    )
    .join("");
  elements.cardDeckSelect.innerHTML = options;
  elements.cardDeckSelect.disabled = appState.decks.length === 0;
  if (desiredDeckId) {
    elements.cardDeckSelect.value = desiredDeckId;
  }
}

function renderDecks() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const level = elements.levelFilter.value;

  const visibleDecks = appState.decks.filter((deck) => {
    const cards = getCardsForDeck(deck.id);
    const haystack = [
      deck.name,
      deck.focus,
      deck.description,
      ...cards.flatMap((card) => [
        card.term,
        card.translation,
        card.partOfSpeech,
        card.usagePattern,
        ...Object.values(card.verbForms ?? {}),
        ...Object.values(card.adjectiveForms ?? {}),
        ...card.tags,
      ]),
    ]
      .join(" ")
      .toLowerCase();

    const matchesQuery = !query || haystack.includes(query);
    const matchesLevel = level === "all" || deck.level === level || cards.some((card) => card.level === level);
    return matchesQuery && matchesLevel;
  });

  if (visibleDecks.length === 0) {
    elements.deckGrid.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">No decks match that filter</p>
        <p class="empty-copy">Try a broader search or add your own deck below.</p>
      </div>
    `;
    return;
  }

  elements.deckGrid.innerHTML = visibleDecks
    .map((deck) => {
      const cards = getCardsForDeck(deck.id);
      const dueCount = getDueCards(deck.id).length;
      const mastered = cards.filter((card) => getProgress(card.id).intervalDays >= 14).length;
      const reviewed = cards.filter((card) => getProgress(card.id).repetitions > 0).length;

      return `
        <article class="deck-card ${appState.preferences.selectedDeckId === deck.id ? "is-selected" : ""}">
          <div class="deck-header">
            <div>
              <p class="deck-meta">${deck.focus}</p>
              <h3 class="deck-title">${deck.name}</h3>
            </div>
            <span class="level-badge">${deck.level}</span>
          </div>

          <p class="deck-description">${deck.description}</p>

          <div class="deck-stats">
            <div class="deck-stat">
              <span class="deck-meta">Cards</span>
              <strong>${cards.length}</strong>
            </div>
            <div class="deck-stat">
              <span class="deck-meta">Due now</span>
              <strong>${dueCount}</strong>
            </div>
            <div class="deck-stat">
              <span class="deck-meta">Mastered</span>
              <strong>${mastered}/${cards.length}</strong>
            </div>
          </div>

          <div class="deck-actions">
            <button class="button button-primary" data-action="study-deck" data-deck-id="${deck.id}">
              Study due
            </button>
            <button class="button button-secondary" data-action="mix-deck" data-deck-id="${deck.id}">
              Mix deck
            </button>
            <button class="button button-ghost" data-action="select-deck" data-deck-id="${deck.id}">
              Manage
            </button>
          </div>

          <div class="deck-tags">
            <span class="pill">${reviewed} reviewed</span>
            <span class="pill">${Math.max(cards.length - reviewed, 0)} unseen</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function getManagedCardActionButtons(cardId, className = "") {
  const classes = ["managed-card-actions", className].filter(Boolean).join(" ");
  return `
    <div class="${classes}">
      <button class="button button-ghost" data-action="edit-card" data-card-id="${cardId}">
        Edit
      </button>
      <button class="button button-ghost" data-action="reset-card-progress" data-card-id="${cardId}">
        Reset
      </button>
      <button class="button button-ghost danger-button" data-action="delete-card" data-card-id="${cardId}">
        Delete
      </button>
    </div>
  `;
}

function renderManager() {
  const managerDeckId = getManagerDeckId();
  const deck = managerDeckId ? getDeckById(managerDeckId) : null;
  const query = elements.managerSearchInput.value.trim().toLowerCase();
  const filter = elements.managerFilter.value;

  elements.managerSearchInput.disabled = !deck;
  elements.managerFilter.disabled = !deck;

  if (!deck) {
    elements.selectedDeckPanel.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">No deck selected yet</p>
        <p class="empty-copy">Create a deck above to start building your collection.</p>
      </div>
    `;
    elements.managedCardList.innerHTML = "";
    return;
  }

  const cards = getCardsForDeck(deck.id).sort((left, right) => {
    const leftDue = isDue(left) ? 0 : 1;
    const rightDue = isDue(right) ? 0 : 1;
    if (leftDue !== rightDue) {
      return leftDue - rightDue;
    }

    return left.term.localeCompare(right.term);
  });

  const dueCount = getDueCards(deck.id).length;
  const reviewedCount = cards.filter((card) => getProgress(card.id).repetitions > 0).length;
  const masteredCount = cards.filter((card) => getProgress(card.id).intervalDays >= 14).length;
  const filteredCards = cards.filter((card) => {
    const progress = getProgress(card.id);
    const haystack = [
      getCardDisplayTerm(card),
      card.translation,
      card.example,
      card.note,
      card.usagePattern,
      ...Object.values(card.verbForms ?? {}),
      ...Object.values(card.adjectiveForms ?? {}),
      ...card.tags,
    ]
      .join(" ")
      .toLowerCase();

    const matchesQuery = !query || haystack.includes(query);
    const matchesFilter =
      filter === "all" ||
      (filter === "due" && isDue(card)) ||
      (filter === "new" && (progress.repetitions ?? 0) === 0) ||
      (filter === "learning" && (progress.repetitions ?? 0) > 0 && (progress.intervalDays ?? 0) < 14) ||
      (filter === "mastered" && (progress.intervalDays ?? 0) >= 14);

    return matchesQuery && matchesFilter;
  });

  elements.selectedDeckPanel.innerHTML = `
    <article class="selected-deck-card">
      <div class="selected-deck-head">
        <div>
          <p class="deck-meta">${deck.focus}</p>
          <h3 class="deck-title">${deck.name}</h3>
        </div>
        <span class="level-badge">${deck.level}</span>
      </div>
      <p class="deck-description">${deck.description}</p>
      <div class="deck-stats">
        <div class="deck-stat">
          <span class="deck-meta">Cards</span>
          <strong>${cards.length}</strong>
        </div>
        <div class="deck-stat">
          <span class="deck-meta">Due now</span>
          <strong>${dueCount}</strong>
        </div>
        <div class="deck-stat">
          <span class="deck-meta">Reviewed</span>
          <strong>${reviewedCount}/${cards.length}</strong>
        </div>
        <div class="deck-stat">
          <span class="deck-meta">Mastered</span>
          <strong>${masteredCount}</strong>
        </div>
      </div>
      <p class="manager-summary">
        Showing ${filteredCards.length} of ${cards.length} card${cards.length === 1 ? "" : "s"} in this deck.
      </p>
      <div class="deck-actions">
        <button class="button button-primary" data-action="study-deck" data-deck-id="${deck.id}">
          Study due
        </button>
        <button class="button button-secondary" data-action="mix-deck" data-deck-id="${deck.id}">
          Mix deck
        </button>
        <button class="button button-ghost" data-action="edit-deck" data-deck-id="${deck.id}">
          Edit deck
        </button>
        <button class="button button-ghost danger-button" data-action="delete-deck" data-deck-id="${deck.id}">
          Delete deck
        </button>
      </div>
    </article>
  `;

  if (cards.length === 0) {
    elements.managedCardList.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">This deck is empty</p>
        <p class="empty-copy">Add a first card in the form above and it will appear here.</p>
      </div>
    `;
    return;
  }

  if (filteredCards.length === 0) {
    elements.managedCardList.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">No cards match those filters</p>
        <p class="empty-copy">Try a broader search or switch the manager filter back to all cards.</p>
      </div>
    `;
    return;
  }

  elements.managedCardList.innerHTML = filteredCards
    .map((card) => {
      const progress = getProgress(card.id);
      const fullTerm = getCardDisplayTerm(card);
      const dueText = isDue(card) ? "Due now" : `Next ${formatDate(progress.dueAt)}`;
      const tags = [...card.tags];
      const verbForms = normalizeVerbForms(card.verbForms);
      const adjectiveForms = normalizeAdjectiveForms(card.adjectiveForms);
      if (card.plural) {
        tags.unshift(card.plural);
      }
      if (card.partOfSpeech === "verb") {
        [verbForms.present, verbForms.participle].filter(Boolean).forEach((value) => tags.unshift(value));
      }
      if (card.partOfSpeech === "adjective") {
        [adjectiveForms.comparative, adjectiveForms.superlative]
          .filter(Boolean)
          .forEach((value) => tags.unshift(value));
      }

      return `
        <article class="managed-card" data-swipe-card-id="${card.id}">
          <div class="managed-card-swipe-actions">
            <button class="button button-secondary" data-action="edit-card" data-card-id="${card.id}">
              Edit
            </button>
            <button class="button button-ghost" data-action="reset-card-progress" data-card-id="${card.id}">
              Reset
            </button>
            <button class="button button-ghost danger-button" data-action="delete-card" data-card-id="${card.id}">
              Delete
            </button>
          </div>
          <div class="managed-card-surface">
            <div class="managed-card-top">
              <div>
                <h4>${fullTerm}</h4>
                <p>${card.translation}</p>
              </div>
              ${getManagedCardActionButtons(card.id, "managed-card-actions-inline")}
            </div>

            <div class="deck-tags">
              <span class="pill">${getPartOfSpeechLabel(card.partOfSpeech)}</span>
              <span class="pill">${card.level}</span>
              <span class="pill">${dueText}</span>
              <span class="pill">${formatInterval(progress.intervalDays)}</span>
              ${tags
                .slice(0, 4)
                .map((tag) => `<span class="pill">${tag}</span>`)
                .join("")}
            </div>

            <p class="managed-card-example">${card.example || "No example sentence yet."}</p>
            <p class="managed-card-meta">
              ${progress.repetitions} reps · ease ${(progress.ease ?? 2.5).toFixed(2)} · ${progress.lapses ?? 0} lapses
            </p>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderStudy() {
  const currentCard = getCurrentCard();
  const currentItem = getCurrentQueueItem();

  if (sessionState.completed) {
    elements.studyEmpty.classList.remove("hidden");
    elements.studyArea.classList.add("hidden");
    elements.specialFormsPanel.innerHTML = "";
    elements.specialFormsPanel.classList.add("hidden");
    elements.studyEmpty.innerHTML = `
      <p class="empty-title">Session complete</p>
      <p class="empty-copy">
        Nice work. You reviewed ${sessionState.summary.reviewed} card${sessionState.summary.reviewed === 1 ? "" : "s"}.
        Again ${sessionState.summary.again}, Hard ${sessionState.summary.hard}, Good ${sessionState.summary.good}, Easy ${sessionState.summary.easy}.
      </p>
    `;
    elements.sessionStatus.textContent = "Queue finished";
    updateRecordingUI("Record yourself on the next card whenever you want speaking practice.");
    return;
  }

  if (!currentCard || !currentItem) {
    elements.studyArea.classList.add("hidden");
    elements.studyEmpty.classList.remove("hidden");
    elements.specialFormsPanel.innerHTML = "";
    elements.specialFormsPanel.classList.add("hidden");
    updateRecordingUI("Record yourself answering and compare it to the prompt audio.");
    return;
  }

  const prompt = buildPrompt(currentCard, currentItem.mode);
  const currentProgress = getProgress(currentCard.id);
  const nextGood = scheduleReview(currentProgress, "good");
  const deckName = getDeckById(currentCard.deckId)?.name ?? "Mixed";
  const sourceLabels = {
    due: "Due review",
    all: "Mixed practice",
    mistakes: "Mistake drill",
    listening: "Listening drill",
  };
  elements.sessionStatus.textContent = `${deckName} · ${sourceLabels[sessionState.source] ?? "Practice"}`;
  elements.queueChip.textContent = `${sessionState.currentIndex + 1} / ${sessionState.queue.length}`;
  elements.modeBadge.textContent = prompt.badge;
  elements.promptTitle.textContent = prompt.title;
  elements.promptSubtitle.textContent = prompt.subtitle;
  elements.typedAnswerLabel.textContent = getTypedAnswerLabel(currentItem.mode);
  elements.typedAnswerInput.value = sessionState.typedAnswer;
  elements.answerMain.textContent = prompt.answerMain;
  elements.translationText.textContent = prompt.translation;

  elements.posPill.textContent = getPartOfSpeechLabel(currentCard.partOfSpeech);
  elements.posPill.classList.remove("hidden");

  if (currentCard.article) {
    elements.articlePill.textContent = currentCard.article;
    elements.articlePill.classList.remove("hidden");
  } else {
    elements.articlePill.classList.add("hidden");
  }

  if (currentCard.plural) {
    elements.pluralPill.textContent = currentCard.plural;
    elements.pluralPill.classList.remove("hidden");
  } else {
    elements.pluralPill.classList.add("hidden");
  }

  elements.levelPill.textContent = currentCard.level;
  elements.levelPill.classList.remove("hidden");

  if (currentCard.note) {
    elements.noteText.textContent = currentCard.note;
    elements.noteText.classList.remove("hidden");
  } else {
    elements.noteText.classList.add("hidden");
  }

  renderSpecialForms(currentCard);

  elements.exampleText.textContent = currentCard.example || "No example sentence yet.";
  elements.exampleTranslation.textContent = currentCard.exampleTranslation || "";
  elements.studyRepText.textContent = String(currentProgress.repetitions ?? 0);
  elements.studyIntervalText.textContent = formatInterval(currentProgress.intervalDays);
  elements.studyNextGoodText.textContent = nextGood.dueAt ? formatDate(nextGood.dueAt) : "Today";

  if (sessionState.lastEvaluation) {
    elements.typedFeedbackText.textContent = `${sessionState.lastEvaluation.message} Suggested rating: ${REVIEW_SCORES[sessionState.lastEvaluation.suggestedScore].label}.`;
    elements.typedFeedbackText.className = `typed-feedback typed-feedback-${sessionState.lastEvaluation.grade}`;
    elements.typedFeedbackText.classList.remove("hidden");
  } else {
    elements.typedFeedbackText.textContent = "";
    elements.typedFeedbackText.className = "typed-feedback hidden";
  }

  elements.ratingButtons.forEach((button) => {
    button.classList.toggle(
      "is-suggested",
      sessionState.lastEvaluation?.suggestedScore === button.dataset.score,
    );
  });

  elements.answerPanel.classList.toggle("hidden", !sessionState.revealed);
  elements.revealBtn.classList.toggle("hidden", sessionState.revealed);
  elements.studyArea.classList.remove("hidden");
  elements.studyEmpty.classList.add("hidden");

  updateRecordingUI(
    audioState.isRecording
      ? "Recording... say your answer clearly, then stop and listen back."
      : audioState.currentRecordingUrl
        ? "Take ready. Play it back and compare with the prompt audio."
        : "Record yourself answering and compare it to the prompt audio.",
  );

  if (currentItem.mode === "listening" && !sessionState.revealed) {
    const autoPlayKey = `${currentItem.cardId}:${sessionState.currentIndex}`;
    if (sessionState.autoPlayedKey !== autoPlayKey) {
      sessionState.autoPlayedKey = autoPlayKey;
      window.setTimeout(() => pronounceCurrentCard(true), 120);
    }
  }
}

function renderInsights() {
  const due = getDueCards("all").length;
  const weakCount = getMistakeCards("all").length;
  const todayReviews = getTodayReviewCount();
  const streak = computeStreak();
  const mastered = getMasteredCount();
  const averageEase = getAverageEase();
  const nextDue = appState.cards
    .map((card) => getProgress(card.id).dueAt)
    .filter(Boolean)
    .sort()[0];

  elements.dueCount.textContent = String(due);
  elements.todayReviews.textContent = String(todayReviews);
  elements.streakCount.textContent = String(streak);
  elements.masteredCount.textContent = String(mastered);
  elements.dailyGoalText.textContent = `${appState.preferences.dailyGoal} cards`;
  elements.averageEaseText.textContent = averageEase.toFixed(2);
  elements.nextDueText.textContent = nextDue ? formatDate(nextDue) : "Ready now";
  elements.dailyGoalInput.value = String(appState.preferences.dailyGoal);
  elements.goalStatusText.textContent = `${todayReviews} of ${appState.preferences.dailyGoal} reviews completed today.`;
  setSyncStatus(
    authState.account
      ? `Account sync is live. ${weakCount} card${weakCount === 1 ? "" : "s"} currently qualify for mistake drills.`
      : `File-based sync is still available. ${weakCount} card${weakCount === 1 ? "" : "s"} currently qualify for mistake drills.`,
  );

  elements.progressBars.innerHTML = appState.decks
    .map((deck) => {
      const cards = getCardsForDeck(deck.id);
      const reviewed = cards.filter((card) => getProgress(card.id).repetitions > 0).length;
      const dueCount = getDueCards(deck.id).length;
      const masteredCount = cards.filter((card) => getProgress(card.id).intervalDays >= 14).length;
      const completion = cards.length === 0 ? 0 : Math.round((reviewed / cards.length) * 100);

      return `
        <article class="progress-row">
          <div class="progress-row-top">
            <div>
              <h4 class="progress-name">${deck.name}</h4>
              <p class="progress-meta">${masteredCount} mastered · ${dueCount} due now</p>
            </div>
            <strong>${completion}%</strong>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${completion}%"></div>
          </div>
        </article>
      `;
    })
    .join("");

  const weakSpots = getWeakSpots();
  const tokens = [
    ...weakSpots.tags.map(
      ([tag, score]) => `<span class="token"><strong>${tag}</strong>&nbsp;${score.toFixed(1)}</span>`,
    ),
    ...weakSpots.cards.map(
      ({ card, progress }) =>
        `<span class="token"><strong>${card.term}</strong>&nbsp;${progress.lapses} lapses</span>`,
    ),
  ];
  elements.weakSpotList.innerHTML = tokens.join("") || '<span class="token">No weak spots yet. Keep reviewing.</span>';

  elements.activityList.innerHTML = appState.sessions
    .slice(0, 8)
    .map((entry) => {
      const deckName = getDeckById(entry.deckId)?.name ?? "Custom";
      return `
        <article class="activity-item">
          <strong>${entry.term}</strong>
          <p>${REVIEW_SCORES[entry.score].label} · ${deckName} · ${formatDate(entry.timestamp)}</p>
        </article>
      `;
    })
    .join("");

  if (!elements.activityList.innerHTML) {
    elements.activityList.innerHTML = `
      <article class="activity-item">
        <strong>No reviews logged yet</strong>
        <p>Your latest repetitions will appear here once you start studying.</p>
      </article>
    `;
  }
}

function render() {
  applyCardTypeUI();
  renderDeckSelects();
  renderDecks();
  renderManager();
  renderStudy();
  renderInsights();
  renderViewNavigation();
  renderPanelSectionNavigation();
  renderAuth();
  renderSheet();
  renderCommandPalette();
}

function deleteCardById(cardId) {
  const card = getCardById(cardId);
  if (!card) {
    return;
  }

  const confirmed = window.confirm(`Delete "${card.term}" from this collection?`);
  if (!confirmed) {
    return;
  }

  const timestamp = new Date().toISOString();
  appState.cards = appState.cards.filter((entry) => entry.id !== cardId);
  addCardTombstone(cardId, timestamp);
  appState.sessions = appState.sessions.filter((entry) => entry.cardId !== cardId);
  delete appState.progress[cardId];
  if (studioState.editingCardId === cardId) {
    resetCardForm();
  }
  syncSessionAfterDataChange();
  saveState();
  render();
}

function resetCardProgress(cardId) {
  const card = getCardById(cardId);
  if (!card) {
    return;
  }

  const confirmed = window.confirm(`Reset review progress for "${card.term}"?`);
  if (!confirmed) {
    return;
  }

  appState.progress[cardId] = createBlankProgressEntry();
  saveState();
  render();
}

function deleteDeckById(deckId) {
  const deck = getDeckById(deckId);
  if (!deck) {
    return;
  }

  const confirmed = window.confirm(
    `Delete "${deck.name}" and all of its cards? This also removes their review history.`,
  );
  if (!confirmed) {
    return;
  }

  const timestamp = new Date().toISOString();
  const cardIds = new Set(getCardsForDeck(deckId).map((card) => card.id));
  appState.decks = appState.decks.filter((entry) => entry.id !== deckId);
  addDeckTombstone(deckId, timestamp);
  appState.cards = appState.cards.filter((entry) => entry.deckId !== deckId);
  Object.keys(appState.progress).forEach((cardId) => {
    if (cardIds.has(cardId)) {
      delete appState.progress[cardId];
    }
  });
  cardIds.forEach((cardId) => addCardTombstone(cardId, timestamp));
  appState.sessions = appState.sessions.filter((entry) => !cardIds.has(entry.cardId));

  if (appState.preferences.selectedDeckId === deckId) {
    appState.preferences.selectedDeckId = appState.decks[0]?.id ?? "all";
  }
  if (studioState.editingDeckId === deckId) {
    resetDeckForm();
  }
  if (studioState.editingCardId && cardIds.has(studioState.editingCardId)) {
    resetCardForm();
  }

  syncSessionAfterDataChange();
  saveState();
  render();
}

function handleDeckActions(event) {
  const trigger = event.target.closest("[data-action]");
  if (!trigger) {
    return;
  }

  const deckId = trigger.getAttribute("data-deck-id");
  const action = trigger.getAttribute("data-action");
  appState.preferences.selectedDeckId = deckId;

  if (action === "study-deck") {
    startSession(deckId, "due");
    return;
  }

  if (action === "mix-deck") {
    startSession(deckId, "all");
    return;
  }

  if (action === "select-deck") {
    setActiveView("studio", { persist: false });
    setStudioSection("manage", { persist: false });
    render();
    saveState();
    return;
  }

  if (action === "edit-deck") {
    appState.preferences.selectedDeckId = deckId;
    loadDeckIntoForm(deckId);
    render();
    return;
  }

  if (action === "delete-deck") {
    deleteDeckById(deckId);
    return;
  }

  render();
}

function handleManagerActions(event) {
  const trigger = event.target.closest("[data-action]");
  if (!trigger) {
    if (uiState.openSwipeCardId && event.target.closest(".managed-card-surface")) {
      closeManagedCardSwipe();
    }
    return;
  }

  const action = trigger.getAttribute("data-action");
  const deckId = trigger.getAttribute("data-deck-id");
  const cardId = trigger.getAttribute("data-card-id");

  if (deckId && ["study-deck", "mix-deck", "edit-deck", "delete-deck"].includes(action)) {
    handleDeckActions(event);
    return;
  }

  if (action === "edit-card" && cardId) {
    closeManagedCardSwipe();
    loadCardIntoForm(cardId);
    return;
  }

  if (action === "delete-card" && cardId) {
    closeManagedCardSwipe();
    deleteCardById(cardId);
    return;
  }

  if (action === "reset-card-progress" && cardId) {
    closeManagedCardSwipe();
    resetCardProgress(cardId);
  }
}

function downloadFile(content, mimeType, fileName) {
  const blob = new Blob([content], {
    type: mimeType,
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const normalized = String(value ?? "");
  if (!/[",\n\r]/.test(normalized)) {
    return normalized;
  }

  return `"${normalized.replaceAll('"', '""')}"`;
}

function toCsvRow(values) {
  return values.map(csvEscape).join(",");
}

function exportCardsToCsv() {
  const lines = [toCsvRow(CSV_COLUMNS)];
  appState.cards.forEach((card) => {
    const deck = getDeckById(card.deckId);
    const verbForms = normalizeVerbForms(card.verbForms);
    const adjectiveForms = normalizeAdjectiveForms(card.adjectiveForms);
    lines.push(
      toCsvRow([
        deck?.name ?? "",
        deck?.level ?? card.level ?? "",
        deck?.focus ?? "",
        deck?.description ?? "",
        card.partOfSpeech,
        card.term,
        card.translation,
        card.article,
        card.plural,
        verbForms.auxiliary,
        verbForms.present,
        verbForms.preterite,
        verbForms.participle,
        verbForms.imperative,
        card.usagePattern || verbForms.usagePattern,
        adjectiveForms.comparative,
        adjectiveForms.superlative,
        adjectiveForms.usage,
        card.level,
        card.example,
        card.exampleTranslation,
        card.note,
        card.tags.join(", "),
      ]),
    );
  });
  downloadFile(`${lines.join("\n")}\n`, "text/csv;charset=utf-8", "wortwald-cards.csv");
  setDataStatus(`Exported ${appState.cards.length} cards to CSV.`);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(value);
      if (row.some((cell) => cell.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (value !== "" || row.length > 0) {
    row.push(value);
    if (row.some((cell) => cell.trim() !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

function splitTagField(value) {
  return String(value ?? "")
    .split(/[|,]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeView(value) {
  return VIEW_KEYS.includes(value) ? value : "library";
}

function normalizeProgressSection(value) {
  return PROGRESS_SECTION_KEYS.includes(value) ? value : "snapshot";
}

function normalizeStudioSection(value) {
  return STUDIO_SECTION_KEYS.includes(value) ? value : "cards";
}

function importCsv(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const rows = parseCsv(String(reader.result ?? ""));
      if (rows.length < 2) {
        throw new Error("CSV needs a header row and at least one card row.");
      }

      const headers = rows[0].map((value) => value.trim().replace(/^\uFEFF/, ""));
      const headerLookup = new Map(headers.map((header, index) => [header, index]));
      if (!headerLookup.has("deckName") || !headerLookup.has("term") || !headerLookup.has("translation")) {
        throw new Error("CSV must include deckName, term, and translation columns.");
      }

      const deckNameToId = new Map(appState.decks.map((deck) => [normalizeKey(deck.name), deck.id]));
      let createdDecks = 0;
      let createdCards = 0;
      let skippedRows = 0;

      rows.slice(1).forEach((cells) => {
        const record = Object.fromEntries(
          headers.map((header, index) => [header, String(cells[index] ?? "").trim()]),
        );

        if (!record.term || !record.translation || !record.deckName) {
          skippedRows += 1;
          return;
        }

        let deckId = deckNameToId.get(normalizeKey(record.deckName));
        if (!deckId) {
          const timestamp = new Date().toISOString();
          const deck = {
            id: createId("deck"),
            name: record.deckName,
            level: record.deckLevel || record.level || "A1",
            focus: record.deckFocus || "imported csv deck",
            description: record.deckDescription || "Imported from CSV.",
            createdAt: timestamp,
            updatedAt: timestamp,
          };
          appState.decks.unshift(deck);
          deckId = deck.id;
          deckNameToId.set(normalizeKey(deck.name), deck.id);
          createdDecks += 1;
        }

        const rawTerm = record.term;
        const article = record.article || "";
        const normalizedTerm =
          article &&
          rawTerm.toLowerCase().startsWith(`${article.toLowerCase()} `)
            ? rawTerm.slice(article.length + 1).trim()
            : rawTerm.trim();

        const duplicate = appState.cards.some(
          (card) =>
            card.deckId === deckId &&
            normalizeKey(card.term) === normalizeKey(normalizedTerm) &&
            normalizeKey(card.translation) === normalizeKey(record.translation),
        );
        if (duplicate) {
          skippedRows += 1;
          return;
        }

        const timestamp = new Date().toISOString();
        const partOfSpeech = normalizeKey(record.partOfSpeech || inferPartOfSpeech(record));
        appState.cards.unshift({
          id: createId("card"),
          deckId,
          term: normalizedTerm,
          translation: record.translation,
          article,
          plural: record.plural || "",
          partOfSpeech,
          usagePattern: record.usagePattern || record.adjectiveUsage || "",
          verbForms: normalizeVerbForms({
            auxiliary: record.verbAuxiliary,
            present: record.verbPresent,
            preterite: record.verbPreterite,
            participle: record.verbParticiple,
            imperative: record.verbImperative,
            usagePattern: record.usagePattern,
          }),
          adjectiveForms: normalizeAdjectiveForms({
            comparative: record.adjectiveComparative,
            superlative: record.adjectiveSuperlative,
            usage: record.adjectiveUsage,
          }),
          level: record.level || record.deckLevel || "A1",
          example: record.example || "",
          exampleTranslation: record.exampleTranslation || "",
          note: record.note || "",
          tags: splitTagField(record.tags),
          createdAt: timestamp,
          updatedAt: timestamp,
        });
        createdCards += 1;
      });

      syncSessionAfterDataChange();
      saveState();
      render();
      setDataStatus(
        `CSV import complete: ${createdCards} cards added, ${createdDecks} decks created, ${skippedRows} rows skipped.`,
      );
    } catch (error) {
      alert(`CSV import failed: ${error.message}`);
      setDataStatus(`CSV import failed: ${error.message}`);
    }
  };

  reader.readAsText(file);
}

function exportState() {
  downloadFile(JSON.stringify(appState, null, 2), "application/json", "wortwald-export.json");
  setDataStatus("Exported full JSON backup with decks, cards, and progress.");
}

function handleGoalFormSubmit(event) {
  event.preventDefault();
  const nextGoal = Number(elements.dailyGoalInput.value);
  appState.preferences.dailyGoal = Math.min(100, Math.max(1, Number.isFinite(nextGoal) ? nextGoal : 12));
  saveState();
  renderInsights();
}

function importState(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported.decks) || !Array.isArray(imported.cards)) {
        throw new Error("Invalid export format.");
      }

      const nextState = normalizeState(imported);
      nextState.preferences.deviceName = appState.preferences.deviceName;

      Object.assign(appState, nextState);
      resetDeckForm();
      resetCardForm();
      syncSessionAfterDataChange();
      saveState();
      render();
      startSession(appState.preferences.selectedDeckId, "due");
      setDataStatus("Imported JSON backup and restored your decks, cards, and progress.");
    } catch (error) {
      alert(`Import failed: ${error.message}`);
      setDataStatus(`JSON import failed: ${error.message}`);
    }
  };
  reader.readAsText(file);
}

function parseSyncPacket(raw) {
  if (raw?.kind === "wortwald-sync-packet" && raw.state) {
    return normalizeState(raw.state);
  }
  return normalizeState(raw);
}

function entityTimestamp(entity, fallback = 0) {
  const candidate = entity?.updatedAt ?? entity?.lastReviewedAt ?? entity?.timestamp ?? entity?.createdAt;
  const timestamp = candidate ? new Date(candidate).getTime() : fallback;
  return Number.isFinite(timestamp) ? timestamp : fallback;
}

function mergeTagLists(left, right) {
  return [...new Set([...(left ?? []), ...(right ?? [])])];
}

function mergeSyncState(importedRaw) {
  const incoming = parseSyncPacket(importedRaw);
  const local = normalizeState(appState);
  const preservedDeviceName = local.preferences.deviceName;
  const preservedSelectedDeckId = local.preferences.selectedDeckId;
  const preservedActiveView = local.preferences.activeView;
  const preservedProgressSection = local.preferences.progressSection;
  const preservedStudioSection = local.preferences.studioSection;

  local.tombstones = {
    decks: mergeTombstoneLists(local.tombstones.decks, incoming.tombstones.decks),
    cards: mergeTombstoneLists(local.tombstones.cards, incoming.tombstones.cards),
  };

  const deckMap = new Map(local.decks.map((deck) => [deck.id, deck]));
  const deckNameMap = new Map(local.decks.map((deck) => [normalizeKey(deck.name), deck.id]));
  const deckIdRemap = new Map();

  incoming.decks.forEach((deck) => {
    const existingDeck = deckMap.get(deck.id) ?? deckMap.get(deckNameMap.get(normalizeKey(deck.name)));
    if (!existingDeck) {
      local.decks.push(deck);
      deckMap.set(deck.id, deck);
      deckNameMap.set(normalizeKey(deck.name), deck.id);
      deckIdRemap.set(deck.id, deck.id);
      return;
    }

    const mergedDeck =
      entityTimestamp(deck) >= entityTimestamp(existingDeck)
        ? {
            ...existingDeck,
            ...deck,
            id: existingDeck.id,
            createdAt: existingDeck.createdAt ?? deck.createdAt,
          }
        : existingDeck;

    local.decks = local.decks.map((entry) => (entry.id === existingDeck.id ? mergedDeck : entry));
    deckMap.set(existingDeck.id, mergedDeck);
    deckIdRemap.set(deck.id, existingDeck.id);
  });

  const cardSignatureMap = new Map(
    local.cards.map((card) => [`${card.deckId}::${normalizeKey(card.term)}::${normalizeKey(card.translation)}`, card.id]),
  );
  const cardIdRemap = new Map();

  incoming.cards.forEach((card) => {
    const mappedDeckId = deckIdRemap.get(card.deckId) ?? card.deckId;
    const candidateCard = { ...card, deckId: mappedDeckId };
    const signature = `${mappedDeckId}::${normalizeKey(candidateCard.term)}::${normalizeKey(candidateCard.translation)}`;
    const existingCard =
      local.cards.find((entry) => entry.id === candidateCard.id) ??
      local.cards.find((entry) => entry.id === cardSignatureMap.get(signature));

    if (!existingCard) {
      local.cards.push(candidateCard);
      cardSignatureMap.set(signature, candidateCard.id);
      cardIdRemap.set(card.id, candidateCard.id);
      return;
    }

    const mergedCard =
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

    local.cards = local.cards.map((entry) => (entry.id === existingCard.id ? mergedCard : entry));
    cardSignatureMap.set(signature, existingCard.id);
    cardIdRemap.set(card.id, existingCard.id);
  });

  Object.entries(incoming.progress).forEach(([cardId, progressEntry]) => {
    const mappedCardId = cardIdRemap.get(cardId) ?? cardId;
    if (!local.cards.some((card) => card.id === mappedCardId)) {
      return;
    }

    const existing = local.progress[mappedCardId] ? normalizeProgressEntry(local.progress[mappedCardId]) : null;
    const incomingEntry = normalizeProgressEntry(progressEntry);
    if (!existing || entityTimestamp(incomingEntry) >= entityTimestamp(existing)) {
      local.progress[mappedCardId] = {
        ...existing,
        ...incomingEntry,
        updatedAt: incomingEntry.updatedAt,
      };
    } else {
      local.progress[mappedCardId] = {
        ...existing,
        lapses: Math.max(existing.lapses ?? 0, incomingEntry.lapses ?? 0),
        repetitions: Math.max(existing.repetitions ?? 0, incomingEntry.repetitions ?? 0),
      };
    }
  });

  const sessionSignature = new Set(local.sessions.map((entry) => entry.id ?? `${entry.cardId}:${entry.timestamp}:${entry.score}`));
  incoming.sessions.forEach((entry) => {
    const mappedCardId = cardIdRemap.get(entry.cardId) ?? entry.cardId;
    const mappedDeckId = deckIdRemap.get(entry.deckId) ?? entry.deckId;
    const signature = entry.id ?? `${mappedCardId}:${entry.timestamp}:${entry.score}`;
    if (sessionSignature.has(signature)) {
      return;
    }
    local.sessions.push({
      ...entry,
      cardId: mappedCardId,
      deckId: mappedDeckId,
      id: entry.id ?? createId("session"),
    });
    sessionSignature.add(signature);
  });
  local.sessions = local.sessions
    .sort((left, right) => entityTimestamp(right) - entityTimestamp(left))
    .slice(0, 400);

  local.preferences = {
    ...local.preferences,
    ...incoming.preferences,
    deviceName: preservedDeviceName,
    activeView: preservedActiveView,
    progressSection: preservedProgressSection,
    studioSection: preservedStudioSection,
    selectedDeckId:
      preservedSelectedDeckId && local.decks.some((deck) => deck.id === preservedSelectedDeckId)
        ? preservedSelectedDeckId
        : local.decks[0]?.id ?? "all",
  };

  const deckTombstones = new Map(local.tombstones.decks.map((entry) => [entry.id, entityTimestamp(entry)]));
  const cardTombstones = new Map(local.tombstones.cards.map((entry) => [entry.id, entityTimestamp(entry)]));

  local.decks = local.decks.filter((deck) => {
    const tombstoneTime = deckTombstones.get(deck.id);
    return !tombstoneTime || entityTimestamp(deck) > tombstoneTime;
  });

  const liveDeckIds = new Set(local.decks.map((deck) => deck.id));
  local.cards = local.cards.filter((card) => {
    if (!liveDeckIds.has(card.deckId)) {
      return false;
    }
    const tombstoneTime = cardTombstones.get(card.id);
    return !tombstoneTime || entityTimestamp(card) > tombstoneTime;
  });

  const liveCardIds = new Set(local.cards.map((card) => card.id));
  local.progress = Object.fromEntries(
    Object.entries(local.progress).filter(([cardId]) => liveCardIds.has(cardId)),
  );
  local.sessions = local.sessions.filter(
    (entry) => liveCardIds.has(entry.cardId) && liveDeckIds.has(entry.deckId),
  );
  local.tombstones = {
    decks: local.tombstones.decks
      .filter((entry) => !liveDeckIds.has(entry.id))
      .sort((left, right) => entityTimestamp(right) - entityTimestamp(left))
      .slice(0, 500),
    cards: local.tombstones.cards
      .filter((entry) => !liveCardIds.has(entry.id))
      .sort((left, right) => entityTimestamp(right) - entityTimestamp(left))
      .slice(0, 500),
  };
  local.preferences.selectedDeckId =
    local.preferences.selectedDeckId && local.decks.some((deck) => deck.id === local.preferences.selectedDeckId)
      ? local.preferences.selectedDeckId
      : local.decks[0]?.id ?? "all";

  Object.assign(appState, normalizeState(local));
  syncSessionAfterDataChange();
  saveState();
  render();
}

function exportSyncPacket() {
  const payload = {
    kind: "wortwald-sync-packet",
    exportedAt: new Date().toISOString(),
    sourceDevice: appState.preferences.deviceName,
    state: normalizeState(appState),
  };
  downloadFile(JSON.stringify(payload, null, 2), "application/json", "wortwald-sync.json");
  setSyncStatus("Exported a sync packet. Import it on another device with Merge sync.");
}

function importSyncPacket(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(String(reader.result ?? ""));
      mergeSyncState(imported);
      setSyncStatus("Sync packet merged. Newer progress and missing cards were pulled into this device.");
    } catch (error) {
      alert(`Sync merge failed: ${error.message}`);
      setSyncStatus(`Sync merge failed: ${error.message}`);
    }
  };
  reader.readAsText(file);
}

async function pullAccountState() {
  const payload = await apiRequest("/api/sync");
  if (payload?.state) {
    authState.suppressAutoSync = true;
    mergeSyncState(payload.state);
    authState.suppressAutoSync = false;
    authState.lastSyncedAt = payload.updatedAt ?? new Date().toISOString();
    renderAuth();
    setAuthStatus("Pulled the latest account state and merged it into this device.");
    return;
  }

  authState.lastSyncedAt = payload?.updatedAt ?? authState.lastSyncedAt;
  renderAuth();
  setAuthStatus("Account is ready, but there is no remote state yet.");
}

async function refreshAccountSessions(options = {}) {
  if (!authState.account) {
    return;
  }

  const payload = await apiRequest("/api/auth/sessions");
  authState.currentSessionId = payload.currentSessionId ?? authState.currentSessionId;
  authState.sessions = Array.isArray(payload.sessions) ? payload.sessions : [];
  renderAuth();
  if (!options.quiet) {
    setSessionStatus(
      `${authState.sessions.length} active device${authState.sessions.length === 1 ? "" : "s"} on this account.`,
    );
  }
}

async function syncAccountState(options = {}) {
  if (!authState.account) {
    return;
  }

  window.clearTimeout(authState.autoSyncTimer);
  authState.syncing = true;
  renderAuth();

  try {
    const remote = await apiRequest("/api/sync");
    if (remote?.state) {
      authState.suppressAutoSync = true;
      mergeSyncState(remote.state);
      authState.suppressAutoSync = false;
    }

    const pushed = await apiRequest("/api/sync", {
      method: "PUT",
      body: { state: normalizeState(appState) },
    });
    if (pushed?.state) {
      authState.suppressAutoSync = true;
      mergeSyncState(pushed.state);
      authState.suppressAutoSync = false;
    }
    authState.lastSyncedAt = pushed.updatedAt ?? new Date().toISOString();
    await refreshAccountSessions({ quiet: true });
    renderAuth();
    if (!options.quiet) {
      setAuthStatus("Synced local decks, cards, and progress to your account.");
    }
  } finally {
    authState.syncing = false;
    renderAuth();
  }
}

async function establishSession(payload, successMessage) {
  persistAuthToken(payload.token);
  authState.account = payload.account;
  authState.lastSyncedAt = payload.updatedAt ?? null;
  authState.currentSessionId = payload.session?.id ?? null;
  authState.sessions = payload.session ? [{ ...payload.session, isCurrent: true }] : [];
  renderAuth();
  setAuthStatus(successMessage);
  await refreshAccountSessions({ quiet: true });
  await syncAccountState({ quiet: true });
  setAuthStatus(`${successMessage} Server-backed sync is now active.`);
}

async function registerAccount() {
  try {
    const credentials = validateAuthFields();
    const payload = await apiRequest("/api/auth/register", {
      method: "POST",
      body: credentials,
    });
    await establishSession(payload, "Account created.");
  } catch (error) {
    setAuthStatus(error.message);
  }
}

async function loginAccount() {
  try {
    const credentials = validateAuthFields();
    const payload = await apiRequest("/api/auth/login", {
      method: "POST",
      body: credentials,
    });
    await establishSession(payload, "Signed in.");
  } catch (error) {
    setAuthStatus(error.message);
  }
}

async function logoutAccount() {
  try {
    if (authState.token) {
      await apiRequest("/api/auth/logout", { method: "POST" });
    }
  } catch (error) {
    console.warn("Logout request failed.", error);
  }
  window.clearTimeout(authState.autoSyncTimer);
  persistAuthToken("");
  authState.account = null;
  authState.lastSyncedAt = null;
  authState.sessions = [];
  authState.currentSessionId = null;
  renderAuth();
  setAuthStatus("Signed out. Local study data stays on this device.");
  setPasswordStatus("Changing your password signs out your other devices.");
  setSessionStatus("Active devices will appear here after sign-in.");
}

async function hydrateAuthSession() {
  elements.deviceNameInput.value = appState.preferences.deviceName;
  if (!backendState.available) {
    persistAuthToken("");
    authState.account = null;
    authState.sessions = [];
    authState.currentSessionId = null;
    renderAuth();
    return;
  }
  if (!authState.token) {
    renderAuth();
    setAuthStatus("Sign in to enable backend sync. The file-based sync buttons still work as a fallback.");
    return;
  }

  try {
    const payload = await apiRequest("/api/auth/me");
    authState.account = payload.account;
    authState.lastSyncedAt = payload.updatedAt ?? null;
    authState.currentSessionId = payload.session?.id ?? null;
    authState.sessions = payload.session ? [{ ...payload.session, isCurrent: true }] : [];
    renderAuth();
    setAuthStatus("Session restored. Pulling your latest account state...");
    await refreshAccountSessions({ quiet: true });
    await pullAccountState();
  } catch (error) {
    persistAuthToken("");
    authState.account = null;
    authState.sessions = [];
    authState.currentSessionId = null;
    renderAuth();
    setAuthStatus(`Stored session expired: ${error.message}`);
  }
}

async function changePassword() {
  if (!authState.account) {
    return;
  }

  const currentPassword = elements.currentPasswordInput.value;
  const newPassword = elements.newPasswordInput.value;
  if (!currentPassword) {
    throw new Error("Enter your current password.");
  }
  if (newPassword.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`Use a password with at least ${PASSWORD_MIN_LENGTH} characters.`);
  }

  authState.changingPassword = true;
  renderAuth();

  try {
    const payload = await apiRequest("/api/auth/password", {
      method: "POST",
      body: {
        currentPassword,
        newPassword,
      },
    });
    authState.account = payload.account ?? authState.account;
    elements.currentPasswordInput.value = "";
    elements.newPasswordInput.value = "";
    await refreshAccountSessions({ quiet: true });
    setPasswordStatus(
      `Password updated. ${payload.revokedSessionCount ?? 0} other device${payload.revokedSessionCount === 1 ? "" : "s"} signed out.`,
    );
    setAuthStatus("Password updated. Other devices were asked to sign in again.");
  } finally {
    authState.changingPassword = false;
    renderAuth();
  }
}

async function revokeSession(sessionId) {
  if (!sessionId) {
    return;
  }

  const payload = await apiRequest(`/api/auth/sessions/${encodeURIComponent(sessionId)}`, {
    method: "DELETE",
  });
  if (payload.currentSessionRevoked) {
    await logoutAccount();
    return;
  }
  await refreshAccountSessions({ quiet: true });
  setSessionStatus("Device signed out successfully.");
}

function resetProgress() {
  const confirmed = window.confirm(
    "Reset all review history and restore the built-in seed decks?",
  );
  if (!confirmed) {
    return;
  }

  const previousState = normalizeState(appState);
  const nextState = createSeedState();
  const resetTimestamp = new Date().toISOString();
  const resetDeckTombstones = previousState.decks
    .filter((deck) => !seedDecks.some((seedDeck) => seedDeck.id === deck.id))
    .map((deck) => ({ id: deck.id, updatedAt: resetTimestamp }));
  const resetCardTombstones = previousState.cards
    .filter((card) => !seedCards.some((seedCard) => seedCard.id === card.id))
    .map((card) => ({ id: card.id, updatedAt: resetTimestamp }));
  nextState.preferences.deviceName = previousState.preferences.deviceName;
  nextState.preferences.activeView = previousState.preferences.activeView;
  nextState.preferences.progressSection = previousState.preferences.progressSection;
  nextState.preferences.studioSection = previousState.preferences.studioSection;
  Object.assign(appState, nextState);
  appState.tombstones = {
    decks: mergeTombstoneLists(previousState.tombstones.decks, resetDeckTombstones),
    cards: mergeTombstoneLists(previousState.tombstones.cards, resetCardTombstones),
  };
  appState.progress = Object.fromEntries(
    appState.cards.map((card) => [card.id, createBlankProgressEntry(resetTimestamp)]),
  );
  sessionState.queue = [];
  sessionState.currentIndex = 0;
  sessionState.revealed = false;
  sessionState.completed = false;
  sessionState.summary = createSessionSummary();
  releaseAudioResources();
  resetDeckForm();
  resetCardForm();
  saveState();
  render();
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    setInstallStatus("This browser does not support service workers, so offline install is unavailable.");
    return;
  }

  const isServed = window.location.protocol === "https:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (!isServed) {
    setInstallStatus("Serve Wortwald from localhost or HTTPS to enable install and offline caching.");
    return;
  }

  try {
    await navigator.serviceWorker.register("./service-worker.js");
    setInstallStatus(
      installState.installed
        ? "Wortwald is installed and ready for offline review."
        : "Offline shell ready. Use the install button or browser menu to pin Wortwald to your device.",
    );
  } catch (error) {
    console.warn("Service worker registration failed.", error);
    setInstallStatus("Install support could not be initialized in this browser session.");
  }
}

function handleBeforeInstallPrompt(event) {
  event.preventDefault();
  installState.deferredPrompt = event;
  elements.installBtn.classList.remove("hidden");
  setInstallStatus("Install is available. Add Wortwald to your home screen for offline review.");
}

async function triggerInstall() {
  if (!installState.deferredPrompt) {
    setInstallStatus("Open this app from localhost or HTTPS, then use the browser install menu if no prompt appears.");
    return;
  }

  installState.deferredPrompt.prompt();
  const choice = await installState.deferredPrompt.userChoice;
  if (choice?.outcome === "accepted") {
    setInstallStatus("Install accepted. Wortwald should appear as an app on your device.");
  } else {
    setInstallStatus("Install dismissed. You can trigger it again from the browser menu later.");
  }
  installState.deferredPrompt = null;
  elements.installBtn.classList.add("hidden");
}

function handleDeckFormSubmit(event) {
  event.preventDefault();
  const timestamp = new Date().toISOString();
  const deck = {
    id: studioState.editingDeckId ?? createId("deck"),
    name: elements.deckName.value.trim(),
    level: elements.deckLevel.value,
    focus: elements.deckFocus.value.trim() || "custom focus",
    description: elements.deckDescription.value.trim() || "Custom German deck.",
    createdAt: studioState.editingDeckId ? getDeckById(studioState.editingDeckId)?.createdAt ?? timestamp : timestamp,
    updatedAt: timestamp,
  };

  if (!deck.name) {
    return;
  }

  if (studioState.editingDeckId) {
    appState.decks = appState.decks.map((entry) => (entry.id === deck.id ? deck : entry));
  } else {
    appState.decks.unshift(deck);
  }
  appState.preferences.selectedDeckId = deck.id;
  resetDeckForm();
  closeSheet();
  saveState();
  render();
}

function handleCardFormSubmit(event) {
  event.preventDefault();
  const timestamp = new Date().toISOString();
  const rawTerm = elements.cardTerm.value.trim();
  const article = elements.cardArticle.value.trim();
  const partOfSpeech = elements.cardPartOfSpeech.value;
  const normalizedTerm =
    partOfSpeech === "noun" &&
    article &&
    rawTerm.toLowerCase().startsWith(`${article.toLowerCase()} `)
      ? rawTerm.slice(article.length + 1).trim()
      : rawTerm;

  const card = {
    id: studioState.editingCardId ?? createId("card"),
    deckId: elements.cardDeckSelect.value,
    partOfSpeech,
    term: normalizedTerm,
    translation: elements.cardTranslation.value.trim(),
    article: partOfSpeech === "noun" ? article : "",
    plural: partOfSpeech === "noun" ? elements.cardPlural.value.trim() : "",
    usagePattern:
      partOfSpeech === "verb"
        ? elements.cardUsagePattern.value.trim()
        : partOfSpeech === "adjective"
          ? elements.cardAdjectiveUsage.value.trim()
          : "",
    verbForms:
      partOfSpeech === "verb"
        ? normalizeVerbForms({
            auxiliary: elements.cardVerbAuxiliary.value,
            present: elements.cardVerbPresent.value,
            preterite: elements.cardVerbPreterite.value,
            participle: elements.cardVerbParticiple.value,
            imperative: elements.cardVerbImperative.value,
            usagePattern: elements.cardUsagePattern.value,
          })
        : normalizeVerbForms(),
    adjectiveForms:
      partOfSpeech === "adjective"
        ? normalizeAdjectiveForms({
            comparative: elements.cardAdjectiveComparative.value,
            superlative: elements.cardAdjectiveSuperlative.value,
            usage: elements.cardAdjectiveUsage.value,
          })
        : normalizeAdjectiveForms(),
    level: elements.cardLevel.value,
    tags: elements.cardTags.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    example: elements.cardExample.value.trim(),
    exampleTranslation: elements.cardExampleTranslation.value.trim(),
    note: elements.cardNote.value.trim(),
    createdAt: studioState.editingCardId ? getCardById(studioState.editingCardId)?.createdAt ?? timestamp : timestamp,
    updatedAt: timestamp,
  };

  if (!card.term || !card.translation || !card.deckId) {
    return;
  }

  if (studioState.editingCardId) {
    appState.cards = appState.cards.map((entry) => (entry.id === card.id ? card : entry));
  } else {
    appState.cards.unshift(card);
  }
  appState.preferences.selectedDeckId = card.deckId;
  resetCardForm();
  syncSessionAfterDataChange();
  closeSheet();
  saveState();
  render();
}

function handleKeyboardShortcuts(event) {
  if (event.key === "Escape" && uiState.activeSheet) {
    closeSheet({ resetCard: true, resetDeck: true });
    return;
  }

  if (event.key === "Escape" && uiState.commandOpen) {
    closeCommandPalette();
    elements.commandSearchInput.blur();
    return;
  }

  if (event.key === "Escape" && uiState.navOpen) {
    setNavigationOpen(false);
    return;
  }

  if (event.key === "/" && document.activeElement !== elements.commandSearchInput) {
    const activeTag = document.activeElement?.tagName;
    if (activeTag !== "INPUT" && activeTag !== "TEXTAREA" && activeTag !== "SELECT") {
      event.preventDefault();
      focusCommandSearch();
      return;
    }
  }

  const tag = document.activeElement?.tagName;
  const focusedTypedAnswer = document.activeElement === elements.typedAnswerInput;
  if ((tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") && !focusedTypedAnswer) {
    return;
  }

  if (event.code === "Space" && !sessionState.revealed && getCurrentCard() && !focusedTypedAnswer) {
    event.preventDefault();
    sessionState.revealed = true;
    renderStudy();
    return;
  }

  const mapping = {
    Digit1: "again",
    Digit2: "hard",
    Digit3: "good",
    Digit4: "easy",
  };
  const score = mapping[event.code];
  if (score && sessionState.revealed && getCurrentCard()) {
    event.preventDefault();
    rateCurrentCard(score);
  }
}

elements.viewTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveView(tab.dataset.viewTarget);
  });
});
elements.progressSectionTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setProgressSection(tab.dataset.progressTarget);
  });
});
elements.studioSectionTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setStudioSection(tab.dataset.studioTarget);
  });
});
elements.progressMenuToggleBtn.addEventListener("click", () => {
  setSectionMenuOpen("progress", !uiState.progressMenuOpen);
  renderSectionMenus();
});
elements.studioMenuToggleBtn.addEventListener("click", () => {
  setSectionMenuOpen("studio", !uiState.studioMenuOpen);
  renderSectionMenus();
});
elements.commandSearchInput.addEventListener("focus", () => {
  uiState.commandOpen = true;
  uiState.commandIndex = 0;
  renderCommandPalette();
});
elements.commandSearchInput.addEventListener("input", () => {
  uiState.commandOpen = true;
  uiState.commandIndex = 0;
  renderCommandPalette();
});
elements.commandSearchInput.addEventListener("keydown", handleCommandInputKeydown);
elements.commandResultsPanel.addEventListener("mousedown", (event) => {
  const trigger = event.target.closest("[data-command-index]");
  if (!trigger) {
    return;
  }
  event.preventDefault();
  executeCommandResult(Number(trigger.getAttribute("data-command-index")));
});
elements.searchInput.addEventListener("input", renderDecks);
elements.levelFilter.addEventListener("change", renderDecks);
elements.managerSearchInput.addEventListener("input", renderManager);
elements.managerFilter.addEventListener("change", renderManager);
elements.openCardSheetBtn.addEventListener("click", () => openCardSheet({ section: "cards" }));
elements.openDeckSheetBtn.addEventListener("click", () => openDeckSheet({ section: "decks" }));
elements.openCardSheetFromManagerBtn.addEventListener("click", () => openCardSheet({ section: "manage" }));
elements.openDeckSheetFromManagerBtn.addEventListener("click", () => openDeckSheet({ section: "manage" }));
elements.jumpManagerBtn.addEventListener("click", () => {
  setActiveView("studio", { persist: false });
  setStudioSection("manage");
});
elements.jumpManagerFromDecksBtn.addEventListener("click", () => {
  setActiveView("studio", { persist: false });
  setStudioSection("manage");
});
elements.goalForm.addEventListener("submit", handleGoalFormSubmit);
elements.deckGrid.addEventListener("click", handleDeckActions);
elements.selectedDeckPanel.addEventListener("click", handleManagerActions);
elements.managedCardList.addEventListener("click", handleManagerActions);
elements.managedCardList.addEventListener("pointerdown", handleManagedCardPointerDown);
elements.managedCardList.addEventListener("pointermove", handleManagedCardPointerMove);
elements.managedCardList.addEventListener("pointerup", finishManagedCardSwipe);
elements.managedCardList.addEventListener("pointercancel", finishManagedCardSwipe);
elements.registerBtn.addEventListener("click", () => {
  registerAccount().catch((error) => setAuthStatus(error.message));
});
elements.loginBtn.addEventListener("click", () => {
  loginAccount().catch((error) => setAuthStatus(error.message));
});
elements.syncNowBtn.addEventListener("click", () => {
  syncAccountState().catch((error) => setAuthStatus(error.message));
});
elements.pullServerBtn.addEventListener("click", () => {
  pullAccountState().catch((error) => setAuthStatus(error.message));
});
elements.logoutBtn.addEventListener("click", () => {
  logoutAccount().catch((error) => setAuthStatus(error.message));
});
elements.passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  changePassword().catch((error) => {
    setPasswordStatus(error.message);
  });
});
elements.refreshSessionsBtn.addEventListener("click", () => {
  refreshAccountSessions().catch((error) => setSessionStatus(error.message));
});
elements.sessionList.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-action='revoke-session']");
  const sessionId = trigger?.getAttribute("data-session-id");
  if (!sessionId) {
    return;
  }
  revokeSession(sessionId).catch((error) => setSessionStatus(error.message));
});
elements.studyDueBtn.addEventListener("click", () =>
  startSession(appState.preferences.selectedDeckId ?? "all", "due"),
);
elements.studyMixedBtn.addEventListener("click", () => startSession("all", "all"));
elements.studyWeakBtn.addEventListener("click", () =>
  startSession(appState.preferences.selectedDeckId ?? "all", "mistakes"),
);
elements.studyListeningBtn.addEventListener("click", () => startSession("all", "listening"));
elements.topbarStudyBtn.addEventListener("click", () =>
  startSession(appState.preferences.selectedDeckId ?? "all", "due"),
);
elements.checkAnswerBtn.addEventListener("click", checkTypedAnswer);
elements.typedAnswerInput.addEventListener("input", (event) => {
  sessionState.typedAnswer = event.target.value;
});
elements.typedAnswerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    checkTypedAnswer();
  }
});
elements.revealBtn.addEventListener("click", () => {
  sessionState.typedAnswer = elements.typedAnswerInput.value;
  sessionState.lastEvaluation = null;
  sessionState.revealed = true;
  renderStudy();
});
elements.pronounceBtn.addEventListener("click", pronounceCurrentCard);
elements.recordBtn.addEventListener("click", startAnswerRecording);
elements.stopRecordBtn.addEventListener("click", stopAnswerRecording);
elements.playRecordBtn.addEventListener("click", playLastRecording);
elements.requeueBtn.addEventListener("click", () =>
  startSession(appState.preferences.selectedDeckId ?? "all", sessionState.source),
);
elements.ratingButtons.forEach((button) => {
  button.addEventListener("click", () => rateCurrentCard(button.dataset.score));
});
elements.installBtn.addEventListener("click", triggerInstall);
elements.exportJsonBtn.addEventListener("click", exportState);
elements.importJsonBtn.addEventListener("click", () => elements.importInput.click());
elements.exportCsvBtn.addEventListener("click", exportCardsToCsv);
elements.importCsvBtn.addEventListener("click", () => elements.csvImportInput.click());
elements.exportSyncBtn.addEventListener("click", exportSyncPacket);
elements.importSyncBtn.addEventListener("click", () => elements.syncImportInput.click());
elements.importInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) {
    importState(file);
  }
  event.target.value = "";
});
elements.csvImportInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) {
    importCsv(file);
  }
  event.target.value = "";
});
elements.syncImportInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) {
    importSyncPacket(file);
  }
  event.target.value = "";
});
elements.resetBtn.addEventListener("click", resetProgress);
elements.deckForm.addEventListener("submit", handleDeckFormSubmit);
elements.cardForm.addEventListener("submit", handleCardFormSubmit);
elements.cardPartOfSpeech.addEventListener("change", applyCardTypeUI);
elements.deckCancelBtn.addEventListener("click", () => closeSheet({ resetDeck: true }));
elements.cardCancelBtn.addEventListener("click", () => closeSheet({ resetCard: true }));
elements.closeCardSheetBtn.addEventListener("click", () => closeSheet({ resetCard: true }));
elements.closeDeckSheetBtn.addEventListener("click", () => closeSheet({ resetDeck: true }));
elements.sheetBackdrop.addEventListener("click", () => closeSheet({ resetCard: true, resetDeck: true }));
elements.menuToggleBtn.addEventListener("click", () => setNavigationOpen(!uiState.navOpen));
elements.closeSidebarBtn.addEventListener("click", () => setNavigationOpen(false));
elements.sidebarBackdrop.addEventListener("click", () => setNavigationOpen(false));
document.addEventListener("keydown", handleKeyboardShortcuts);
document.addEventListener("click", (event) => {
  if (!event.target.closest(".command-bar")) {
    closeCommandPalette();
  }
  if (!event.target.closest(".managed-card") && uiState.openSwipeCardId) {
    closeManagedCardSwipe();
  }
});
window.addEventListener("resize", () => {
  if (!isCompactNavigationViewport()) {
    setNavigationOpen(false);
  }
  renderSectionMenus();
  closeManagedCardSwipe();
});
window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
window.addEventListener("appinstalled", () => {
  installState.installed = true;
  installState.deferredPrompt = null;
  elements.installBtn.classList.add("hidden");
  setInstallStatus("Wortwald has been installed. Open it from your app launcher for offline study.");
});
window.addEventListener("beforeunload", releaseAudioResources);

render();
registerServiceWorker();
detectBackendSupport()
  .catch(() => {
    backendState.available = false;
    backendState.checked = true;
    renderAuth();
  })
  .finally(() => {
    hydrateAuthSession();
  });
