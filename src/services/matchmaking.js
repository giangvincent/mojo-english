// Matchmaking Service Interface (Mock)
// This file defines the API interactions for Quick Match and Room creation.

import store from '@/store'; // Direct access to store for mocking state

export const MatchmakingService = {
  /**
   * Starts searching for a Quick Match.
   * @param {string} gameMode - e.g., 'standard', 'topic-x'
   * @returns {Promise<{roomId: string}>} - Resolves when a match is found (simulated)
   */
  joinQuickMatch(gameMode) {
    console.log(`[Matchmaking] Searching for ${gameMode} match...`);

    // Simulate API delay and waiting for players
    return new Promise((resolve, reject) => {
      // 10% chance of failure/timeout simulated
      if (Math.random() > 0.95) {
        setTimeout(() => {
          reject(new Error("Matchmaking timed out"));
        }, 5000);
        return;
      }

      // Simulate finding a match after 3 seconds
      setTimeout(() => {
        const roomId = `quick-${Date.now()}`;
        console.log(`[Matchmaking] Match found! Room: ${roomId}`);
        resolve({ roomId });
      }, 3000);
    });
  },

  /**
   * Creates a custom Standard Match room.
   * @param {Object} options - { name, password, maxPlayers, rounds }
   * @returns {Promise<{roomId: string}>}
   */
  createRoom(options) {
    console.log(`[Matchmaking] Creating room with options:`, options);
    return new Promise((resolve) => {
      setTimeout(() => {
        const roomId = `room-${Date.now()}`;
        // In a real app, this would return the room ID from the server.
        // For now, we update the local store to act as the Host.
        resolve({ roomId });
      }, 500);
    });
  },

  /**
   * Joins an existing room by ID.
   * @param {string} roomId
   */
  joinRoom(roomId) {
    console.log(`[Matchmaking] Joining room ${roomId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ roomId });
      }, 500);
    });
  }
};
