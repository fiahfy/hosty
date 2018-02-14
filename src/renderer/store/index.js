import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import router from '../router'
import explorer from './explorer'
import settings from './settings'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: ''
  },
  actions: {
    changeRoute (_, payload) {
      router.push(payload)
    }
  },
  getters: {
    titleBar (state) {
      return process.platform === 'darwin' && !state.fullScreen
    }
  },
  modules: {
    explorer,
    settings
  },
  plugins: [
    createPersistedState({
      paths: [
        'explorer.groups',
        'settings'
      ]
    })
  ]
})
