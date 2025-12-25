export default {
  roomCode: null,
  isHost: false,
  players: [], // Array of player objects { id, name, ready }
  gameStatus: 'lobby', // 'lobby', 'waiting_match', 'playing'
  matchTimeout: null,
  matchStartTime: null,
  connectionStatus: 'disconnected', // 'connected', 'connecting', 'disconnected'
}
