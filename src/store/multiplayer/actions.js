// Placeholder for now, real implementation will connect to Echo
export default {
  // Standard Mode
  createRoom({ commit, rootState }, roomName) {
    // Generate a random room code for now
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    commit('setRoomCode', code)
    commit('setIsHost', true)
    commit('setGameStatus', 'lobby')

    // Use roomName if needed, for now just log it
    console.log(`Creating room: ${roomName || 'Unnamed Room'}`)

    // Add self to players
    const self = {
      id: rootState.player.playerData.id || 'host',
      name: rootState.player.playerData.name || 'Host',
      isHost: true,
      ready: true
    }
    commit('setPlayers', [self])

    // Subscribe to channel (stub)
    console.log(`Subscribing to channel room.${code}`)
    commit('setConnectionStatus', 'connected')

    return code
  },

  joinRoom({ commit, rootState }, roomCode) {
    commit('setRoomCode', roomCode)
    commit('setIsHost', false)
    commit('setGameStatus', 'lobby')

    // Add self (in real app, this would happen after connection confirms join)
    const self = {
      id: rootState.player.playerData.id || 'guest',
      name: rootState.player.playerData.name || 'Guest',
      isHost: false,
      ready: true
    }
    commit('setPlayers', [self]) // In real app, we'd get existing players first

    console.log(`Joining channel room.${roomCode}`)
    commit('setConnectionStatus', 'connected')
  },

  // Quick Match
  startQuickMatch({ commit }) {
    commit('setGameStatus', 'waiting_match')
    commit('setMatchStartTime', Date.now())

    // Simulation of finding a match
    console.log('Searching for match...')

    // In real app, we would join a 'matchmaking' presence channel
  },

  cancelQuickMatch({ commit }) {
    commit('setGameStatus', 'lobby')
    commit('setMatchStartTime', null)
  },

  // Game Control
  startGame({ commit, state, dispatch }) {
    if (!state.isHost) return

    // Broadcast start event
    console.log('Broadcasting Start Game')
    commit('setGameStatus', 'playing')

    // Trigger game init in main playing store
    dispatch('playing/initializeGame', 'standard', { root: true })
  },

  leaveRoom({ commit }) {
    commit('setRoomCode', null)
    commit('setPlayers', [])
    commit('setGameStatus', 'lobby')
    commit('setConnectionStatus', 'disconnected')
  }
}
