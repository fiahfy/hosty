import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import group from './group'
import settings from './settings'
import app from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    group,
    settings,
    app
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
        if (mutation.type === 'group/setGroups') {
          store.dispatch('app/sync')
        }
      })
    }
  ]
})
