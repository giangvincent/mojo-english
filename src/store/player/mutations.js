export default {
  setPlayerData: function (state, payload) {
    Object.keys(payload).forEach(key => {
      state.playerData[key] = payload[key] ? payload[key] : 0
    })
  }
}
