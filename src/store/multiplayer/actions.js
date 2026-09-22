import { MatchmakingService } from '@/services/matchmaking';

export default {
  async createRoom({ commit }, { name, maxPlayers, isPublic } = {}) {
    commit('setConnectionStatus', 'connecting');
    try {
      const room = await MatchmakingService.createRoom({ name, maxPlayers, isPublic });
      commit('setRoomId', room.room.id);
      commit('setRoomCode', room.room.code);
      commit('setIsHost', true);
      commit('setGameStatus', 'lobby');
      commit('setPlayers', room.room.participants.map(p => ({
        id: p.user_id,
        name: p.name,
        ready: p.status === 'ready',
        isHost: p.user_id === room.room.host_id,
        photo: p.photo || null,
      })));
      commit('setConnectionStatus', 'connected');
      return room.room.code;
    } catch (error) {
      commit('setConnectionStatus', 'disconnected');
      throw error;
    }
  },

  async joinRoom({ commit }, roomId) {
    commit('setConnectionStatus', 'connecting');
    try {
      const room = await MatchmakingService.joinRoom(roomId);
      commit('setRoomId', room.room.id);
      commit('setRoomCode', room.room.code);
      commit('setIsHost', false);
      commit('setGameStatus', 'lobby');
      commit('setPlayers', room.room.participants.map(p => ({
        id: p.user_id,
        name: p.name,
        ready: p.status === 'ready',
        isHost: p.user_id === room.room.host_id,
        photo: p.photo || null,
      })));
      commit('setConnectionStatus', 'connected');
    } catch (error) {
      commit('setConnectionStatus', 'disconnected');
      throw error;
    }
  },

  async joinByCode({ commit }, code) {
    commit('setConnectionStatus', 'connecting');
    try {
      const room = await MatchmakingService.joinByCode(code);
      commit('setRoomId', room.room.id);
      commit('setRoomCode', room.room.code);
      commit('setIsHost', false);
      commit('setGameStatus', 'lobby');
      commit('setPlayers', room.room.participants.map(p => ({
        id: p.user_id,
        name: p.name,
        ready: p.status === 'ready',
        isHost: p.user_id === room.room.host_id,
        photo: p.photo || null,
      })));
      commit('setConnectionStatus', 'connected');
    } catch (error) {
      commit('setConnectionStatus', 'disconnected');
      throw error;
    }
  },

  async quickMatch({ commit, rootState }) {
    commit('setGameStatus', 'waiting_match');
    try {
      const room = await MatchmakingService.quickMatch();
      commit('setRoomId', room.room.id);
      commit('setRoomCode', room.room.code);
      commit('setIsHost', room.room.host_id === rootState.player.playerData.id);
      commit('setPlayers', room.room.participants.map(p => ({
        id: p.user_id,
        name: p.name,
        ready: p.status === 'ready',
      })));
      commit('setConnectionStatus', 'connected');
      commit('setGameStatus', 'lobby');
      return room.room;
    } catch (error) {
      commit('setGameStatus', 'lobby');
      throw error;
    }
  },

  async cancelQuickMatch({ commit, dispatch, state }) {
    if (state.roomCode) {
      await dispatch('leaveRoom');
      return;
    }
    commit('setGameStatus', 'lobby');
    commit('setConnectionStatus', 'disconnected');
  },

  async startGame({ commit, state }) {
    if (!state.isHost) return;
    try {
      await MatchmakingService.startGame(state.roomId);
      commit('setGameStatus', 'playing');
    } catch (error) {
      console.error('Failed to start game:', error);
      throw error;
    }
  },

  async submitTurn({ state }, cardIds) {
    try {
      const result = await MatchmakingService.submitTurn(state.roomId, cardIds);
      return result;
    } catch (error) {
      console.error('Failed to submit turn:', error);
      throw error;
    }
  },

  leaveRoom({ commit }) {
    commit('setRoomId', null);
    commit('setRoomCode', null);
    commit('setPlayers', []);
    commit('setGameStatus', 'lobby');
    commit('setConnectionStatus', 'disconnected');
  },

  async refreshRoom({ commit, state, rootState }) {
    if (!state.roomId) return null;
    const response = await MatchmakingService.getRoom(state.roomId);
    const room = response.room;
    commit('setRoomCode', room.code);
    commit('setIsHost', room.host_id === rootState.player.playerData.id);
    commit('setGameStatus', room.status === 'active' ? 'playing' : 'lobby');
    commit('setPlayers', room.participants.map(p => ({
      id: p.user_id,
      name: p.name,
      ready: p.status === 'ready',
      isHost: p.user_id === room.host_id,
      photo: p.photo || null,
    })));
    return room;
  },

  // Echo/Pusher realtime subscription
  async subscribeRoom({ commit, state }) {
    if (!state.roomId) return;
    try {
      const echo = (await import('@/services/echo')).default;

      echo.private(`game.${state.roomId}`)
        .listen('GameStarted', (_e) => {
          commit('setGameStatus', 'playing');
        });

      commit('setConnectionStatus', 'connected');
    } catch (error) {
      console.error('Echo subscription failed:', error);
    }
  },
};
