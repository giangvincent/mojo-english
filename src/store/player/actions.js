/* eslint-disable no-undef */
export default {
  SetPlayerDataAsync: function (store, payload) {
    let preparePayload = {
      'locale': store.state.playerData['locale'],
      'level': store.state.playerData['level'],
      'point': store.state.playerData['point']
    }
    Object.keys(payload).forEach(key => {
      store.state.playerData[key] = payload[key]
      preparePayload[key] = payload[key]
    })
    store.commit('setPlayerData', store.state.playerData)

    FBInstant.player.setDataAsync(preparePayload).then(function () {
      console.log('data is set', preparePayload)
    })
  }
}
