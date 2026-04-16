const STORAGE_KEY = "wortwald-state-v1";
const AUTH_TOKEN_KEY = "wortwald-auth-token-v1";
const PASSWORD_MIN_LENGTH = 8;
const API_HEALTH_TIMEOUT_MS = 2500;
const VIEW_KEYS = ["library", "study", "progress", "studio"];
const PROGRESS_SECTION_KEYS = ["snapshot", "sync", "reviews"];
const STUDIO_SECTION_KEYS = ["cards", "decks", "manage"];
const VERB_PERSON_KEYS = ["ich", "du", "er", "wir", "ihr", "sie"];
const VERB_PERSON_LABELS = {
  ich: "ich",
  du: "du",
  er: "er/sie/es",
  wir: "wir",
  ihr: "ihr",
  sie: "sie/Sie",
};
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
  "verbIch",
  "verbDu",
  "verbEr",
  "verbWir",
  "verbIhr",
  "verbSie",
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

const RETIRED_SEED_UPDATED_AT = "2026-04-17T00:00:00.000Z";
const retiredSeedDeckIds = new Set([
  "deck-cafe",
  "deck-nouns",
  "deck-travel",
  "deck-descriptions",
  "deck-a1-home-city-nouns",
  "deck-a1-food-shopping-nouns",
  "deck-a1-people-daily-nouns",
  "deck-a2-health-appointments-nouns",
  "deck-a1-daily-verbs",
  "deck-a2-routine-verbs",
  "deck-a1-survival-phrases",
  "deck-a2-social-phrases",
  "deck-a1-core-adjectives",
  "deck-a2-situation-adjectives",
  "deck-a2-tense-snapshots",
  "deck-a2-grammar-patterns",
]);

function createSeedTagList(tags, type) {
  return [...new Set([...(Array.isArray(tags) ? tags : []), type])];
}

function buildSeedVerbCards(deckId, rows) {
  return rows.map(
    ([
      id,
      term,
      translation,
      level,
      tags,
      example,
      exampleTranslation,
      note,
      auxiliary,
      present,
      preterite,
      participle,
      imperative,
      usagePattern,
    ]) => ({
      id,
      deckId,
      term,
      translation,
      article: "",
      plural: "",
      level,
      tags: createSeedTagList(tags, "verb"),
      example,
      exampleTranslation,
      note,
      usagePattern,
      disableCloze: true,
      partOfSpeech: "verb",
      verbForms: {
        auxiliary,
        present,
        preterite,
        participle,
        imperative,
        usagePattern,
      },
    }),
  );
}

const seedDecks = [
  {
    id: "deck-common-verbs-100",
    name: "100 Common German Verbs",
    level: "A1",
    focus: "high-frequency verbs, full conjugation, Perfekt helper",
    description:
      "One clean reference deck with 100 common German verbs, full present-tense conjugation, auxiliary, simple past, participle, imperative, and natural example sentences.",
  },
];

const seedCards = buildSeedVerbCards("deck-common-verbs-100", [
  [
    "card-verb-sein",
    "sein",
    "to be",
    "A1",
    ["top-100", "irregular", "core"],
    "Ich bin heute zu Hause.",
    "I am at home today.",
    "Core verb for identity, description, and location.",
    "sein",
    "ich bin · du bist · er/sie/es ist · wir sind · ihr seid · sie/Sie sind",
    "war",
    "gewesen",
    "sei",
    "identity, location",
  ],
  [
    "card-verb-haben",
    "haben",
    "to have",
    "A1",
    ["top-100", "irregular", "core"],
    "Wir haben heute nicht viel Zeit.",
    "We do not have much time today.",
    "Core possession verb and common perfect-tense auxiliary.",
    "haben",
    "ich habe · du hast · er/sie/es hat · wir haben · ihr habt · sie/Sie haben",
    "hatte",
    "gehabt",
    "hab",
    "Akk object",
  ],
  [
    "card-verb-werden",
    "werden",
    "to become, will",
    "A1",
    ["top-100", "irregular", "core"],
    "Es wird heute Abend kalt.",
    "It will get cold this evening.",
    "Used for change, future meaning, and passive structures.",
    "sein",
    "ich werde · du wirst · er/sie/es wird · wir werden · ihr werdet · sie/Sie werden",
    "wurde",
    "geworden",
    "werde",
    "change, future, passive helper",
  ],
  [
    "card-verb-koennen",
    "können",
    "to be able to, can",
    "A1",
    ["top-100", "modal", "irregular"],
    "Kannst du mir kurz helfen?",
    "Can you help me briefly?",
    "Modal verb for ability and possibility; imperative is unusual.",
    "haben",
    "ich kann · du kannst · er/sie/es kann · wir können · ihr könnt · sie/Sie können",
    "konnte",
    "gekonnt",
    "",
    "modal + infinitive",
  ],
  [
    "card-verb-muessen",
    "müssen",
    "to have to, must",
    "A1",
    ["top-100", "modal", "irregular"],
    "Ich muss morgen früh aufstehen.",
    "I have to get up early tomorrow.",
    "Modal verb for necessity; imperative is unusual.",
    "haben",
    "ich muss · du musst · er/sie/es muss · wir müssen · ihr müsst · sie/Sie müssen",
    "musste",
    "gemusst",
    "",
    "modal + infinitive",
  ],
  [
    "card-verb-wollen",
    "wollen",
    "to want",
    "A1",
    ["top-100", "modal", "irregular"],
    "Wir wollen heute zusammen kochen.",
    "We want to cook together today.",
    "Modal verb for intention and desire; imperative is unusual.",
    "haben",
    "ich will · du willst · er/sie/es will · wir wollen · ihr wollt · sie/Sie wollen",
    "wollte",
    "gewollt",
    "",
    "modal + infinitive",
  ],
  [
    "card-verb-sollen",
    "sollen",
    "to be supposed to, should",
    "A1",
    ["top-100", "modal", "core"],
    "Du sollst heute den Arzt anrufen.",
    "You are supposed to call the doctor today.",
    "Modal verb for obligation, advice, or reported instructions.",
    "haben",
    "ich soll · du sollst · er/sie/es soll · wir sollen · ihr sollt · sie/Sie sollen",
    "sollte",
    "gesollt",
    "",
    "modal + infinitive",
  ],
  [
    "card-verb-duerfen",
    "dürfen",
    "to be allowed to, may",
    "A1",
    ["top-100", "modal", "irregular"],
    "Darf ich hier sitzen?",
    "May I sit here?",
    "Modal verb for permission and polite requests.",
    "haben",
    "ich darf · du darfst · er/sie/es darf · wir dürfen · ihr dürft · sie/Sie dürfen",
    "durfte",
    "gedurft",
    "",
    "modal + infinitive",
  ],
  [
    "card-verb-moegen",
    "mögen",
    "to like",
    "A1",
    ["top-100", "modal", "irregular"],
    "Ich mag diesen Kaffee sehr.",
    "I like this coffee a lot.",
    "Base verb for liking; polite möchte comes from this verb.",
    "haben",
    "ich mag · du magst · er/sie/es mag · wir mögen · ihr mögt · sie/Sie mögen",
    "mochte",
    "gemocht",
    "",
    "Akk object",
  ],
  [
    "card-verb-machen",
    "machen",
    "to do, make",
    "A1",
    ["top-100", "core", "routine"],
    "Was machst du heute Abend?",
    "What are you doing this evening?",
    "Extremely frequent everyday verb with many collocations.",
    "haben",
    "ich mache · du machst · er/sie/es macht · wir machen · ihr macht · sie/Sie machen",
    "machte",
    "gemacht",
    "mach",
    "Akk object",
  ],
  [
    "card-verb-sagen",
    "sagen",
    "to say, tell",
    "A1",
    ["top-100", "communication", "core"],
    "Kannst du das bitte noch einmal sagen?",
    "Can you say that once again, please?",
    "High-frequency communication verb for direct speech and information.",
    "haben",
    "ich sage · du sagst · er/sie/es sagt · wir sagen · ihr sagt · sie/Sie sagen",
    "sagte",
    "gesagt",
    "sag",
    "Dat + Akk / clause",
  ],
  [
    "card-verb-geben",
    "geben",
    "to give",
    "A1",
    ["top-100", "irregular", "core"],
    "Kannst du mir bitte den Schlüssel geben?",
    "Can you give me the key, please?",
    "Common irregular verb that often takes dative plus accusative.",
    "haben",
    "ich gebe · du gibst · er/sie/es gibt · wir geben · ihr gebt · sie/Sie geben",
    "gab",
    "gegeben",
    "gib",
    "Dat + Akk",
  ],
  [
    "card-verb-kommen",
    "kommen",
    "to come",
    "A1",
    ["top-100", "movement", "core"],
    "Kommst du heute mit ins Café?",
    "Are you coming to the café with us today?",
    "Core movement verb for arrival, origin, and invitation contexts.",
    "sein",
    "ich komme · du kommst · er/sie/es kommt · wir kommen · ihr kommt · sie/Sie kommen",
    "kam",
    "gekommen",
    "komm",
    "aus / von / zu + Dat",
  ],
  [
    "card-verb-gehen",
    "gehen",
    "to go, walk",
    "A1",
    ["top-100", "movement", "core"],
    "Ich gehe jetzt nach Hause.",
    "I am going home now.",
    "Core movement verb and very common future-with-present verb.",
    "sein",
    "ich gehe · du gehst · er/sie/es geht · wir gehen · ihr geht · sie/Sie gehen",
    "ging",
    "gegangen",
    "geh",
    "nach / zu + Dat",
  ],
  [
    "card-verb-sehen",
    "sehen",
    "to see",
    "A1",
    ["top-100", "irregular", "perception"],
    "Ich sehe den Bus schon.",
    "I can already see the bus.",
    "High-frequency perception verb, also common in social talk.",
    "haben",
    "ich sehe · du siehst · er/sie/es sieht · wir sehen · ihr seht · sie/Sie sehen",
    "sah",
    "gesehen",
    "sieh",
    "Akk object",
  ],
  [
    "card-verb-wissen",
    "wissen",
    "to know",
    "A1",
    ["top-100", "irregular", "thinking"],
    "Ich weiß die Antwort leider nicht.",
    "Unfortunately I do not know the answer.",
    "Use for facts and information, not for knowing people.",
    "haben",
    "ich weiß · du weißt · er/sie/es weiß · wir wissen · ihr wisst · sie/Sie wissen",
    "wusste",
    "gewusst",
    "wisse",
    "fact, clause, Akk object",
  ],
  [
    "card-verb-kennen",
    "kennen",
    "to know, be acquainted with",
    "A1",
    ["top-100", "people", "thinking"],
    "Kennst du diese Straße?",
    "Do you know this street?",
    "Use for people, places, and things you are familiar with.",
    "haben",
    "ich kenne · du kennst · er/sie/es kennt · wir kennen · ihr kennt · sie/Sie kennen",
    "kannte",
    "gekannt",
    "kenn",
    "Akk object",
  ],
  [
    "card-verb-nehmen",
    "nehmen",
    "to take",
    "A1",
    ["top-100", "irregular", "daily-life"],
    "Ich nehme heute den Zug.",
    "I am taking the train today.",
    "Common strong verb for transport, food, medicine, and choices.",
    "haben",
    "ich nehme · du nimmst · er/sie/es nimmt · wir nehmen · ihr nehmt · sie/Sie nehmen",
    "nahm",
    "genommen",
    "nimm",
    "Akk object",
  ],
  [
    "card-verb-finden",
    "finden",
    "to find",
    "A1",
    ["top-100", "irregular", "daily-life"],
    "Ich finde meinen Ausweis nicht.",
    "I cannot find my ID.",
    "Used for lost things and for opinions like ich finde ...",
    "haben",
    "ich finde · du findest · er/sie/es findet · wir finden · ihr findet · sie/Sie finden",
    "fand",
    "gefunden",
    "find",
    "Akk object",
  ],
  [
    "card-verb-bleiben",
    "bleiben",
    "to stay, remain",
    "A1",
    ["top-100", "irregular", "movement"],
    "Am Wochenende bleiben wir zu Hause.",
    "We are staying at home at the weekend.",
    "State verb with sein in Perfekt.",
    "sein",
    "ich bleibe · du bleibst · er/sie/es bleibt · wir bleiben · ihr bleibt · sie/Sie bleiben",
    "blieb",
    "geblieben",
    "bleib",
    "bei / in / zu + Dat",
  ],
  [
    "card-verb-stehen",
    "stehen",
    "to stand",
    "A1",
    ["top-100", "irregular", "location"],
    "Die Flasche steht auf dem Tisch.",
    "The bottle is standing on the table.",
    "Very common location verb in everyday descriptions.",
    "haben",
    "ich stehe · du stehst · er/sie/es steht · wir stehen · ihr steht · sie/Sie stehen",
    "stand",
    "gestanden",
    "steh",
    "location / auf + Dat",
  ],
  [
    "card-verb-liegen",
    "liegen",
    "to lie, be situated",
    "A1",
    ["top-100", "location", "irregular"],
    "Die Schlüssel liegen in der Küche.",
    "The keys are lying in the kitchen.",
    "Common location verb for flat objects and places.",
    "haben",
    "ich liege · du liegst · er/sie/es liegt · wir liegen · ihr liegt · sie/Sie liegen",
    "lag",
    "gelegen",
    "lieg",
    "location / in + Dat",
  ],
  [
    "card-verb-sitzen",
    "sitzen",
    "to sit",
    "A1",
    ["top-100", "location", "daily-life"],
    "Wir sitzen gerade im Wartezimmer.",
    "We are sitting in the waiting room right now.",
    "Useful for people, seats, and waiting situations.",
    "haben",
    "ich sitze · du sitzt · er/sie/es sitzt · wir sitzen · ihr sitzt · sie/Sie sitzen",
    "saß",
    "gesessen",
    "sitz",
    "location / in + Dat",
  ],
  [
    "card-verb-heissen",
    "heißen",
    "to be called, be named",
    "A1",
    ["top-100", "introductions", "irregular"],
    "Wie heißt du?",
    "What is your name?",
    "Very common introduction verb for names and labels.",
    "haben",
    "ich heiße · du heißt · er/sie/es heißt · wir heißen · ihr heißt · sie/Sie heißen",
    "hieß",
    "geheißen",
    "heiß",
    "name / identity",
  ],
  [
    "card-verb-denken",
    "denken",
    "to think",
    "A1",
    ["top-100", "thinking", "irregular"],
    "Ich denke oft an meine Familie.",
    "I often think about my family.",
    "Very common with an + accusative and opinion clauses.",
    "haben",
    "ich denke · du denkst · er/sie/es denkt · wir denken · ihr denkt · sie/Sie denken",
    "dachte",
    "gedacht",
    "denk",
    "an + Akk / clause",
  ],
  [
    "card-verb-glauben",
    "glauben",
    "to believe, think",
    "A1",
    ["top-100", "thinking", "communication"],
    "Ich glaube, dass er später kommt.",
    "I think that he is coming later.",
    "Common for opinions and assumptions in spoken German.",
    "haben",
    "ich glaube · du glaubst · er/sie/es glaubt · wir glauben · ihr glaubt · sie/Sie glauben",
    "glaubte",
    "geglaubt",
    "glaub",
    "an + Akk / clause",
  ],
  [
    "card-verb-meinen",
    "meinen",
    "to mean, think",
    "A1",
    ["top-100", "thinking", "communication"],
    "Was meinst du damit?",
    "What do you mean by that?",
    "Useful for opinions and clarifying what someone means.",
    "haben",
    "ich meine · du meinst · er/sie/es meint · wir meinen · ihr meint · sie/Sie meinen",
    "meinte",
    "gemeint",
    "mein",
    "Akk / clause",
  ],
  [
    "card-verb-sprechen",
    "sprechen",
    "to speak",
    "A1",
    ["top-100", "communication", "irregular"],
    "Sprechen Sie Englisch?",
    "Do you speak English?",
    "Essential communication verb for languages, calls, and meetings.",
    "haben",
    "ich spreche · du sprichst · er/sie/es spricht · wir sprechen · ihr sprecht · sie/Sie sprechen",
    "sprach",
    "gesprochen",
    "sprich",
    "mit + Dat / über + Akk",
  ],
  [
    "card-verb-reden",
    "reden",
    "to talk",
    "A1",
    ["top-100", "communication", "daily-life"],
    "Wir müssen später noch darüber reden.",
    "We still need to talk about it later.",
    "Common spoken alternative to sprechen in everyday conversation.",
    "haben",
    "ich rede · du redest · er/sie/es redet · wir reden · ihr redet · sie/Sie reden",
    "redete",
    "geredet",
    "rede",
    "mit + Dat / über + Akk",
  ],
  [
    "card-verb-fragen",
    "fragen",
    "to ask",
    "A1",
    ["top-100", "communication", "classroom"],
    "Darf ich etwas fragen?",
    "May I ask something?",
    "High-utility verb for class, work, and service situations.",
    "haben",
    "ich frage · du fragst · er/sie/es fragt · wir fragen · ihr fragt · sie/Sie fragen",
    "fragte",
    "gefragt",
    "frag",
    "Akk / nach + Dat",
  ],
  [
    "card-verb-antworten",
    "antworten",
    "to answer",
    "A1",
    ["top-100", "communication", "classroom"],
    "Kannst du mir heute noch antworten?",
    "Can you answer me today?",
    "Often combines with a dative person or auf + accusative.",
    "haben",
    "ich antworte · du antwortest · er/sie/es antwortet · wir antworten · ihr antwortet · sie/Sie antworten",
    "antwortete",
    "geantwortet",
    "antworte",
    "Dat / auf + Akk",
  ],
  [
    "card-verb-hoeren",
    "hören",
    "to hear, listen to",
    "A1",
    ["top-100", "perception", "communication"],
    "Ich höre die Musik im Nebenzimmer.",
    "I hear the music in the next room.",
    "Useful for sound, attention, and listening practice.",
    "haben",
    "ich höre · du hörst · er/sie/es hört · wir hören · ihr hört · sie/Sie hören",
    "hörte",
    "gehört",
    "hör",
    "Akk object",
  ],
  [
    "card-verb-verstehen",
    "verstehen",
    "to understand",
    "A1",
    ["top-100", "communication", "irregular"],
    "Ich verstehe diese Aufgabe nicht.",
    "I do not understand this task.",
    "One of the most useful learner verbs in real interactions.",
    "haben",
    "ich verstehe · du verstehst · er/sie/es versteht · wir verstehen · ihr versteht · sie/Sie verstehen",
    "verstand",
    "verstanden",
    "versteh",
    "Akk object / clause",
  ],
  [
    "card-verb-lernen",
    "lernen",
    "to learn, study",
    "A1",
    ["top-100", "learning", "routine"],
    "Ich lerne gerade neue Verben.",
    "I am learning new verbs right now.",
    "Core learning verb for class, study, and skill-building.",
    "haben",
    "ich lerne · du lernst · er/sie/es lernt · wir lernen · ihr lernt · sie/Sie lernen",
    "lernte",
    "gelernt",
    "lern",
    "Akk object",
  ],
  [
    "card-verb-arbeiten",
    "arbeiten",
    "to work",
    "A1",
    ["top-100", "work", "routine"],
    "Ich arbeite heute im Büro.",
    "I am working in the office today.",
    "Very common for jobs, schedules, and workplaces.",
    "haben",
    "ich arbeite · du arbeitest · er/sie/es arbeitet · wir arbeiten · ihr arbeitet · sie/Sie arbeiten",
    "arbeitete",
    "gearbeitet",
    "arbeite",
    "bei / als / an + Dat",
  ],
  [
    "card-verb-leben",
    "leben",
    "to live",
    "A1",
    ["top-100", "identity", "routine"],
    "Meine Großeltern leben auf dem Land.",
    "My grandparents live in the countryside.",
    "Common for biography, housing, and general lifestyle talk.",
    "haben",
    "ich lebe · du lebst · er/sie/es lebt · wir leben · ihr lebt · sie/Sie leben",
    "lebte",
    "gelebt",
    "leb",
    "in + Dat",
  ],
  [
    "card-verb-wohnen",
    "wohnen",
    "to live, reside",
    "A1",
    ["top-100", "housing", "routine"],
    "Wir wohnen jetzt in Leipzig.",
    "We live in Leipzig now.",
    "More specific than leben when talking about where you reside.",
    "haben",
    "ich wohne · du wohnst · er/sie/es wohnt · wir wohnen · ihr wohnt · sie/Sie wohnen",
    "wohnte",
    "gewohnt",
    "wohn",
    "in + Dat",
  ],
  [
    "card-verb-brauchen",
    "brauchen",
    "to need",
    "A1",
    ["top-100", "daily-life", "shopping"],
    "Ich brauche noch etwas Zeit.",
    "I need a little more time.",
    "High-frequency everyday verb for needs and requests.",
    "haben",
    "ich brauche · du brauchst · er/sie/es braucht · wir brauchen · ihr braucht · sie/Sie brauchen",
    "brauchte",
    "gebraucht",
    "brauch",
    "Akk object",
  ],
  [
    "card-verb-kaufen",
    "kaufen",
    "to buy",
    "A1",
    ["top-100", "shopping", "money"],
    "Ich kaufe nach der Arbeit noch Brot.",
    "I am buying bread after work.",
    "Core shopping verb for stores, apps, and errands.",
    "haben",
    "ich kaufe · du kaufst · er/sie/es kauft · wir kaufen · ihr kauft · sie/Sie kaufen",
    "kaufte",
    "gekauft",
    "kauf",
    "Akk object",
  ],
  [
    "card-verb-bezahlen",
    "bezahlen",
    "to pay",
    "A1",
    ["top-100", "shopping", "money"],
    "Kann ich mit Karte bezahlen?",
    "Can I pay by card?",
    "Important service verb for shops, tickets, and restaurants.",
    "haben",
    "ich bezahle · du bezahlst · er/sie/es bezahlt · wir bezahlen · ihr bezahlt · sie/Sie bezahlen",
    "bezahlte",
    "bezahlt",
    "bezahl",
    "Akk / für + Akk",
  ],
  [
    "card-verb-essen",
    "essen",
    "to eat",
    "A1",
    ["top-100", "food", "irregular"],
    "Was esst ihr heute Abend?",
    "What are you eating this evening?",
    "Very common irregular verb for meals and routines.",
    "haben",
    "ich esse · du isst · er/sie/es isst · wir essen · ihr esst · sie/Sie essen",
    "aß",
    "gegessen",
    "iss",
    "Akk object",
  ],
  [
    "card-verb-trinken",
    "trinken",
    "to drink",
    "A1",
    ["top-100", "food", "irregular"],
    "Ich trinke morgens immer Tee.",
    "I always drink tea in the morning.",
    "Strong verb for drinks and routines.",
    "haben",
    "ich trinke · du trinkst · er/sie/es trinkt · wir trinken · ihr trinkt · sie/Sie trinken",
    "trank",
    "getrunken",
    "trink",
    "Akk object",
  ],
  [
    "card-verb-kochen",
    "kochen",
    "to cook",
    "A1",
    ["top-100", "food", "home"],
    "Am Sonntag kochen wir für Freunde.",
    "On Sunday we cook for friends.",
    "Useful home verb that combines well with food vocabulary.",
    "haben",
    "ich koche · du kochst · er/sie/es kocht · wir kochen · ihr kocht · sie/Sie kochen",
    "kochte",
    "gekocht",
    "koch",
    "für + Akk",
  ],
  [
    "card-verb-schlafen",
    "schlafen",
    "to sleep",
    "A1",
    ["top-100", "routine", "health"],
    "Am Wochenende schlafe ich länger.",
    "I sleep longer at the weekend.",
    "Common strong verb for routine, health, and travel.",
    "haben",
    "ich schlafe · du schläfst · er/sie/es schläft · wir schlafen · ihr schlaft · sie/Sie schlafen",
    "schlief",
    "geschlafen",
    "schlaf",
    "no object",
  ],
  [
    "card-verb-warten",
    "warten",
    "to wait",
    "A1",
    ["top-100", "time", "appointments"],
    "Ich warte vor dem Eingang auf dich.",
    "I am waiting for you in front of the entrance.",
    "Very common because it often appears with auf + accusative.",
    "haben",
    "ich warte · du wartest · er/sie/es wartet · wir warten · ihr wartet · sie/Sie warten",
    "wartete",
    "gewartet",
    "warte",
    "auf + Akk",
  ],
  [
    "card-verb-helfen",
    "helfen",
    "to help",
    "A1",
    ["top-100", "help", "irregular"],
    "Können Sie mir bitte helfen?",
    "Could you help me, please?",
    "Key real-life verb and a classic dative verb.",
    "haben",
    "ich helfe · du hilfst · er/sie/es hilft · wir helfen · ihr helft · sie/Sie helfen",
    "half",
    "geholfen",
    "hilf",
    "Dat object",
  ],
  [
    "card-verb-bringen",
    "bringen",
    "to bring",
    "A1",
    ["top-100", "help", "mixed-verb"],
    "Kannst du bitte Wasser mitbringen?",
    "Can you bring some water, please?",
    "Mixed verb often used for favors, logistics, and daily help.",
    "haben",
    "ich bringe · du bringst · er/sie/es bringt · wir bringen · ihr bringt · sie/Sie bringen",
    "brachte",
    "gebracht",
    "bring",
    "Dat + Akk / Akk",
  ],
  [
    "card-verb-holen",
    "holen",
    "to get, fetch, pick up",
    "A1",
    ["top-100", "daily-life", "help"],
    "Ich hole schnell meinen Mantel.",
    "I will quickly get my coat.",
    "Common for fetching things and picking people up.",
    "haben",
    "ich hole · du holst · er/sie/es holt · wir holen · ihr holt · sie/Sie holen",
    "holte",
    "geholt",
    "hol",
    "Akk object",
  ],
  [
    "card-verb-schicken",
    "schicken",
    "to send",
    "A1",
    ["top-100", "communication", "work"],
    "Ich schicke dir heute Abend die Datei.",
    "I am sending you the file this evening.",
    "Very practical for messages, email, and paperwork.",
    "haben",
    "ich schicke · du schickst · er/sie/es schickt · wir schicken · ihr schickt · sie/Sie schicken",
    "schickte",
    "geschickt",
    "schick",
    "Dat + Akk",
  ],
  [
    "card-verb-schreiben",
    "schreiben",
    "to write",
    "A1",
    ["top-100", "communication", "irregular"],
    "Schreibst du mir später eine Nachricht?",
    "Will you write me a message later?",
    "Common strong verb for notes, texts, and emails.",
    "haben",
    "ich schreibe · du schreibst · er/sie/es schreibt · wir schreiben · ihr schreibt · sie/Sie schreiben",
    "schrieb",
    "geschrieben",
    "schreib",
    "Dat + Akk / Akk",
  ],
  [
    "card-verb-lesen",
    "lesen",
    "to read",
    "A1",
    ["top-100", "communication", "irregular"],
    "Ich lese morgens immer die Nachrichten.",
    "I always read the news in the morning.",
    "Common strong verb for books, messages, and signs.",
    "haben",
    "ich lese · du liest · er/sie/es liest · wir lesen · ihr lest · sie/Sie lesen",
    "las",
    "gelesen",
    "lies",
    "Akk object",
  ],
  [
    "card-verb-fahren",
    "fahren",
    "to drive, go, travel",
    "A1",
    ["top-100", "movement", "irregular"],
    "Wir fahren morgen nach Köln.",
    "We are going to Cologne tomorrow.",
    "Key travel verb; with movement it usually forms Perfekt with sein.",
    "sein",
    "ich fahre · du fährst · er/sie/es fährt · wir fahren · ihr fahrt · sie/Sie fahren",
    "fuhr",
    "gefahren",
    "fahr",
    "nach + Dat / mit + Dat",
  ],
  [
    "card-verb-laufen",
    "laufen",
    "to run, walk",
    "A1",
    ["top-100", "movement", "irregular"],
    "Ich laufe jeden Morgen zur Arbeit.",
    "I walk to work every morning.",
    "Strong movement verb often used for running or walking on foot.",
    "sein",
    "ich laufe · du läufst · er/sie/es läuft · wir laufen · ihr lauft · sie/Sie laufen",
    "lief",
    "gelaufen",
    "lauf",
    "zu + Dat / no object",
  ],
  [
    "card-verb-ankommen",
    "ankommen",
    "to arrive",
    "A1",
    ["top-100", "movement", "separable"],
    "Wann kommt der Zug in Berlin an?",
    "When does the train arrive in Berlin?",
    "High-utility separable verb for travel and meeting plans.",
    "sein",
    "ich komme an · du kommst an · er/sie/es kommt an · wir kommen an · ihr kommt an · sie/Sie kommen an",
    "kam an",
    "angekommen",
    "komm an",
    "in + Dat / bei + Dat",
  ],
  [
    "card-verb-anfangen",
    "anfangen",
    "to begin, start",
    "A1",
    ["top-100", "time", "separable"],
    "Der Kurs fängt um neun Uhr an.",
    "The course starts at nine o'clock.",
    "Very common separable verb for events, classes, and tasks.",
    "haben",
    "ich fange an · du fängst an · er/sie/es fängt an · wir fangen an · ihr fangt an · sie/Sie fangen an",
    "fing an",
    "angefangen",
    "fang an",
    "mit + Dat / infinitive",
  ],
  [
    "card-verb-aufhoeren",
    "aufhören",
    "to stop",
    "A1",
    ["top-100", "time", "separable"],
    "Bitte hör jetzt auf.",
    "Please stop now.",
    "Common separable verb for stopping actions and noises.",
    "haben",
    "ich höre auf · du hörst auf · er/sie/es hört auf · wir hören auf · ihr hört auf · sie/Sie hören auf",
    "hörte auf",
    "aufgehört",
    "hör auf",
    "mit + Dat / infinitive",
  ],
  [
    "card-verb-erklaeren",
    "erklären",
    "to explain",
    "A1",
    ["top-100", "communication", "help"],
    "Kannst du mir das kurz erklären?",
    "Can you explain that to me briefly?",
    "Very useful in class, work, and service settings.",
    "haben",
    "ich erkläre · du erklärst · er/sie/es erklärt · wir erklären · ihr erklärt · sie/Sie erklären",
    "erklärte",
    "erklärt",
    "erklär",
    "Dat + Akk",
  ],
  [
    "card-verb-zeigen",
    "zeigen",
    "to show",
    "A1",
    ["top-100", "communication", "help"],
    "Können Sie mir bitte den Weg zeigen?",
    "Can you show me the way, please?",
    "Common help verb for directions, screens, and objects.",
    "haben",
    "ich zeige · du zeigst · er/sie/es zeigt · wir zeigen · ihr zeigt · sie/Sie zeigen",
    "zeigte",
    "gezeigt",
    "zeig",
    "Dat + Akk",
  ],
  [
    "card-verb-suchen",
    "suchen",
    "to look for",
    "A1",
    ["top-100", "daily-life", "problems"],
    "Ich suche gerade meine Tasche.",
    "I am looking for my bag right now.",
    "Very practical for lost things, jobs, apartments, and information.",
    "haben",
    "ich suche · du suchst · er/sie/es sucht · wir suchen · ihr sucht · sie/Sie suchen",
    "suchte",
    "gesucht",
    "such",
    "Akk object",
  ],
  [
    "card-verb-verkaufen",
    "verkaufen",
    "to sell",
    "A1",
    ["top-100", "shopping", "work"],
    "Der Laden verkauft auch Bücher.",
    "The shop also sells books.",
    "Common in shopping, work, and online marketplace contexts.",
    "haben",
    "ich verkaufe · du verkaufst · er/sie/es verkauft · wir verkaufen · ihr verkauft · sie/Sie verkaufen",
    "verkaufte",
    "verkauft",
    "verkauf",
    "Akk object",
  ],
  [
    "card-verb-bestellen",
    "bestellen",
    "to order",
    "A1",
    ["top-100", "shopping", "restaurant"],
    "Ich möchte einen Kaffee bestellen.",
    "I would like to order a coffee.",
    "Very common in restaurants, delivery apps, and shops.",
    "haben",
    "ich bestelle · du bestellst · er/sie/es bestellt · wir bestellen · ihr bestellt · sie/Sie bestellen",
    "bestellte",
    "bestellt",
    "bestell",
    "Akk object",
  ],
  [
    "card-verb-reservieren",
    "reservieren",
    "to reserve",
    "A1",
    ["top-100", "restaurant", "travel"],
    "Wir reservieren einen Tisch für zwei.",
    "We are reserving a table for two.",
    "Useful for restaurants, hotels, and appointments.",
    "haben",
    "ich reserviere · du reservierst · er/sie/es reserviert · wir reservieren · ihr reserviert · sie/Sie reservieren",
    "reservierte",
    "reserviert",
    "reservier",
    "Akk object",
  ],
  [
    "card-verb-besuchen",
    "besuchen",
    "to visit",
    "A1",
    ["top-100", "social", "travel"],
    "Am Wochenende besuchen wir unsere Freunde.",
    "At the weekend we are visiting our friends.",
    "Common for people, places, classes, and websites.",
    "haben",
    "ich besuche · du besuchst · er/sie/es besucht · wir besuchen · ihr besucht · sie/Sie besuchen",
    "besuchte",
    "besucht",
    "besuch",
    "Akk object",
  ],
  [
    "card-verb-treffen",
    "treffen",
    "to meet",
    "A1",
    ["top-100", "social", "irregular"],
    "Wir treffen uns um sechs vor dem Kino.",
    "We are meeting at six in front of the cinema.",
    "Common as both treffen and sich treffen mit.",
    "haben",
    "ich treffe · du triffst · er/sie/es trifft · wir treffen · ihr trefft · sie/Sie treffen",
    "traf",
    "getroffen",
    "triff",
    "Akk / sich mit + Dat",
  ],
  [
    "card-verb-gefallen",
    "gefallen",
    "to please, appeal to",
    "A1",
    ["top-100", "opinion", "irregular"],
    "Wie gefällt dir die Wohnung?",
    "How do you like the apartment?",
    "Common opinion verb that takes a dative person.",
    "haben",
    "ich gefalle · du gefällst · er/sie/es gefällt · wir gefallen · ihr gefallt · sie/Sie gefallen",
    "gefiel",
    "gefallen",
    "gefalle",
    "Dat person",
  ],
  [
    "card-verb-benutzen",
    "benutzen",
    "to use",
    "A1",
    ["top-100", "daily-life", "technology"],
    "Benutzt du oft diese App?",
    "Do you use this app often?",
    "Very practical for tools, apps, machines, and transport.",
    "haben",
    "ich benutze · du benutzt · er/sie/es benutzt · wir benutzen · ihr benutzt · sie/Sie benutzen",
    "benutzte",
    "benutzt",
    "benutz",
    "Akk object",
  ],
  [
    "card-verb-tragen",
    "tragen",
    "to carry, wear",
    "A1",
    ["top-100", "daily-life", "irregular"],
    "Heute trägt er einen warmen Mantel.",
    "Today he is wearing a warm coat.",
    "Useful for clothes and carrying things.",
    "haben",
    "ich trage · du trägst · er/sie/es trägt · wir tragen · ihr tragt · sie/Sie tragen",
    "trug",
    "getragen",
    "trag",
    "Akk object",
  ],
  [
    "card-verb-ziehen",
    "ziehen",
    "to pull, move",
    "A1",
    ["top-100", "movement", "irregular"],
    "Nächsten Monat ziehen wir nach Dresden.",
    "Next month we are moving to Dresden.",
    "Common for pulling and for moving house.",
    "sein",
    "ich ziehe · du ziehst · er/sie/es zieht · wir ziehen · ihr zieht · sie/Sie ziehen",
    "zog",
    "gezogen",
    "zieh",
    "nach + Dat / Akk object",
  ],
  [
    "card-verb-legen",
    "legen",
    "to lay, put",
    "A1",
    ["top-100", "daily-life", "location"],
    "Leg bitte das Handy auf den Tisch.",
    "Please put the phone on the table.",
    "Directional counterpart to liegen, usually with accusative location.",
    "haben",
    "ich lege · du legst · er/sie/es legt · wir legen · ihr legt · sie/Sie legen",
    "legte",
    "gelegt",
    "leg",
    "Akk object / location",
  ],
  [
    "card-verb-stellen",
    "stellen",
    "to put, place, set",
    "A1",
    ["top-100", "daily-life", "location"],
    "Stell die Flasche bitte in den Kühlschrank.",
    "Please put the bottle in the fridge.",
    "Very common placement verb and also frequent in questions.",
    "haben",
    "ich stelle · du stellst · er/sie/es stellt · wir stellen · ihr stellt · sie/Sie stellen",
    "stellte",
    "gestellt",
    "stell",
    "Akk object / location",
  ],
  [
    "card-verb-oeffnen",
    "öffnen",
    "to open",
    "A1",
    ["top-100", "daily-life", "home"],
    "Kannst du bitte das Fenster öffnen?",
    "Can you open the window, please?",
    "Common home, office, app, and shop verb.",
    "haben",
    "ich öffne · du öffnest · er/sie/es öffnet · wir öffnen · ihr öffnet · sie/Sie öffnen",
    "öffnete",
    "geöffnet",
    "öffne",
    "Akk object",
  ],
  [
    "card-verb-schliessen",
    "schließen",
    "to close, lock",
    "A1",
    ["top-100", "daily-life", "irregular"],
    "Bitte schließ die Tür.",
    "Please close the door.",
    "Common for doors, shops, accounts, and formal processes.",
    "haben",
    "ich schließe · du schließt · er/sie/es schließt · wir schließen · ihr schließt · sie/Sie schließen",
    "schloss",
    "geschlossen",
    "schließ",
    "Akk object",
  ],
  [
    "card-verb-putzen",
    "putzen",
    "to clean",
    "A1",
    ["top-100", "home", "routine"],
    "Am Samstag putze ich die Küche.",
    "On Saturday I clean the kitchen.",
    "Common home verb, also used for teeth and shoes.",
    "haben",
    "ich putze · du putzt · er/sie/es putzt · wir putzen · ihr putzt · sie/Sie putzen",
    "putzte",
    "geputzt",
    "putz",
    "Akk object",
  ],
  [
    "card-verb-waschen",
    "waschen",
    "to wash",
    "A1",
    ["top-100", "home", "irregular"],
    "Ich wasche heute noch meine Kleidung.",
    "I am still washing my clothes today.",
    "Common for laundry, dishes, and personal care.",
    "haben",
    "ich wasche · du wäschst · er/sie/es wäscht · wir waschen · ihr wascht · sie/Sie waschen",
    "wusch",
    "gewaschen",
    "wasch",
    "Akk object / reflexive",
  ],
  [
    "card-verb-duschen",
    "duschen",
    "to shower",
    "A1",
    ["top-100", "routine", "reflexive"],
    "Ich dusche morgens immer sehr schnell.",
    "I always shower very quickly in the morning.",
    "Common daily-routine verb, often used reflexively.",
    "haben",
    "ich dusche · du duschst · er/sie/es duscht · wir duschen · ihr duscht · sie/Sie duschen",
    "duschte",
    "geduscht",
    "dusch",
    "(sich) duschen",
  ],
  [
    "card-verb-anrufen",
    "anrufen",
    "to call, phone",
    "A1",
    ["top-100", "communication", "separable"],
    "Ich rufe dich heute Abend an.",
    "I am calling you this evening.",
    "Very common separable verb for calls and reminders.",
    "haben",
    "ich rufe an · du rufst an · er/sie/es ruft an · wir rufen an · ihr ruft an · sie/Sie rufen an",
    "rief an",
    "angerufen",
    "ruf an",
    "Akk object",
  ],
  [
    "card-verb-erzaehlen",
    "erzählen",
    "to tell, narrate",
    "A1",
    ["top-100", "communication", "social"],
    "Erzähl mir später davon.",
    "Tell me about it later.",
    "Useful for stories, explanations, and updates.",
    "haben",
    "ich erzähle · du erzählst · er/sie/es erzählt · wir erzählen · ihr erzählt · sie/Sie erzählen",
    "erzählte",
    "erzählt",
    "erzähl",
    "Dat + Akk / von + Dat",
  ],
  [
    "card-verb-vergessen",
    "vergessen",
    "to forget",
    "A1",
    ["top-100", "daily-life", "irregular"],
    "Ich vergesse immer meinen Regenschirm.",
    "I always forget my umbrella.",
    "Frequent strong verb for objects, tasks, and appointments.",
    "haben",
    "ich vergesse · du vergisst · er/sie/es vergisst · wir vergessen · ihr vergesst · sie/Sie vergessen",
    "vergaß",
    "vergessen",
    "vergiss",
    "Akk object",
  ],
  [
    "card-verb-verlieren",
    "verlieren",
    "to lose",
    "A1",
    ["top-100", "daily-life", "irregular"],
    "Ich habe meinen Schlüssel verloren.",
    "I lost my key.",
    "Very practical for real-life problems and travel situations.",
    "haben",
    "ich verliere · du verlierst · er/sie/es verliert · wir verlieren · ihr verliert · sie/Sie verlieren",
    "verlor",
    "verloren",
    "verlier",
    "Akk object",
  ],
  [
    "card-verb-gewinnen",
    "gewinnen",
    "to win",
    "A1",
    ["top-100", "leisure", "irregular"],
    "Unsere Mannschaft hat gestern gewonnen.",
    "Our team won yesterday.",
    "Common in sports, games, and competitions.",
    "haben",
    "ich gewinne · du gewinnst · er/sie/es gewinnt · wir gewinnen · ihr gewinnt · sie/Sie gewinnen",
    "gewann",
    "gewonnen",
    "gewinn",
    "Akk object / no object",
  ],
  [
    "card-verb-bekommen",
    "bekommen",
    "to get, receive",
    "A1",
    ["top-100", "daily-life", "communication"],
    "Ich habe heute eine wichtige E-Mail bekommen.",
    "I got an important email today.",
    "Very common everyday verb for receiving things and news.",
    "haben",
    "ich bekomme · du bekommst · er/sie/es bekommt · wir bekommen · ihr bekommt · sie/Sie bekommen",
    "bekam",
    "bekommen",
    "bekomm",
    "Akk object",
  ],
  [
    "card-verb-halten",
    "halten",
    "to hold, stop",
    "A1",
    ["top-100", "irregular", "daily-life"],
    "Der Bus hält direkt vor dem Bahnhof.",
    "The bus stops right in front of the station.",
    "Common strong verb for holding, stopping, and opinions.",
    "haben",
    "ich halte · du hältst · er/sie/es hält · wir halten · ihr haltet · sie/Sie halten",
    "hielt",
    "gehalten",
    "halt",
    "Akk object / opinion",
  ],
  [
    "card-verb-lassen",
    "lassen",
    "to let, leave",
    "A1",
    ["top-100", "irregular", "grammar"],
    "Lass bitte das Licht an.",
    "Please leave the light on.",
    "Very common helper verb for requests and causative meanings.",
    "haben",
    "ich lasse · du lässt · er/sie/es lässt · wir lassen · ihr lasst · sie/Sie lassen",
    "ließ",
    "gelassen",
    "lass",
    "Akk object / infinitive",
  ],
  [
    "card-verb-versuchen",
    "versuchen",
    "to try",
    "A1",
    ["top-100", "learning", "daily-life"],
    "Ich versuche es später noch einmal.",
    "I will try it again later.",
    "Very common for effort, problem-solving, and polite offers.",
    "haben",
    "ich versuche · du versuchst · er/sie/es versucht · wir versuchen · ihr versucht · sie/Sie versuchen",
    "versuchte",
    "versucht",
    "versuch",
    "Akk / infinitive",
  ],
  [
    "card-verb-entscheiden",
    "entscheiden",
    "to decide",
    "A1",
    ["top-100", "thinking", "irregular"],
    "Wir entscheiden das morgen.",
    "We will decide that tomorrow.",
    "Useful for plans, choices, and formal processes.",
    "haben",
    "ich entscheide · du entscheidest · er/sie/es entscheidet · wir entscheiden · ihr entscheidet · sie/Sie entscheiden",
    "entschied",
    "entschieden",
    "entscheide",
    "Akk / sich für + Akk",
  ],
  [
    "card-verb-planen",
    "planen",
    "to plan",
    "A1",
    ["top-100", "planning", "work"],
    "Wir planen gerade unseren Urlaub.",
    "We are planning our holiday right now.",
    "High-utility verb for schedules, travel, and projects.",
    "haben",
    "ich plane · du planst · er/sie/es plant · wir planen · ihr plant · sie/Sie planen",
    "plante",
    "geplant",
    "plan",
    "Akk object",
  ],
  [
    "card-verb-vorbereiten",
    "vorbereiten",
    "to prepare",
    "A1",
    ["top-100", "planning", "separable"],
    "Ich bereite den Termin gerade vor.",
    "I am preparing the appointment right now.",
    "Common for events, classes, meetings, and exams.",
    "haben",
    "ich bereite vor · du bereitest vor · er/sie/es bereitet vor · wir bereiten vor · ihr bereitet vor · sie/Sie bereiten vor",
    "bereitete vor",
    "vorbereitet",
    "bereite vor",
    "Akk object / sich auf + Akk",
  ],
  [
    "card-verb-unterschreiben",
    "unterschreiben",
    "to sign",
    "A1",
    ["top-100", "paperwork", "irregular"],
    "Wo muss ich hier unterschreiben?",
    "Where do I have to sign here?",
    "Very practical verb for forms, contracts, and deliveries.",
    "haben",
    "ich unterschreibe · du unterschreibst · er/sie/es unterschreibt · wir unterschreiben · ihr unterschreibt · sie/Sie unterschreiben",
    "unterschrieb",
    "unterschrieben",
    "unterschreib",
    "Akk object",
  ],
  [
    "card-verb-wiederholen",
    "wiederholen",
    "to repeat",
    "A1",
    ["top-100", "classroom", "communication"],
    "Können Sie das bitte wiederholen?",
    "Could you repeat that, please?",
    "Important classroom and listening-support verb.",
    "haben",
    "ich wiederhole · du wiederholst · er/sie/es wiederholt · wir wiederholen · ihr wiederholt · sie/Sie wiederholen",
    "wiederholte",
    "wiederholt",
    "wiederhol",
    "Akk object",
  ],
  [
    "card-verb-wechseln",
    "wechseln",
    "to change, switch",
    "A1",
    ["top-100", "travel", "daily-life"],
    "Ich muss in Köln den Zug wechseln.",
    "I have to change trains in Cologne.",
    "Common for transport, money, clothes, and plans.",
    "haben",
    "ich wechsle · du wechselst · er/sie/es wechselt · wir wechseln · ihr wechselt · sie/Sie wechseln",
    "wechselte",
    "gewechselt",
    "wechsle",
    "Akk object",
  ],
  [
    "card-verb-umsteigen",
    "umsteigen",
    "to change trains, switch lines",
    "A1",
    ["top-100", "travel", "separable"],
    "In München müssen wir in die U-Bahn umsteigen.",
    "In Munich we have to switch to the underground.",
    "Very practical travel verb with sein in Perfekt.",
    "sein",
    "ich steige um · du steigst um · er/sie/es steigt um · wir steigen um · ihr steigt um · sie/Sie steigen um",
    "stieg um",
    "umgestiegen",
    "steig um",
    "in + Akk",
  ],
  [
    "card-verb-reisen",
    "reisen",
    "to travel",
    "A1",
    ["top-100", "travel", "movement"],
    "Im Sommer reisen wir nach Österreich.",
    "In summer we travel to Austria.",
    "Common general travel verb, usually with sein in Perfekt.",
    "sein",
    "ich reise · du reist · er/sie/es reist · wir reisen · ihr reist · sie/Sie reisen",
    "reiste",
    "gereist",
    "reise",
    "nach + Dat",
  ],
  [
    "card-verb-mieten",
    "mieten",
    "to rent",
    "A1",
    ["top-100", "housing", "money"],
    "Wir möchten eine größere Wohnung mieten.",
    "We would like to rent a bigger apartment.",
    "Common in housing, cars, and equipment contexts.",
    "haben",
    "ich miete · du mietest · er/sie/es mietet · wir mieten · ihr mietet · sie/Sie mieten",
    "mietete",
    "gemietet",
    "miete",
    "Akk object",
  ],
  [
    "card-verb-verdienen",
    "verdienen",
    "to earn, deserve",
    "A1",
    ["top-100", "work", "money"],
    "Sie verdient gut in ihrem neuen Job.",
    "She earns well in her new job.",
    "Common for salary, work, and fairness.",
    "haben",
    "ich verdiene · du verdienst · er/sie/es verdient · wir verdienen · ihr verdient · sie/Sie verdienen",
    "verdiente",
    "verdient",
    "verdien",
    "Akk object",
  ],
  [
    "card-verb-feiern",
    "feiern",
    "to celebrate",
    "A1",
    ["top-100", "social", "leisure"],
    "Am Samstag feiern wir ihren Geburtstag.",
    "On Saturday we are celebrating her birthday.",
    "Common for birthdays, holidays, and events.",
    "haben",
    "ich feiere · du feierst · er/sie/es feiert · wir feiern · ihr feiert · sie/Sie feiern",
    "feierte",
    "gefeiert",
    "feier",
    "Akk object",
  ],
  [
    "card-verb-fuehlen",
    "fühlen",
    "to feel",
    "A1",
    ["top-100", "health", "reflexive"],
    "Ich fühle mich heute nicht so gut.",
    "I do not feel so well today.",
    "Often used reflexively for physical or emotional state.",
    "haben",
    "ich fühle · du fühlst · er/sie/es fühlt · wir fühlen · ihr fühlt · sie/Sie fühlen",
    "fühlte",
    "gefühlt",
    "fühl",
    "(sich) fühlen",
  ],
  [
    "card-verb-passieren",
    "passieren",
    "to happen",
    "A1",
    ["top-100", "daily-life", "events"],
    "Was ist gestern passiert?",
    "What happened yesterday?",
    "Very common event verb; in Perfekt it usually uses sein.",
    "sein",
    "ich passiere · du passierst · er/sie/es passiert · wir passieren · ihr passiert · sie/Sie passieren",
    "passierte",
    "passiert",
    "passiere",
    "event / also pass by",
  ],
  [
    "card-verb-spielen",
    "spielen",
    "to play",
    "A1",
    ["top-100", "leisure", "daily-life"],
    "Die Kinder spielen im Park.",
    "The children are playing in the park.",
    "Common for games, sport, instruments, and child-related talk.",
    "haben",
    "ich spiele · du spielst · er/sie/es spielt · wir spielen · ihr spielt · sie/Sie spielen",
    "spielte",
    "gespielt",
    "spiel",
    "Akk / mit + Dat",
  ],
  [
    "card-verb-hoffen",
    "hoffen",
    "to hope",
    "A1",
    ["top-100", "thinking", "social"],
    "Ich hoffe, dass alles klappt.",
    "I hope that everything works out.",
    "Very common polite and emotional verb in speech and writing.",
    "haben",
    "ich hoffe · du hoffst · er/sie/es hofft · wir hoffen · ihr hofft · sie/Sie hoffen",
    "hoffte",
    "gehofft",
    "hoff",
    "auf + Akk / clause",
  ],
  [
    "card-verb-gehoeren",
    "gehören",
    "to belong to",
    "A1",
    ["top-100", "daily-life", "dative"],
    "Diese Jacke gehört meinem Bruder.",
    "This jacket belongs to my brother.",
    "Very useful ownership verb and it takes the dative.",
    "haben",
    "ich gehöre · du gehörst · er/sie/es gehört · wir gehören · ihr gehört · sie/Sie gehören",
    "gehörte",
    "gehört",
    "gehör",
    "Dat object",
  ],
]);

function createSeedState() {
  const now = new Date().toISOString();
  return {
    decks: clone(seedDecks).map((deck) =>
      normalizeDeckEntry({
        ...deck,
        createdAt: now,
        updatedAt: now,
      }),
    ),
    cards: clone(seedCards).map((card) =>
      normalizeCardEntry({
        ...card,
        createdAt: now,
        updatedAt: now,
      }),
    ),
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
  return VERB_PERSON_KEYS.map((key) => {
    const value = String(conjugation?.[key] ?? "").trim();
    return value ? `${VERB_PERSON_LABELS[key]} ${value}` : "";
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
  return withTimestamp({
    ...card,
    tags: Array.isArray(card.tags) ? card.tags : splitTagField(card.tags),
    partOfSpeech: inferPartOfSpeech(card),
    usagePattern: String(card?.usagePattern ?? card?.verbForms?.usagePattern ?? "").trim(),
    verbForms: normalizeVerbForms(card?.verbForms),
    adjectiveForms: normalizeAdjectiveForms(card?.adjectiveForms),
  });
}

function getVerbSearchValues(card) {
  const verbForms = normalizeVerbForms(card?.verbForms);
  return [
    verbForms.auxiliary,
    verbForms.present,
    verbForms.preterite,
    verbForms.participle,
    verbForms.imperative,
    verbForms.usagePattern,
    ...VERB_PERSON_KEYS.map((key) => verbForms.conjugation[key]),
  ];
}

function mergeMissingSeedContent(state) {
  const nextState = {
    ...state,
    decks: [...state.decks],
    cards: [...state.cards],
    tombstones: {
      ...state.tombstones,
      decks: mergeTombstoneLists(
        state.tombstones.decks,
        Array.from(retiredSeedDeckIds, (id) => ({ id, updatedAt: RETIRED_SEED_UPDATED_AT })),
      ),
    },
  };
  nextState.decks = nextState.decks.filter((deck) => !retiredSeedDeckIds.has(deck.id));

  const deckTombstones = new Set(nextState.tombstones.decks.map((entry) => entry.id));
  const deckIds = new Set(nextState.decks.map((deck) => deck.id));
  seedDecks.forEach((deck) => {
    if (deckTombstones.has(deck.id) || deckIds.has(deck.id)) {
      return;
    }
    nextState.decks.push(normalizeDeckEntry(deck));
    deckIds.add(deck.id);
  });

  const liveDeckIds = new Set(nextState.decks.map((deck) => deck.id));
  nextState.cards = nextState.cards.filter((card) => liveDeckIds.has(card.deckId));
  const cardTombstones = new Set(nextState.tombstones.cards.map((entry) => entry.id));
  const cardIds = new Set(nextState.cards.map((card) => card.id));
  seedCards.forEach((card) => {
    if (cardTombstones.has(card.id) || cardIds.has(card.id) || !liveDeckIds.has(card.deckId)) {
      return;
    }
    nextState.cards.push(normalizeCardEntry(card));
    cardIds.add(card.id);
  });
  const liveCardIds = new Set(nextState.cards.map((card) => card.id));
  nextState.progress = Object.fromEntries(
    Object.entries(nextState.progress).filter(([cardId]) => liveCardIds.has(cardId)),
  );
  nextState.sessions = nextState.sessions.filter(
    (entry) => liveDeckIds.has(entry.deckId) && liveCardIds.has(entry.cardId),
  );

  nextState.preferences.selectedDeckId =
    nextState.preferences.selectedDeckId && nextState.decks.some((deck) => deck.id === nextState.preferences.selectedDeckId)
      ? nextState.preferences.selectedDeckId
      : nextState.decks[0]?.id ?? "all";

  return nextState;
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
  return mergeMissingSeedContent({
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
  });
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
  cardVerbIch: document.getElementById("cardVerbIch"),
  cardVerbDu: document.getElementById("cardVerbDu"),
  cardVerbEr: document.getElementById("cardVerbEr"),
  cardVerbWir: document.getElementById("cardVerbWir"),
  cardVerbIhr: document.getElementById("cardVerbIhr"),
  cardVerbSie: document.getElementById("cardVerbSie"),
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
    const conjugationFields = VERB_PERSON_KEYS.map((key) => [VERB_PERSON_LABELS[key], verbForms.conjugation[key]]).filter(
      ([, value]) => value,
    );
    const verbFields = [
      ["Auxiliary", verbForms.auxiliary],
      ["Simple past", verbForms.preterite],
      ["Past participle", verbForms.participle],
      ["Imperative", verbForms.imperative],
      ["Pattern", card.usagePattern || verbForms.usagePattern],
    ].filter(([, value]) => value);

    if (conjugationFields.length > 0) {
      blocks.push(`
        <article class="form-card">
          <p class="mini-label">Present tense</p>
          <div class="form-grid">
            ${conjugationFields
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

    if (verbFields.length > 0) {
      blocks.push(`
        <article class="form-card">
          <p class="mini-label">Verb details</p>
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
      intro: "Save the infinitive, full present-tense conjugation, and the key forms learners need most.",
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

  if (card.example && card.disableCloze !== true) {
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
            ? "Produce the German infinitive and check the full present-tense conjugation after reveal."
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
  const conjugation = verbForms.conjugation;
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
  elements.cardVerbIch.value = conjugation.ich;
  elements.cardVerbDu.value = conjugation.du;
  elements.cardVerbEr.value = conjugation.er;
  elements.cardVerbWir.value = conjugation.wir;
  elements.cardVerbIhr.value = conjugation.ihr;
  elements.cardVerbSie.value = conjugation.sie;
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
        ...getVerbSearchValues(card),
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
      ...getVerbSearchValues(card),
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
        verbForms.conjugation.ich,
        verbForms.conjugation.du,
        verbForms.conjugation.er,
        verbForms.conjugation.wir,
        verbForms.conjugation.ihr,
        verbForms.conjugation.sie,
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
            conjugation: {
              ich: record.verbIch,
              du: record.verbDu,
              er: record.verbEr,
              wir: record.verbWir,
              ihr: record.verbIhr,
              sie: record.verbSie,
            },
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
        ? (() => {
            const conjugation = normalizeVerbConjugation({
              ich: elements.cardVerbIch.value,
              du: elements.cardVerbDu.value,
              er: elements.cardVerbEr.value,
              wir: elements.cardVerbWir.value,
              ihr: elements.cardVerbIhr.value,
              sie: elements.cardVerbSie.value,
            });
            return normalizeVerbForms({
              auxiliary: elements.cardVerbAuxiliary.value,
              present: formatVerbConjugation(conjugation),
              conjugation,
              preterite: elements.cardVerbPreterite.value,
              participle: elements.cardVerbParticiple.value,
              imperative: elements.cardVerbImperative.value,
              usagePattern: elements.cardUsagePattern.value,
            });
          })()
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
