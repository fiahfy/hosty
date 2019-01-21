import createPersistedState from 'vuex-persistedstate'
import Package from '~~/package.json'
import hosty from '~/utils/hosty'

export const state = () => ({
  title: Package.productName,
  message: null,
  fullScreen: false,
  permission: undefined
})

export const getters = {
  titleBar(state) {
    return process.platform === 'darwin' && !state.fullScreen
  },
  badgeCount(state, getters) {
    const count = getters['local/problems/results'].reduce((carry, result) => {
      return carry + result.children.length
    }, 0)
    return count > 9 ? '9+' : count
  }
}

export const actions = {
  async initialize({ commit, dispatch, state }) {
    dispatch('local/explorer/loadGroups')
    try {
      await hosty.initialize(state.group.groups)
      commit('setPermission', { permission: true })
      dispatch('showMessage', {
        color: 'success',
        text: `Started syncing with hosts (${hosty.hostsPath})`
      })
    } catch (e) {
      console.error(e) // eslint-disable-line no-console
      commit('setPermission', { permission: false })
      dispatch('showMessage', { color: 'error', text: e.message })
    }
  },
  async finalize({ dispatch }) {
    try {
      await hosty.finalize()
    } catch (e) {
      console.error(e) // eslint-disable-line no-console
      dispatch('showMessage', { color: 'error', text: e.message })
    }
  },
  sync({ commit, dispatch, state }) {
    hosty.lazySync(state.group.groups, (e) => {
      if (e) {
        console.error(e) // eslint-disable-line no-console
        commit('setPermission', { permission: false })
        dispatch('showMessage', { color: 'error', text: e.message })
      }
    })
  },
  import({ commit, dispatch }, { filepath }) {
    try {
      const groups = hosty.read(filepath)
      commit('group/setGroups', { groups })
      dispatch('local/explorer/loadGroups')
      dispatch('showMessage', {
        color: 'success',
        text: 'Imported hosty file'
      })
      this.$router.push('/explorer')
    } catch (e) {
      console.error(e) // eslint-disable-line no-console
      dispatch('showMessage', { color: 'error', text: 'Import failed' })
    }
  },
  export({ dispatch, state }, { filepath }) {
    try {
      hosty.write(filepath, state.group.groups)
      dispatch('showMessage', {
        color: 'success',
        text: 'Exported hosty file'
      })
    } catch (e) {
      console.error(e) // eslint-disable-line no-console
      dispatch('showMessage', { color: 'error', text: 'Export failed' })
    }
  },
  focus(_, { selector }) {
    const el = document.querySelector(selector)
    if (el) {
      el.focus()
    }
  },
  select(_, { selector }) {
    const el = document.querySelector(selector)
    if (el) {
      el.select()
    }
  },
  showMessage({ commit }, message) {
    commit('setMessage', { message })
  }
}

export const mutations = {
  setTitle(state, { title }) {
    state.title = title
  },
  setMessage(state, { message }) {
    state.message = message
  },
  setFullScreen(state, { fullScreen }) {
    state.fullScreen = fullScreen
  },
  setPermission(state, { permission }) {
    state.permission = permission
  }
}

export const plugins = [
  createPersistedState({
    paths: ['group', 'settings']
  }),
  (store) => {
    store.subscribe((mutation) => {
      if (mutation.type.indexOf('group/') === 0 && store.state.permission) {
        store.dispatch('sync')
      }
    })
  }
]
