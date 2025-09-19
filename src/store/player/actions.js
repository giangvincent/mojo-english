import fbInstant from '@/services/fbInstant'
export default {
  SetPlayerDataAsync: function (store, payload) {
    const preparePayload = {
      locale: store.state.playerData.locale,
      level: store.state.playerData.level,
      point: store.state.playerData.point
    }
    Object.keys(payload).forEach(key => {
      store.state.playerData[key] = payload[key]
      preparePayload[key] = payload[key]
    })
    store.commit('setPlayerData', store.state.playerData)

    if (fbInstant.player && typeof fbInstant.player.setDataAsync === 'function') {
      fbInstant.player.setDataAsync(preparePayload).then(function () {
        console.log('data is set', preparePayload)
      })
    }
  }
}
