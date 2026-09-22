# Graph Report - mojo-english  (2026-09-14)

## Corpus Check
- 149 files · ~1,129,492 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 637 nodes · 892 edges · 47 communities (44 shown, 3 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ba552d68`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PlayGround.vue
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
- echo.js
- example.spec.js
- Views (`src/views`)
- rules_nook.md
- Implementation Plan: VerbaPix Fulfillment
- Project setup
- VerbaPix Fulfillment Tasks
- Vault.vue

## God Nodes (most connected - your core abstractions)
1. `emit` - 15 edges
2. `Views (`src/views`)` - 13 edges
3. `error()` - 11 edges
4. `compilerOptions` - 11 edges
5. `VerbaPix Fulfillment Tasks` - 11 edges
6. `scripts` - 10 edges
7. `authedFetch()` - 9 edges
8. `validateConnection()` - 9 edges
9. `@/utils/unlocks` - 9 edges
10. `submitSentence()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `setup()` --calls--> `emit`  [INFERRED]
  src/components/GameModeSelector.vue → src/components/cards/WildCard.vue
- `handleSignOut()` --indirect_call--> `error()`  [INFERRED]
  src/views/Home.vue → src/registerServiceWorker.js
- `setup()` --calls--> `emit`  [INFERRED]
  src/components/cards/Adj.vue → src/components/cards/WildCard.vue
- `setup()` --calls--> `emit`  [INFERRED]
  src/components/cards/Adverb.vue → src/components/cards/WildCard.vue
- `setup()` --calls--> `emit`  [INFERRED]
  src/components/cards/Conj.vue → src/components/cards/WildCard.vue

## Import Cycles
- None detected.

## Communities (47 total, 3 thin omitted)

### Community 0 - "PlayGround.vue"
Cohesion: 0.06
Nodes (51): capitalizeFirstLetter(), shuffleArray(), applyPvpEffect(), PVP_EFFECTS, SoundManager, addPoint(), areTimeSymbolsCompatible(), autoArrangeOnce() (+43 more)

### Community 1 - "CardComponent.vue"
Cohesion: 0.06
Nodes (47): @/components/cards/Adj.vue, setup(), @/components/cards/Adverb.vue, setup(), @/components/cards/Buttons/ReplaceBtn.vue, setup(), @/components/cards/Conj.vue, setup() (+39 more)

### Community 2 - "progression/actions.js"
Cohesion: 0.09
Nodes (16): achievements, dailyMissionTemplates, generateDailyMissions(), generateWeeklyMissions(), seasonalEventTemplates, shuffleWithSeed(), weeklyMissionTemplates, checkAchievements() (+8 more)

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (39): autoprefixer, @babel/core, @babel/preset-env, eslint, @eslint/js, eslint-plugin-vue, jsdom, devDependencies (+31 more)

### Community 4 - "auth.js"
Cohesion: 0.10
Nodes (26): @/components/GameModeSelector.vue, setup(), @/components/TutorialOverlay.vue, base64urlencode(), checkAuth(), dec2hex(), exchangeAuthCode(), generateCodeChallenge() (+18 more)

### Community 5 - "Shopping.vue"
Cohesion: 0.11
Nodes (16): getAuthToken(), getHeaders(), MatchmakingService, mockShopItems, buyItem(), getShopItems(), createRoom(), buy() (+8 more)

### Community 6 - "dependencies"
Cohesion: 0.07
Nodes (27): core-js, howler, html2canvas, laravel-echo, dependencies, core-js, howler, html2canvas (+19 more)

### Community 7 - "gvPixel.js"
Cohesion: 0.19
Nodes (17): error(), authedFetch(), deleteVaultItem(), getAuthHeader(), getLocalQueue(), getPendingSyncCount(), getVaultItems(), getVaultStats() (+9 more)

### Community 8 - "Setting.vue"
Cohesion: 0.09
Nodes (4): createPlayerData(), mountVueApp(), resolveLocale(), routes

### Community 10 - "verba.ts"
Cohesion: 0.08
Nodes (30): setup(), @/components/GameOver.vue, @/components/LevelUpModal.vue, adjectiveFitsNoun(), chainAllows(), firstCardAllowed(), GrammarMode, isWild() (+22 more)

### Community 11 - "ProgressScreen.vue"
Cohesion: 0.17
Nodes (3): @/components/RoundSummary.vue, fillWidth, props

### Community 12 - "package.json"
Cohesion: 0.11
Nodes (18): fsevents, description, name, optionalDependencies, fsevents, private, scripts, audit:content (+10 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): dist, DOM, ESNext, node_modules, tests, compilerOptions, baseUrl, esModuleInterop (+9 more)

### Community 15 - "types.ts"
Cohesion: 0.23
Nodes (11): cards, ActionCard, ActionChoice, Card, Choice, GrammaticalNumber, LocationCard, LocationType (+3 more)

### Community 16 - "Vault.vue"
Cohesion: 0.15
Nodes (10): ASSETS, CONTENTS, DECK_FILES, errors, EXCLUDED, fs, loaderSrc, path (+2 more)

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
Cohesion: 0.08
Nodes (23): advanceRound(), initializeGame(), maxDiscardsFor(), AdjectiveAdditional, AdjectiveContent, AdverbContentGroup, BonusCondition, CardCondition (+15 more)

## Knowledge Gaps
- **181 isolated node(s):** `name`, `version`, `private`, `type`, `description` (+176 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@/components/TutorialOverlay.vue` connect `auth.js` to `PlayGround.vue`, `verba.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `@/components/GameModeSelector.vue` connect `auth.js` to `PlayGround.vue`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `error()` connect `gvPixel.js` to `Setting.vue`, `auth.js`, `Shopping.vue`, `Vault.vue`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `emit` (e.g. with `setup()` and `setup()`) actually correct?**
  _`emit` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 10 inferred relationships involving `error()` (e.g. with `deleteVaultItem()` and `getVaultItems()`) actually correct?**
  _`error()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _181 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PlayGround.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.05970149253731343 - nodes in this community are weakly interconnected._