import { authedFetch } from './auth';

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_API_BASE_URL}`;
const GAME_PREFIX = 'verbapix';

/**
 * MatchmakingService — real GVPixel HTTP client for multiplayer rooms.
 * Mirrors the GVPixel GameController contract (api.php v1 game routes).
 */
export const MatchmakingService = {
  async getRoom(roomId) {
    const response = await authedFetch(`${BASE_URL}/game/${GAME_PREFIX}/rooms/${roomId}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error(`Room state failed: ${response.statusText}`);
    return response.json();
  },

  /**
   * Search for or create a quick match room.
   * POST /game/{prefix}/quick-match
   */
  async quickMatch() {
    const response = await authedFetch(`${BASE_URL}/game/${GAME_PREFIX}/quick-match`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error(`Quick match failed: ${response.statusText}`);
    return response.json();
  },

  /**
   * Create a custom room.
   * POST /game/{prefix}/rooms
   * Body: { name?, max_players?, is_public? }
   */
  async createRoom({ name, maxPlayers = 4, isPublic = true } = {}) {
    const response = await authedFetch(`${BASE_URL}/game/${GAME_PREFIX}/rooms`, {
      method: 'POST',
      body: JSON.stringify({ name, max_players: maxPlayers, is_public: isPublic }),
    });
    if (!response.ok) throw new Error(`Create room failed: ${response.statusText}`);
    return response.json();
  },

  /**
   * Join a room by room ID.
   * POST /game/{prefix}/rooms/{room}/join
   */
  async joinRoom(roomId) {
    const response = await authedFetch(`${BASE_URL}/game/${GAME_PREFIX}/rooms/${roomId}/join`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error(`Join room failed: ${response.statusText}`);
    return response.json();
  },

  /**
   * Join a room by invitation code.
   * POST /game/{prefix}/rooms/join-by-code
   * Body: { code }
   */
  async joinByCode(code) {
    const response = await authedFetch(`${BASE_URL}/game/${GAME_PREFIX}/rooms/join-by-code`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
    if (!response.ok) throw new Error(`Join by code failed: ${response.statusText}`);
    return response.json();
  },

  /**
   * Start a game in a room (host only).
   * POST /game/{prefix}/rooms/{room}/start
   */
  async startGame(roomId) {
    const response = await authedFetch(`${BASE_URL}/game/${GAME_PREFIX}/rooms/${roomId}/start`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error(`Start game failed: ${response.statusText}`);
    return response.json();
  },

  /**
   * Submit a turn (card selection).
   * POST /game/{prefix}/rooms/{room}/submit-turn
   * Body: { card_ids: string[] }
   */
  async submitTurn(roomId, cardIds) {
    const response = await authedFetch(`${BASE_URL}/game/${GAME_PREFIX}/rooms/${roomId}/submit-turn`, {
      method: 'POST',
      body: JSON.stringify({ card_ids: cardIds }),
    });
    if (!response.ok) throw new Error(`Submit turn failed: ${response.statusText}`);
    return response.json();
  },

};
