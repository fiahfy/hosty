import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import router from '../router'
import explorer from './explorer'
import settings from './settings'
import group from './group'
import * as HostsFileManager from '../utils/hosts-file-manager'

Vue.use(Vuex)

const Selector = {
  groupList: '.group-list>table',
  hostList: '.host-list>table'
}

export default new Vuex.Store({
  state: {
    title: '',
    message: ''
  },
  actions: {
    changeRoute (_, payload) {
      router.push(payload)
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
    focusGroupList ({ dispatch }) {
      dispatch('focus', { selector: Selector.groupList })
    },
    focusHostList ({ dispatch }) {
      dispatch('focus', { selector: Selector.hostList })
    },
    async initHosts ({ state }) {
      await HostsFileManager.init()
      HostsFileManager.save(state.group.groups)
    },
    syncHosts ({ state }) {
      HostsFileManager.save(state.group.groups)
    },
    clearHosts () {
      HostsFileManager.clear()
    },
    importHosts ({ dispatch }, { filepath }) {
      try {
        const groups = HostsFileManager.readHostyFile(filepath)
        dispatch('group/syncGroups', { groups })
        dispatch('showMessage', { message: 'Imported' })
      } catch (e) {
        console.error(e)
        dispatch('showMessage', { message: 'Import failed' })
      }
    },
    exportHosts ({ dispatch, state }, { filepath }) {
      try {
        const groups = state.group.groups
        HostsFileManager.writeHostyFile(filepath, groups)
        dispatch('showMessage', { message: 'Exported' })
      } catch (e) {
        console.error(e)
        dispatch('showMessage', { message: 'Export failed' })
      }
    },
    changeTitle ({ commit }, { title }) {
      commit('setTitle', { title })
    },
    showMessage ({ commit }, { message }) {
      commit('setMessage', { message })
      // wait dom updated
      setTimeout(() => {
        commit('setMessage', { message: '' })
      })
    }
  },
  mutations: {
    setTitle (state, { title }) {
      state.title = title
    },
    setMessage (state, { message }) {
      state.message = message
    }
  },
  getters: {
    titleBar (state) {
      return process.platform === 'darwin' && !state.fullScreen
    }
  },
  modules: {
    explorer,
    settings,
    group
  },
  plugins: [
    createPersistedState({
      paths: [
        'group',
        'settings'
      ]
    })
  ]
})
