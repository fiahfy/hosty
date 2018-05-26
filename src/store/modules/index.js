import router from '~/router'
import * as Hosts from '~/utils/hosts'
import explorer from './explorer'

export const Selector = {
  explorerGroupTable: '.explorer-group-table',
  explorerHostTable: '.explorer-host-table'
}

export default {
  namespaced: true,
  state: {
    title: '',
    message: '',
    messages: [],
    snackbar: false
  },
  actions: {
    async initialize ({ dispatch }) {
      try {
        await Hosts.setup()
      } catch (e) {
        dispatch('showMessage', { message: e.message })
      }
      dispatch('app/explorer/group/sort', null, { root: true })
      dispatch('sync')
    },
    finalize () {
      Hosts.clear()
    },
    sync ({ rootGetters }) {
      Hosts.sync(rootGetters['group/hosts'])
    },
    import ({ dispatch }, { filepath }) {
      try {
        const groups = Hosts.read(filepath)
        dispatch('group/setGroups', { groups }, { root: true })
        dispatch('app/explorer/group/sort', null, { root: true })
        dispatch('showMessage', { message: 'Imported' })
      } catch (e) {
        console.error(e)
        dispatch('showMessage', { message: 'Import failed' })
      }
    },
    export ({ dispatch, rootState }, { filepath }) {
      try {
        const groups = rootState.group.groups
        Hosts.write(filepath, groups)
        dispatch('showMessage', { message: 'Exported' })
      } catch (e) {
        console.error(e)
        dispatch('showMessage', { message: 'Export failed' })
      }
    },
    focus (_, { selector }) {
      // wait dom updated
      setTimeout(() => {
        const el = document.querySelector(selector)
        if (el) {
          el.focus()
        }
      })
    },
    changeRoute ({ dispatch }, payload) {
      router.push(payload)
    },
    changeTitle ({ commit }, { title }) {
      commit('setTitle', { title })
    },
    showMessage ({ commit, dispatch, state }, { message }) {
      if (state.snackbar) {
        commit('setMessages', { messages: [...state.messages, message] })
        return
      }
      commit('setMessage', { message })
      commit('setSnackbar', { snackbar: true })
    },
    showNextMessage ({ commit, state }) {
      if (!state.messages.length) {
        return
      }
      const message = state.messages[0]
      commit('setMessage', { message })
      commit('setMessages', { messages: state.messages.slice(1) })
      commit('setSnackbar', { snackbar: true })
    }
  },
  mutations: {
    setTitle (state, { title }) {
      state.title = title
    },
    setMessage (state, { message }) {
      state.message = message
    },
    setMessages (state, { messages }) {
      state.messages = messages
    },
    setSnackbar (state, { snackbar }) {
      state.snackbar = snackbar
    }
  },
  getters: {
    titleBar (state) {
      return process.platform === 'darwin' && !state.fullScreen
    }
  },
  modules: {
    explorer
  }
}
