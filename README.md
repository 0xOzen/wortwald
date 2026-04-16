# Wortwald

Offline-friendly German flashcard app with:

- spaced repetition review
- article and cloze drills
- card types for nouns, verbs, adjectives, and phrases
- tense snapshots for verb cards
- comparative and superlative tracking for adjective cards
- local progress tracking
- built-in seed decks
- custom deck and card creation
- editable decks and cards
- daily goal tuning
- deck-level collection management
- JSON export and import
- CSV import and export for bulk card creation
- PWA install support with offline shell caching
- typed-answer grading with suggested ratings
- mistake drills and listening drills
- speaking practice with microphone recording
- portable sync packets for manual device-to-device merging
- SQLite-backed account sync with active-device management
- password change flow that signs out other devices

## Run

For the full app, including real account-based sync, run the built-in Node server:

```bash
cd /Users/0xozen/Others/Language
node server.js 4173
```

Then open `http://localhost:4173`.

If you only want the static frontend without backend auth/sync, you can still use:

```bash
python3 -m http.server 4173
```

But account login and server-backed sync will not work in that mode.

## Notes

- Progress is stored in `localStorage` under `wortwald-state-v1`.
- The built-in pronunciation button uses the browser `speechSynthesis` API when available.
- Reset progress restores the seed decks and removes custom history.
- PWA install/offline support works when the app is served from `localhost` or HTTPS, not when opened from `file://`.
- `server.js` stores accounts and synced state locally in `/Users/0xozen/Others/Language/data/wortwald.sqlite`.
- The account panel now includes password changes plus a live device/session list.
- The public HTTPS deploy at [wortwald.vercel.app](https://wortwald.vercel.app) is installable on iPad and other devices, and now includes hosted account sync backed by Neon on Vercel.
- CSV import expects columns: `deckName`, `deckLevel`, `deckFocus`, `deckDescription`, `partOfSpeech`, `term`, `translation`, `article`, `plural`, `verbAuxiliary`, `verbPresent`, `verbPreterite`, `verbParticiple`, `verbImperative`, `usagePattern`, `adjectiveComparative`, `adjectiveSuperlative`, `adjectiveUsage`, `level`, `example`, `exampleTranslation`, `note`, `tags`.
- Use [wortwald-template.csv](/Users/0xozen/Others/Language/wortwald-template.csv) as a starter file for bulk imports.
- `Merge sync` combines another device's sync packet into your current library without replacing the whole app state.
- Microphone recording uses the browser `MediaRecorder` API and requires permission from the browser.
- The local `/Users/0xozen/Others/Language/server.js` server still works for fully local development, while the hosted deploy uses Vercel Functions plus Neon for cloud sync.
