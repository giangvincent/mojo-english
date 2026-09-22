# Implementation Plan: VerbaPix Fulfillment

Spec: `docs/feature-fulfillment-spec.md` (approved inventory + 13 success criteria).
Task details: `tasks/todo.md`.

## Assumptions (flag if wrong — answers to spec Open Questions 1–6 gate marked tasks)

1. `rules_nook.md` is authoritative over current code (Q1). Gated: T9, T10, T11.
2. GVPixel OAuth/API is the sole platform; FB Instant Game story retired (Q2). Gated: T14, T17.
3. `VerbaGame.vue` is the only production game view; `PlayGround.vue` retired (Q3). Gated: T24.
4. Set 1 runtime deck = the 10 files currently loaded; WildCard/Time-full disposition decided by owner (Q4). Gated: T12, T13.
5. No backend schema changes; client queues + local-first persistence until contracts exist (Q5). Gated: T16, T17, T19.
6. Leaderboard, billing, audio, PWA: implement-minimum or remove — owner decides per item (Q6). Gated: T20–T23.

## Architecture decisions

- One rules engine: `src/utils/grammarEngine.ts` validates, `src/utils/scoringEngine.ts` scores. All callers (VerbaGame, TableArea, store) route through them. Delete duplicated inline logic, don't reconcile it.
- One XP path: `progression/awardFromContext` only. Remove second `gainXp` call.
- One multiplayer state path: Vuex `multiplayer` module becomes the real source (HTTP + Echo). Delete lobby-side mock fabrication.
- Deck loading: `deckLoader.ts` takes a set parameter; Set 2 gated by progression unlock, not hard-coded.
- Persistence: local-first (localStorage queue) for progression, prefs, vault; server sync when contracts exist. No new backend deps.
- Legacy: `PlayGround.vue`, `test-view/`, empty placeholders removed from production only after owner decision (T24).

## Dependency graph (build bottom-up)

```
T1 deps align ─┬─> T3 typecheck ──────────────────────────────┐
               │                                              │
T2 lint fix ───┴─> T4 content audit script ──> T12/T13 (Set 2, wildcards)
                                                          │
T5 grammar rules ──> T6 scoring single-source ──> T7 submit blocking
        │                                        │
        └──────────> T8 XP once ─────────────────┤
                                                  ▼
T9 5/4 dealing ──> T10 co-op ──> T11 standard bonus ──> Phase 2 done
                                                          │
T14 auth state/single-callback ──────────────────────────┤
T15 mission/achievement hooks ──> T16 persistence        │
T17 multiplayer real path (needs Q5 contracts)           │
T18 vault error states ──────────────────────────────────┤
T19 shop un-mock (needs Q5)                              │
                                                          ▼
T20–T23 scope items (owner decision each) ──> T24 legacy removal
                                                          │
T25 E2E (after T5–T11, T14)  T26 i18n ──> T27 CI gates ──> DONE
```

## Phases and checkpoints

| Phase | Tasks | Checkpoint (must pass to advance) |
|---|---|---|
| 0 Quality foundation | T1–T4 | `npm ls` green, lint 0, `tsc --noEmit` green, content audit report accepted |
| 1 Rules engine | T5–T8 | All unit tests pass; invalid sentence cannot be submitted in all 3 modes; XP awarded exactly once |
| 2 Game modes | T9–T11 | Rulebook dealing/rounds verified by mode tests; 3 modes playable to completion in browser |
| 3 Content | T12–T13 | Both sets pass schema/ID/image audit; Set 2 reachable after unlock |
| 4 Auth | T14 | State protection + single callback + refresh/retry covered by contract tests (mocked HTTP) |
| 5 Progression | T15–T16 | Missions/achievements advance from normal play; state survives reload |
| 6 Integrations | T17, T18, T19 | Multiplayer create/join/match/cancel on real contracts; vault + shop show all 5 states (loading/success/empty/offline/error) |
| 7 Scope decisions | T20–T24 | Each item implemented-or-removed; no dead placeholders in prod build |
| 8 Verification | T25–T27 | Full gate suite green from clean install in CI; deploy workflows gated |

## Parallelization

- Independent slices, safe in parallel after Phase 1: T14 / T15 / T18 / T26.
- Sequential chains: T5→T6→T7→T8; T9→T10→T11; T15→T16; T12→T13.
- Needs shared contract first: T17 and T19 both wait on Q5 API schemas — define contract mock first, then parallelize.

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| T1 dep alignment breaks Vite/Vitest APIs | High | Align to installed minor (Vite 5, Vitest 1) or full reinstall in one task; build+tests as gate |
| Grammar rules (T5) over-restrict real content | Med | Drive rules from audited card JSON (T4) not guesses; content audit lists violations first |
| Q5 contracts never arrive | High | Client work (T18, T19-unmock, T16-local) proceeds against frozen mock contracts; T17 stays gated |
| Rulebook vs code divergence larger than audited | Med | T9/T10 read `rules_nook.md` sections first; any new conflict → update spec, not code | | T9/T11 game lifecycle (exchange round progression) | Med | Fixed `canBuildSentence` comparison (changed `>=` to `>`) and removed round-advance guard in `handleAdvancePreparation`; modes.spec.js + game-flow.spec.js E2E verify 3 (standard)/4 (5/4) exchange rounds precede sentence builder | | T17 multiplayer service wiring | Low | WaitingRoom.vue dispatches `multiplayer/quickMatch` → `MatchmakingService.quickMatch()`; MultiplayerLobby.vue dispatches `joinRoom`/`joinByCode` via Vuex — no client-side guest fabrication | | Progression `matchesWon` hook | Low | Already wired in `checkMissionProgress`; VerbaGame passes `matchesWon: wonThisRound ? 1 : 0` to `onSentenceSubmit` |
| Dirty worktree (auth callback) conflicts with T14 | Low | Commit/keep current dirty state before T14; T14 subsumes it |
| Lint 38→0 churn touches game files mid-phase | Low | T2 lands before Phase 1; later tasks keep lint green as standing gate |

## Definition of done (project)

All 13 success criteria in the spec pass; `tasks/todo.md` fully checked; CI green from clean install; spec updated to reflect final scope (implemented vs removed items).
