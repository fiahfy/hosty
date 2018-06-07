import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import Package from '~~/package.json'
import router from '~/router'
import * as Hosts from '~/utils/hosts'
import explorer from './explorer'
import group from './group'
import settings from './settings'

Vue.use(Vuex)

export const Selector = {
  explorerTable: '.explorer-table',
  explorerChildTable: '.explorer-child-table'
}

export default new Vuex.Store({
  state: {
    title: Package.productName,
    message: null,
    fullScreen: false,
    permission: undefined
  },
  getters: {
    titleBar (state) {
      return process.platform === 'darwin' && !state.fullScreen
    }
  },
  actions: {
    async initialize ({ commit, dispatch }) {
      dispatch('explorer/loadGroups')
      try {
        await Hosts.initialize()
        commit('setPermission', { permission: true })
        dispatch('showMessage', { color: 'success', text: `Started syncing with hosts (${Hosts.path})` })
      } catch (e) {
        console.error(e)
        commit('setPermission', { permission: false })
        dispatch('showMessage', { color: 'error', text: e.message })
      }
      dispatch('sync')
    },
    finalize () {
      Hosts.finalize()
    },
    sync ({ commit, dispatch, getters }) {
      try {
        Hosts.sync(getters['group/validHosts'])
      } catch (e) {
        console.error(e)
        dispatch('showMessage', { color: 'error', text: e.message })
        commit('setPermission', { permission: false })
      }
    },
    import ({ commit, dispatch }, { filepath }) {
      try {
        const groups = Hosts.read(filepath)
        commit('group/setGroups', { groups })
        dispatch('explorer/loadGroups')
        dispatch('showMessage', { color: 'success', text: 'Imported hosty file' })
      } catch (e) {
        console.error(e)
        dispatch('showMessage', { color: 'error', text: 'Import failed' })
      }
    },
    export ({ dispatch, state }, { filepath }) {
      try {
        const groups = state.group.groups
        Hosts.write(filepath, groups)
        dispatch('showMessage', { color: 'success', text: 'Exported hosty file' })
      } catch (e) {
        console.error(e)
        dispatch('showMessage', { color: 'error', text: 'Export failed' })
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
    changeTitle ({ commit }, { title = Package.productName }) {
      document.title = title
      commit('setTitle', { title })
    },
    showMessage ({ commit, dispatch, state }, message) {
      commit('setMessage', { message })
    }
  },
  mutations: {
    setTitle (state, { title }) {
      state.title = title
    },
    setMessage (state, { message }) {
      state.message = message
    },
    setFullScreen (state, { fullScreen }) {
      state.fullScreen = fullScreen
    },
    setPermission (state, { permission }) {
      state.permission = permission
    }
  },
  modules: {
    explorer,
    group,
    settings
  },
  plugins: [
    createPersistedState({
      paths: [
        'group',
        'settings'
      ]
    }),
    (store) => {
      store.subscribe((mutation) => {
        if (mutation.type === 'group/setGroups' && store.state.permission) {
          store.dispatch('sync')
        }
      })
    }
  ]
})
