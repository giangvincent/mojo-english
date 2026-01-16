export default {
  setRoomCode(state, code) {
    state.roomCode = code
  },
  setIsHost(state, isHost) {
    state.isHost = isHost
  },
  setPlayers(state, players) {
    state.players = players
  },
  addPlayer(state, player) {
    const exists = state.players.find(p => p.id === player.id)
    if (!exists) {
      state.players.push(player)
    }
  },
  removePlayer(state, playerId) {
    state.players = state.players.filter(p => p.id !== playerId)
  },
  setGameStatus(state, status) {
    state.gameStatus = status
  },
  setMatchStartTime(state, time) {
    state.matchStartTime = time
  },
  setConnectionStatus(state, status) {
    state.connectionStatus = status
  }
}
