export default {
  SetPlayerDataAsync: function(store, payload) {
    Object.keys(payload).forEach(key => {
      store.state.playerData[key] = payload[key];
    });
    store.commit("setPlayerData", store.state.playerData);
    FBInstant.player.setDataAsync(payload).then(function() {
      console.log("data is set", payload);
    });
  }
};
