import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import router from '../router'
import explorer from './explorer'
import settings from './settings'
import group from './group'
import * as HostsFileManager from '../utils/hosts-file-manager'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: ''
  },
  actions: {
    changeRoute (_, payload) {
      router.push(payload)
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
