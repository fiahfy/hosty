import Vue from 'vue'
import Router from 'vue-router'
import Explorer from '../pages/Explorer'
import Settings from '../pages/Settings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'explorer',
      component: Explorer
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
})
