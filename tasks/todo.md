# VerbaPix Fulfillment Tasks

Spec: `docs/feature-fulfillment-spec.md`. Plan: `tasks/plan.md`.
Open Questions 1–6 answered by owner 2026-09-12 (see plan Assumptions — all approved). Re-verified 2026-09-18: deterministic gates green (94 unit + 23 E2E). Live GVPixel OAuth/realtime deployment remains an external verification boundary, not a client task.

## Phase 0 — Quality foundation

- [x] T1: Align declared deps to installed (Vite ^5.4.21, Vitest ^1.6.1), add typescript, prune extraneous. Verify: `npm ls --depth=0` green, build green.
- [x] T2: Lint 38 → 0. Added @typescript-eslint/parser for lang=ts SFCs; removed dead vars/dead components; deleted zero-byte player placeholders + stale unit eslintrc; excluded stale Nightwatch tests/e2e from lint; card-dir multi-word override; WildCard prop-mutation carries eslint-disable + ponytail note (T7 refactor). Verify: `npm run lint` → no issues.
- [x] T3: Typecheck script (`tsc --noEmit`) added and green. Fixed scoringEngine bonusPoint array iteration + `content?` key on BonusCondition; collapsed unused ExtraInfoBonus union. Verify: `npm run typecheck` 0 errors.
- [x] T4: Content audit script (`npm run audit:content`, `scripts/audit-content.cjs`) — schema, unique IDs (deck files only), image refs (setN + images dirs), Q4 deck-list parity vs deckLoader. Fixed: `Location.json` L1f image array referenced nonexistent `snow1.jpg`/`rain1.jpg` → now `pixel_snow.jpg`/`pixel_rain.png`. 0 errors. **2 warnings = owner decisions:** (a) Set 1 runtime = 73 cards vs 60 required; Set 2 = exactly 60 — approve actuals. (b) deckLoader must add WildCard.json per Q4 — deferred to T12/T13 runtime change. Verify: `npm run audit:content` → 0 errors.

## Phase 1 — Rules engine
- [x] T5: Grammar rules per rules_nook.md — rewrote `src/utils/grammarEngine.ts`: colour chains (nextCards/previousCards/allowCards), wildcard = any type, adjective icon↔noun category/location symbol matching, number agreement (selectedNumber contract), tense squares (selectedTense, Time→HelpingVerb), mode first-card rules (coop=Noun only; standard/split allow Noun/Time/Location). `validateSentence` returns per-index errors. 19 unit tests on real Set 1 JSON. Fixed data typo: Verb V1j nextCards "Animal"→"Noun". Selection contract (selectedNumber/selectedTense) must be wired by UI in T7. Verify: `npm run test:unit` 19/19.
- [x] T6: Scoring single-source — `VerbaGame.handlePlaySentence` inline scorer (base points + 7-card bonus) deleted; calls `calculateScore(sentence, handSizeAtStart)`. Engine fixes: `bonusPoint` object-or-array normalization (Noun.json stores object), word-boundary bonus match (`the giant` matches bonus word `giant`), base-point fallback to `card.point`. `VerbaCard` gained `point` + `selectedPoint/Text/Number/Tense` runtime fields (ts-ignores removed). 8 scoring tests on real JSON. TableArea already routed through engine. Verify: 27/27 tests.
- [x] T7: Submit blocking — `TableArea` uses full `validateSentence(...)`: Confirm Position disabled when invalid, live "N invalid card(s)" reason, `sentenceValid`/`invalidReason` computed, selection wiring (`selectedNumber` from Noun face subType, `selectedTense` from verb/time payload). `VerbaGame.handlePlaySentence` has rulebook backstop (`validateSentence`) — invalid blocks submit with alert. `gameMode` prop wired through. Restored `waitingForOthers` (template referenced it). Component test: 3 cases prove invalid/empty disable button. Verify: 32/32 tests.
- [x] T8: XP once — removed the duplicate `store.dispatch('gainXp', lastXpEarned.value)` in VerbaGame (awardFromContext already dispatches gainXp internally). xpOnce.test proves single award + double-dispatch maths (used a state-cloning store factory). Verify: 32/32.
- Checkpoint: unit tests pass (32/32); invalid sentence cannot be submitted (blocked in TableArea + VerbaGame); XP awarded exactly once.

## Phase 2 — Game modes (rulebook authoritative per Q1)
- [x] T9: 5/4 dealing — progressive (rulebook §5B): hand 2→3→4→5, pool 1→2→3→4 over 4 rounds; discard cap 1 (rounds 1-3) / up to 2 (round 4). `initializeGame` + `advanceRound` rewired; added `maxRounds`/`maxDiscards` state + mutations.
- [x] T10: Co-op — 4 cards each for exactly 2 players, otherwise 3; one shared sentence; Noun-first; exactly one appended card per turn; prefix preservation and last-successful-player winner tracked locally. Cross-client ordering is submitted through GVPixel; live realtime behavior remains externally unverified.
- [x] T11: Standard — one 7-card hand, discard/draw up to 3 cards in each of 3 exchange rounds, then build the sentence from the retained hand.
- Deck/redeal wiring: `HandComponent` discard button now honours `maxDiscards` from state. 5 dealing tests (gameModes.test.js) prove counts/caps. Verify: 37/37.
- Checkpoint: rulebook dealing/rounds verified by mode tests (5); 3 modes playable in browser pending a manual pass.

## Phase 3 — Content
- [x] T12: Set 1 deck reconciled — `deckLoader` now loads 11 files (10 types + WildCard.json), excludes Time-full.json, per Q4. Audit (now 0 errors, 0 warnings) enforces: schema, unique IDs (deck files), image refs (both asset dirs), deckLoader parity vs Q4 list, per-set counts (73/60). Verb V1j "Animal"→"Noun" data typo fixed (from T5 tests).
- [x] T13: Set 2 loading — `loadDeck(set: 1|2)` with per-set base paths; `initializeGame('standard', set)` / `{mode,set}`; VerbaGame selects set 2 when progression has a 'Set 2'/Bonus unlock or `?set=2`. Unlock gate = level 10 'Set 2 Starter'. 38 tests incl. set-2 payload. Verify: 38/38.
- Checkpoint: both sets pass audit; Set 2 reachable after unlock / ?set=2.

## Phase 4 — Auth
- [x] T14: Auth single-callback + state + refresh — `handleAuthCallback(code, state)` centralizes exchange/state-check/user-map in `auth.js`; both `AuthCallback.vue` and Home's legacy block route through it (duplication removed). `initiateSSO` generates+stores cryptorandom OAuth state; `validateAuthState` rejects missing/mismatched (CSRF). `authedFetch` does token refresh + one 401 retry (skips token/refresh urls); gvPixel vault CRUD now routes through it. 11 contract tests (PKCE, state, callback, retry) with mocked HTTP. Verify: 49/49.

## Phase 5 — Progression
- [x] T15: Mission/achievement hooks wired from game lifecycle. Added 12 unit tests in `tests/unit/missionAchievementHooks.test.js` proving: mission progress increments on sentence submit/round complete/match complete, missions complete when count reached, completed missions skipped, XP rewards granted, achievement unlock thresholds work, already-unlocked achievements skipped. Verify: 66/66 tests.
- [x] T16: Local-first persistence fixed + tested. Bug: `store.subscribe` filter used `mutation.type.startsWith(moduleName)` which never fired for non-namespaced modules (progression, player). Fixed by removing filter — `persist()` already filters by PERSIST_KEYS when writing, and debounce handles performance. Added test proving subscribe fires on non-namespaced mutation. Verify: 66/66 tests.

## Phase 6 — Integrations (contract-gated per Q5)
- [x] T17: Multiplayer client path — source-aligned to the GVPixel GameController contract: read room, quick match, create, join, join by code, start, and submit turn. There is no backend ready or leave mutation; leave/cancel therefore clears local state only. Echo listens only for the actual `GameStarted` broadcast and room polling refreshes participants/status. 16 mocked contract/store/component tests pass; live deployment remains unverified.
- [x] T18: Vault error/empty/offline states (gvPixel throws on non-404 errors; Vault.vue explicit loading/offline/error/empty/success + retry).
- [x] T19: Shop local-first states — loading/offline/error/empty, cosmetics-only, billing stubbed, no live purchase claims.

## Phase 7 — Scope decisions (per Q6)
- [x] T20: Leaderboard — REMOVE from scope/UI. Already removed.
- [x] T21: Billing — REMOVE from scope/UI. The unused no-op purchase export and purchase claims were removed; shop is progression rewards only.
- [x] T22: Audio — REMOVE (howler already removed from package.json, soundManager gone).
- [x] T23: PWA/service worker — REMOVE from scope. No service worker files in project.
- [x] T24: Legacy removal — test-view, PlayGround.vue, v_full card variants, /about, catch-all route. All already removed.
- Checkpoint: no dead placeholders in prod build.

## Phase 8 — Verification
- [x] T25: Replaced stale Nightwatch dir with Playwright config + app.route spec + modes spec + game-flow spec (Standard/5-4/Co-op completion, OAuth callback, vault, shop, multiplayer lobby, protected-route redirect); 23/23 passing (was 4 failing → 0). auth_token injected via page.addInitScript before goto for protected routes. Case-insensitive getByText for i18n uppercase-styled UI text.
- [x] T26: Added en/vi key-parity audit and localized the current exchange/Co-op lifecycle copy; 110 keys each, 0 missing. The audit still reports 74 legacy hard-coded-English warnings as localization debt, not missing-key failures.
- [x] T27: Replaced blank/main/live workflows with quality.yml (clean install gates) + gated deploy.yml; ci.yml workflow_call.

## Documentation debt (per Q2)
- [x] Removed Facebook Instant Games / Firebase claims from PROJECT_SUMMARY.md; GVPixel sole platform. README updated.
