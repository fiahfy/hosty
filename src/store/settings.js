export default {
  namespaced: true,
  state: {
    darkTheme: false
  },
  mutations: {
    setDarkTheme(state, { darkTheme }) {
      state.darkTheme = darkTheme
    }
  }
}
