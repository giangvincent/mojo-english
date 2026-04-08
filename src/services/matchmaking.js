import { getAuthToken } from './auth';

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_API_BASE_URL}`;
const GAME_PREFIX = 'verbapix';

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const MatchmakingService = {
  /**
   * Starts searching for a Quick Match.
   * @param {string} gameMode - e.g., 'standard', 'topic-x'
   * @returns {Promise<{roomId: string}>}
   */
  async joinQuickMatch(gameMode) {
    console.log(`[Matchmaking] Searching for ${gameMode} match...`);
    const response = await fetch(`${BASE_URL}/game/${GAME_PREFIX}/quick-match`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ mode: gameMode })
    });

    if (!response.ok) {
      throw new Error(`Quick match failed: ${response.statusText}`);
    }
    return await response.json();
  },

  /**
   * Creates a custom Standard Match room.
   * @param {Object} options - { name, password, maxPlayers, rounds }
   * @returns {Promise<{roomId: string}>}
   */
  async createRoom(options) {
    console.log(`[Matchmaking] Creating room with options:`, options);
    const response = await fetch(`${BASE_URL}/game/${GAME_PREFIX}/rooms`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        mode: 'standard', // Default or derived from options
        is_private: !!options.password,
        ...options
      })
    });

    if (!response.ok) {
      throw new Error(`Create room failed: ${response.statusText}`);
    }
    return await response.json();
  },

  /**
   * Joins an existing room by ID.
   * @param {string} roomId
   */
  async joinRoom(roomId) {
    console.log(`[Matchmaking] Joining room ${roomId}`);
    const response = await fetch(`${BASE_URL}/game/${GAME_PREFIX}/rooms/${roomId}/join`, {
      method: 'POST',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Join room failed: ${response.statusText}`);
    }
    return await response.json();
  }
};
