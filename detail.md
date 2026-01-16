# Project Documentation

## Project Structure
This document provides a detailed overview of the Views and Components in the VerbaPix project.

---

## Views (`src/views`)

### `About.vue`
- **Description**: Displays information about the VerbaPix game, its purpose, and features (Learn, Play, Collect).
- **Components Used**: `BackBtn`



### `CreateRoom.vue`
- **Description**: Form to create a new multiplayer room.
- **Features**:
  - Room name and password inputs.
  - Game mode selection (Standard, 5/4 Split, Co-op).
  - Uses `MatchmakingService` to create a room.

### `Dashboard.vue`
- **Description**: Player dashboard showing stats and progression.
- **Features**:
  - Displays Level, XP, and XP Bar.
  - Shows billing/subscription options.
  - Lists unlocked Themes, Sets, Tenses, and Achievements.

### `Home.vue`
- **Description**: The main landing page/hub of the application.
- **Features**:
  - **Header**: Navigation, User Profile, Settings, Tutorial toggle.
  - **Hero Section**: News and high-level progression stats.
  - **Game Modes**: Navigation to Standard Match, Quick Match.
  - **Explore Section**: links to Market, Cosmetics, Dashboard, Progress, Tutorial.
  - **Auth**: Google Sign-In/Out logic.
  - **State**: Connects to `auth` service and Vuex `player`/`progression` modules.



### `MultiplayerLobby.vue`
- **Description**: Handles both the lobby selection (Standard/Quick) and the active room state.
- **Features**:
  - **Standard Tab**: Panels to Create or Join text-based rooms.
  - **Lobby State**: Shows Room Code, connected players, and "Start Game" button (Host only).
  - **Quick Match Tab**: Interface for searching for opponents.

### `PlayGround.vue`
- **Description**: The core single-player / local gameplay view.
- **Features**:
  - **Game Loop**: Draggable cards, sentence building area.
  - **Components**: `GameModeSelector`, `RoundSummary`, `LevelUpModal`, `TutorialOverlay`.
  - **Logic**:
    - Validates word order (Noun, Verb, Object phrases).
    - Calculates scores and combos (e.g., Verb+Adverb).
    - Handles logic for wildcards and replacement.
    - Manages rounds and game over states.

### `ProgressScreen.vue`
- **Description**: Detailed view of player progression (Missions and Achievements).
- **Features**:
  - Displays Daily/Weekly missions with progress bars.
  - Lists achievements and unlock status.

### `Shopping.vue`
- **Description**: A unified marketplace and customization hub, combining the functionality of the former Market and Cosmetics screens.
- **Features**:
  - **Dynamic Item Loading**: Fetches shop items (Plants, Avatars, Card Backs, Borders) from `api/v1/verbapix/shop` or mock data.
  - **Unified Interface**: Tab-based navigation to filter item types.
  - **Purchase & Equip**: Check-out redirection for purchases and immediate equipment of cosmetic items.

### `QuickMatchSetup.vue`
- **Description**: Simple selection screen for Quick Match game modes.
- **Options**: Standard, 5/4 Split, Co-op.
- **Navigation**: Redirects to `WaitingRoom`.

### `Tutorial.vue`
- **Description**: Static "How to Play" guide.
- **Content**: 3-step guide (Build, Score, Win) and pro tips.

### `VerbaGame.vue`
- **Description**: The main container for the actual gameplay session (replacing PlayGround for newer architecture).
- **Features**:
  - Integrates `TableArea`, `HandComponent`, `CommunityPool`.
  - Handles Multiplayer synchronization and logic.
  - Manages round flow, scoring, and level-ups.
  - Dynamic background based on played Location cards.

### `WaitingRoom.vue`
- **Description**: Waiting screen while matchmaking searches for players.
- **Features**: Timer and cancellation logic.

---

## Components (`src/components`)

### Top Level

- **`GameModeSelector.vue`**: Modal to select between Standard, 5/4 Split, and Co-op modes.
- **`GameOver.vue`**: Modal displayed at the end of a match showing final stats and "Play Again" option.
- **`LeaderBoard.vue`**: (Empty placeholder) Intended for ranking display.
- **`LevelUpModal.vue`**: Celebratory modal shown when a player levels up, listing new unlocks.
- **`RoundSummary.vue`**: Break-down of points earned after each round (XP, combos, correct sentence bonus). Includes "Save to Vault" feature.
- **`Setting.vue`**: Global settings modal (Music, Sound, Language).
- **`TutorialOverlay.vue`**: Detailed in-game tutorial popup explaining rules.

### Cards (`src/components/cards`)

- **`CardContainer.vue`**: Wrapper for all card types. Handles the visual frame (color bars) and renders the specific card sub-component dynamically.
- **`CardSymbols.vue`**: Displays small icons on the card footer representing attributes (Singular/Plural, Tense).
- **`WildCard.vue`**: A wildcard that allows the user to select its type (components/cards/WildCard.vue).
- **`Buttons/`**:
  - `DiscardBtn.vue`: Button to discard a card from hand.
  - `ReplaceBtn.vue`: Button to replace a specific card type (e.g., Noun/Verb) in specific slots.
- **`TypeSentence/`**:
  - `Meaning.vue`: Icon indicating if sentence is Positive, Negative, or Question.
  - `Tense.vue`: (Empty placeholder) Likely for tense indicators.
- **Card Types** (Specific implementations):
  - `Noun.vue`, `Verb.vue`, `Adj.vue`, `Adverb.vue`, `Conj.vue`, `Prep.vue`, `HelpingVerb.vue`, `ExtraInformation.vue`, `TimeCard.vue`, `Location.vue`.
  - *.v_full.vue variants exist for some types (likely for detailed views).

### Game (`src/components/game`)

- **`CardComponent.vue`**: Middleware component between gameplay and specific card visuals. Handles interactions.
- **`CommunityPool.vue`**: Displays shared cards for '5/4 Split' mode using `draggable`.
- **`HandComponent.vue`**: The player's hand at the bottom of the screen. Handles dragging and discarding.
- **`TableArea.vue`**: The central drop zone for building sentences. Handles validation and scoring locally.

### Navigation (`src/components/navigation`)

- **`BackButton.vue`**: Standardized back button using `router.go(-1)`.

### Player (`src/components/player`)

- **`container.vue`**: (Empty)
- **`status.vue`**: (Empty)

### UI (`src/components/ui`)

- **`XpBar.vue`**: Reusable progress bar component for XP display.
