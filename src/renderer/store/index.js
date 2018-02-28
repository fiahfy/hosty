import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import router from '../router'
import explorer from './explorer'
import group from './group'
import preview from './preview'
import settings from './settings'
import * as HostsFileManager from '../utils/hosts-file-manager'

Vue.use(Vuex)

const Selector = {
  groupList: '.group-list',
  hostList: '.host-list'
}

export default new Vuex.Store({
  state: {
    title: '',
    message: ''
  },
  actions: {
    changeRoute ({ dispatch }, payload) {
      router.push(payload)
      const title = payload.name.charAt(0).toUpperCase() + payload.name.slice(1)
      dispatch('changeTitle', { title })
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
    group,
    preview,
    settings
  },
  plugins: [
    createPersistedState({
      paths: [
        'explorer',
        'group',
        'settings'
      ]
    })
  ]
})
