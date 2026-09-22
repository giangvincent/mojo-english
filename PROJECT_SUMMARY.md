# VerbaPix Project Summary

## 1. High-Level Overview

**VerbaPix** is a web-based language learning game designed to be played as a **GVPixel Instant Game**. It gamifies the process of learning English grammar by combining card game mechanics with sentence construction challenges.

Players collect and arrange "word cards" to form grammatically correct sentences. The game features multiple modes and a progression-based customization system while integrating with the GVPixel platform for authentication and persistence.

**Core Concept:** "Cards, Grammar, Fun".

For detailed game rules and mechanics, please refer to [Game Rules](rules_nook.md).

## 2. Technical Architecture

The application is a **Single Page Application (SPA)** built with modern web technologies:

*   **Frontend Framework:** [Vue.js 3](https://vuejs.org/) (using Options API and Composition API).
*   **Build Tool:** [Vite](https://vitejs.dev/).
*   **State Management:** [Vuex 4](https://vuex.vuejs.org/).
    *   Modularized into `player` (profile), `playing` (game session state), and `progression` (long-term stats).
*   **Styling:**
    *   [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
    *   `Animate.css` for animations.
    *   Pixel-art themed UI components.
*   **Language:** JavaScript, with [TypeScript](https://www.typescriptlang.org/) used for core game logic (`src/core`).
*   **Platform Integration:**
    *   **GVPixel OAuth/API**: Handles authentication, player data, and persistence via vault.
*   **Internationalization:** `vue-i18n`.
*   **Key Libraries:**
    *   `vuedraggable`: For the core drag-and-drop card interface.
    *   `vue3-touch-events`: For mobile touch interaction.

## 3. Folder Structure

The source code is organized in the `src` directory:

*   **`src/assets/`**: Static resources like images and CSS files (`tailwind.css`, `animate.css`).
*   **`src/components/`**: Reusable Vue components.
    *   `cards/`: Components related to the playing cards.
    *   `ui/`: Generic UI elements.
    *   Specific feature components like `GameModeSelector`, `LevelUpModal`.
*   **`src/core/`**: Pure logic and type definitions, written in TypeScript.
    *   `cards.ts`: Definitions of card data and properties.
    *   `types.ts`: TypeScript interfaces for game entities.
*   **`src/router/`**: Vue Router configuration.
    *   `index.js`: Defines the routes (`/`, `/play`, `/shopping`, etc.) and guards.
*   **`src/services/`**: Abstractions for external APIs.
    *   `auth.js`: OAuth/PKCE authentication flow.
    *   `gvPixel.js`: GVPixel vault CRUD operations.
*   **`src/store/`**: Vuex store configuration.
    *   `index.js`: Store entry point.
    *   `progression/`, `playing/`, `player/`, `prefs/`, `multiplayer/`: State modules.
*   **`src/views/`**: Main page components acting as route targets.
    *   `Home.vue`, `VerbaGame.vue`, `Shopping.vue`, `Tutorial.vue`, etc.
*   **`src/utils/`**: Helper functions for grammar, scoring, XP, unlocks, and card helpers.
*   **`src/main.js`**: Application entry point. Initializes Vue, Router, Store, i18n, and handles GVPixel initialization.

## 4. Key Features

*   **Card-Based Gameplay (`VerbaGame.vue`)**:
    *   Players receive a hand of cards (Nouns, Verbs, Adjectives, etc.).
    *   Drag-and-drop interface to arrange cards into valid sentences (Noun Phrase + Verb Phrase + Object Phrase).
    *   Real-time validation of grammar rules.
*   **Game Modes**:
    *   **Standard**: Classic 7-card hand.
    *   **5/4 Split**: A strategic mode with shared community cards.
    *   **Co-op**: Cooperative play mode.
*   **Progression System**:
    *   Experience (XP) tracking.
    *   Level-up system with unlocks (`LevelUpModal`).
    *   Persistent player stats via GVPixel vault.
*   **Progression Rewards**:
    *   `Shopping.vue`: Customization hub for viewing unlocked items and equipping cosmetics; billing is not part of this release.
*   **Social Integration**:
    *   Simulated multiplayer lobby; real GVPixel HTTP matchmaking is wired but not exercised against a live backend.
*   **Tutorials**: Interactive tutorial system (`Tutorial.vue`, `TutorialOverlay.vue`) to guide new players.
*   **Localization**: Multi-language support to make the game accessible to a global audience.
