export const state = () => ({
  darkTheme: false,
  deleteConfirmation: true
})

export const mutations = {
  setDarkTheme(state, { darkTheme }) {
    state.darkTheme = darkTheme
  },
  setDeleteConfirmation(state, { deleteConfirmation }) {
    state.deleteConfirmation = deleteConfirmation
  }
}
