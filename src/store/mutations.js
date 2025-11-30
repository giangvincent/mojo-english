export default {
  TOGGLE_MODAL: function (state) {
    state.popupModal = !state.popupModal
  },
  SET_MODAL: function (state, payload) {
    state.popupModal = !!payload
  },
  SET_SCREEN: function (state) {
    state.scr_width = window.innerWidth
    state.scr_height = window.innerWidth * 9 / 16
    console.log(state.scr_width + 'x' + state.scr_height)
  }
}
