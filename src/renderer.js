import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './App'
import router from './router'
import store from './store'
import './plugins'
import { addIpcRendererListeners } from './ipc'

if (process.env.NODE_ENV !== 'production') {
  window['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true
}

Vue.config.devtools = process.env.NODE_ENV !== 'production'
Vue.config.productionTip = false

sync(store, router)
addIpcRendererListeners(store)

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App />'
})
