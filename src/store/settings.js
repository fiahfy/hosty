export default {
  namespaced: true,
  state: {
    darkTheme: false,
    deleteConfirmation: true
  },
  mutations: {
    setDarkTheme(state, { darkTheme }) {
      state.darkTheme = darkTheme
    },
    setDeleteConfirmation(state, { deleteConfirmation }) {
      state.deleteConfirmation = deleteConfirmation
    }
  }
}
