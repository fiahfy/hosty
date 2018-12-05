import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import Package from '~~/package.json'
import router, { Name } from '~/router'
import * as Hosts from '~/utils/hosts'
import local from './local'
import group from './group'
import settings from './settings'

Vue.use(Vuex)

export const Selector = {
  queryInput: 'input[name=query]',
  explorerTable: '.explorer-table',
  hostTable: '.host-table'
}

export default new Vuex.Store({
  state: {
    title: Package.productName,
    message: null,
    fullScreen: false,
    permission: undefined
  },
  getters: {
    titleBar(state) {
      return process.platform === 'darwin' && !state.fullScreen
    },
    badgeCount(state, getters) {
      const count = getters['local/problems/results'].reduce(
        (carry, result) => {
          return carry + result.children.length
        },
        0
      )
      return count > 9 ? '9+' : count
    }
  },
  actions: {
    async initialize({ commit, dispatch, getters }) {
      dispatch('local/explorer/loadGroups')
      try {
        await Hosts.initialize(getters['group/actualHosts'])
        commit('setPermission', { permission: true })
        dispatch('showMessage', {
          color: 'success',
          text: `Started syncing with hosts (${Hosts.path})`
        })
      } catch (e) {
        commit('setPermission', { permission: false })
        dispatch('showMessage', { color: 'error', text: e.message })
      }
    },
    async finalize() {
      await Hosts.finalize()
    },
    async sync({ commit, dispatch, getters }) {
      try {
        await Hosts.lazySync(getters['group/actualHosts'])
      } catch (e) {
        commit('setPermission', { permission: false })
        dispatch('showMessage', { color: 'error', text: e.message })
      }
    },
    import({ commit, dispatch }, { filepath }) {
      try {
        const groups = Hosts.read(filepath)
        commit('group/setGroups', { groups })
        dispatch('changeRoute', { name: Name.explorer })
        dispatch('local/explorer/loadGroups')
        dispatch('showMessage', {
          color: 'success',
          text: 'Imported hosty file'
        })
      } catch (e) {
        dispatch('showMessage', { color: 'error', text: 'Import failed' })
      }
    },
    export({ dispatch, state }, { filepath }) {
      try {
        const groups = state.group.groups
        Hosts.write(filepath, groups)
        dispatch('showMessage', {
          color: 'success',
          text: 'Exported hosty file'
        })
      } catch (e) {
        dispatch('showMessage', { color: 'error', text: 'Export failed' })
      }
    },
    focus(_, { selector }) {
      // wait dom updated
      setTimeout(() => {
        const el = document.querySelector(selector)
        if (el) {
          el.focus()
        }
      })
    },
    select(_, { selector }) {
      // wait dom updated
      setTimeout(() => {
        const el = document.querySelector(selector)
        if (el) {
          el.select()
        }
      })
    },
    changeRoute(_, payload) {
      router.push(payload)
    },
    showMessage({ commit }, message) {
      commit('setMessage', { message })
    }
  },
  mutations: {
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
  },
  modules: {
    local,
    group,
    settings
  },
  plugins: [
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
})
