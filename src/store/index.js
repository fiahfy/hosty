import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import Package from '~~/package.json'
import router, { Name } from '~/router'
import Hosty from '~/utils/hosty'
import local from './local'
import group from './group'
import settings from './settings'

Vue.use(Vuex)

const hosty = new Hosty()

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
    async initialize({ commit, dispatch, state }) {
      dispatch('local/explorer/loadGroups')
      try {
        await hosty.initialize(state.group.groups)
        commit('setPermission', { permission: true })
        dispatch('showMessage', {
          color: 'success',
          text: `Started syncing with hosts (${Hosty.hostsPath})`
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
      hosty.data = state.group.groups
      hosty.lazySync((e) => {
        if (e) {
          console.error(e) // eslint-disable-line no-console
          commit('setPermission', { permission: false })
          dispatch('showMessage', { color: 'error', text: e.message })
        }
      })
    },
    import({ commit, dispatch }, { filepath }) {
      try {
        hosty.load(filepath)
        commit('group/setGroups', { groups: hosty.data })
        dispatch('changeRoute', { name: Name.explorer })
        dispatch('local/explorer/loadGroups')
        dispatch('showMessage', {
          color: 'success',
          text: 'Imported hosty file'
        })
      } catch (e) {
        console.error(e) // eslint-disable-line no-console
        dispatch('showMessage', { color: 'error', text: 'Import failed' })
      }
    },
    export({ dispatch, state }, { filepath }) {
      try {
        hosty.data = state.group.groups
        hosty.save(filepath)
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
