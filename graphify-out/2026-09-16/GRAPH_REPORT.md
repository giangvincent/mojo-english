# Graph Report - mojo-english  (2026-09-15)

## Corpus Check
- 136 files · ~1,124,028 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 562 nodes · 738 edges · 38 communities (36 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.76)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ba552d68`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CardComponent.vue
- progression/actions.js
- devDependencies
- auth.js
- Shopping.vue
- dependencies
- gvPixel.js
- Setting.vue
- verba.ts
- ProgressScreen.vue
- package.json
- compilerOptions
- types.ts
- Vault.vue
- openHomepageClass.js
- Vault.vue
- audit-i18n.cjs
- echo.js
- example.spec.js
- Views (`src/views`)
- rules_nook.md
- Implementation Plan: VerbaPix Fulfillment
- Project setup
- VerbaPix Fulfillment Tasks
- Vault.vue

## God Nodes (most connected - your core abstractions)
1. `scripts` - 15 edges
2. `emit` - 15 edges
3. `Views (`src/views`)` - 13 edges
4. `compilerOptions` - 11 edges
5. `VerbaPix Fulfillment Tasks` - 11 edges
6. `authedFetch()` - 9 edges
7. `validateConnection()` - 9 edges
8. `handleAuthCallback()` - 8 edges
9. `validateSentence()` - 8 edges
10. `Implementation Plan: VerbaPix Fulfillment` - 8 edges

## Surprising Connections (you probably didn't know these)
- `setup()` --calls--> `emit`  [INFERRED]
  src/components/GameModeSelector.vue → src/components/cards/WildCard.vue
- `setup()` --calls--> `emit`  [INFERRED]
  src/components/cards/Adj.vue → src/components/cards/WildCard.vue
- `setup()` --calls--> `emit`  [INFERRED]
  src/components/cards/Adverb.vue → src/components/cards/WildCard.vue
- `setup()` --calls--> `emit`  [INFERRED]
  src/components/cards/Conj.vue → src/components/cards/WildCard.vue
- `setup()` --calls--> `emit`  [INFERRED]
  src/components/cards/ExtraInformation.vue → src/components/cards/WildCard.vue

## Import Cycles
- None detected.

## Communities (38 total, 2 thin omitted)

### Community 1 - "CardComponent.vue"
Cohesion: 0.06
Nodes (47): @/components/cards/Adj.vue, setup(), @/components/cards/Adverb.vue, setup(), @/components/cards/Buttons/ReplaceBtn.vue, setup(), @/components/cards/Conj.vue, setup() (+39 more)

### Community 2 - "progression/actions.js"
Cohesion: 0.07
Nodes (24): @/components/GameOver.vue, @/components/LevelUpModal.vue, @/components/TutorialOverlay.vue, dailyMissionTemplates, generateDailyMissions(), generateWeeklyMissions(), seasonalEventTemplates, shuffleWithSeed() (+16 more)

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (39): autoprefixer, @babel/core, @babel/preset-env, eslint, @eslint/js, eslint-plugin-vue, jsdom, devDependencies (+31 more)

### Community 4 - "auth.js"
Cohesion: 0.10
Nodes (24): @/components/GameModeSelector.vue, setup(), base64urlencode(), checkAuth(), dec2hex(), exchangeAuthCode(), generateCodeChallenge(), generateCodeVerifier() (+16 more)

### Community 5 - "Shopping.vue"
Cohesion: 0.21
Nodes (7): mockShopItems, getShopItems(), fetchItems(), isEquippable(), isEquipped(), isOfflineError(), mounted()

### Community 6 - "dependencies"
Cohesion: 0.09
Nodes (23): core-js, html2canvas, laravel-echo, dependencies, core-js, html2canvas, laravel-echo, pusher-js (+15 more)

### Community 7 - "gvPixel.js"
Cohesion: 0.41
Nodes (11): authedFetch(), deleteVaultItem(), getAuthHeader(), getLocalQueue(), getPendingSyncCount(), getVaultItems(), getVaultStats(), saveLocalQueue() (+3 more)

### Community 8 - "Setting.vue"
Cohesion: 0.06
Nodes (11): createPlayerData(), mountVueApp(), resolveLocale(), routes, PERSIST_KEYS, { persist, restore }, store, createLocalPersist() (+3 more)

### Community 10 - "verba.ts"
Cohesion: 0.16
Nodes (19): adjectiveFitsNoun(), chainAllows(), firstCardAllowed(), GrammarMode, isWild(), numberAgrees(), selectedNumber(), selectedTense() (+11 more)

### Community 11 - "ProgressScreen.vue"
Cohesion: 0.22
Nodes (7): getAuthToken(), getHeaders(), MatchmakingService, createRoom(), created(), startSearch(), startTimer()

### Community 12 - "package.json"
Cohesion: 0.08
Nodes (23): fsevents, description, name, optionalDependencies, fsevents, private, scripts, audit:all (+15 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): dist, DOM, ESNext, node_modules, tests, compilerOptions, baseUrl, esModuleInterop (+9 more)

### Community 15 - "types.ts"
Cohesion: 0.23
Nodes (11): cards, ActionCard, ActionChoice, Card, Choice, GrammaticalNumber, LocationCard, LocationType (+3 more)

### Community 16 - "Vault.vue"
Cohesion: 0.15
Nodes (10): ASSETS, CONTENTS, DECK_FILES, errors, EXCLUDED, fs, loaderSrc, path (+2 more)

### Community 18 - "openHomepageClass.js"
Cohesion: 0.12
Nodes (4): @/components/RoundSummary.vue, fillWidth, props, achievements

### Community 19 - "Vault.vue"
Cohesion: 0.33
Nodes (7): cancelEdit(), deleteItem(), fetchData(), isOfflineError(), mounted(), saveNote(), updatePendingSync()

### Community 20 - "audit-i18n.cjs"
Cohesion: 0.38
Nodes (6): collectKeys(), langPath, loadLang(), main(), path, root

### Community 33 - "Views (`src/views`)"
Cohesion: 0.09
Nodes (22): `About.vue`, Cards (`src/components/cards`), Components (`src/components`), `CreateRoom.vue`, `Dashboard.vue`, Game (`src/components/game`), `Home.vue`, `MultiplayerLobby.vue` (+14 more)

### Community 34 - "rules_nook.md"
Cohesion: 0.15
Nodes (11): 1. High-Level Overview, 2. Technical Architecture, 3. Folder Structure, 4. Key Features, VerbaPix Project Summary, **1. Introduction & Objective**, **2. Card Types & Identification**, **3. Core Mechanics: Matching Rules** (+3 more)

### Community 42 - "Implementation Plan: VerbaPix Fulfillment"
Cohesion: 0.22
Nodes (8): Architecture decisions, Assumptions (flag if wrong — answers to spec Open Questions 1–6 gate marked tasks), Definition of done (project), Dependency graph (build bottom-up), Implementation Plan: VerbaPix Fulfillment, Parallelization, Phases and checkpoints, Risks

### Community 44 - "Project setup"
Cohesion: 0.25
Nodes (7): Compiles and hot-reloads for development, Compiles and minifies for production, Customize configuration, Lints and fixes files, Project setup, Run your unit tests, VerbaPix – Cards, Grammar, Fun

### Community 45 - "VerbaPix Fulfillment Tasks"
Cohesion: 0.17
Nodes (11): Documentation debt (per Q2), Phase 0 — Quality foundation, Phase 1 — Rules engine, Phase 2 — Game modes (rulebook authoritative per Q1), Phase 3 — Content, Phase 4 — Auth, Phase 5 — Progression, Phase 6 — Integrations (contract-gated per Q5) (+3 more)

### Community 46 - "Vault.vue"
Cohesion: 0.07
Nodes (27): setup(), advanceRound(), initializeGame(), maxDiscardsFor(), saveSentenceToVault(), AdjectiveAdditional, AdjectiveContent, AdverbContentGroup (+19 more)

## Knowledge Gaps
- **189 isolated node(s):** `name`, `version`, `private`, `type`, `description` (+184 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@/components/TutorialOverlay.vue` connect `progression/actions.js` to `auth.js`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `emit` connect `CardComponent.vue` to `auth.js`, `Vault.vue`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `saveSentenceToVault()` connect `Vault.vue` to `gvPixel.js`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `emit` (e.g. with `setup()` and `setup()`) actually correct?**
  _`emit` has 13 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _189 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CardComponent.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.05649350649350649 - nodes in this community are weakly interconnected._
- **Should `progression/actions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06871035940803383 - nodes in this community are weakly interconnected._