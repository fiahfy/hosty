import Vue from 'vue'
import Router from 'vue-router'
import Index from '~/pages/Index'
import Settings from '~/pages/Settings'

Vue.use(Router)

export const Name = {
  index: 'index',
  settings: 'settings'
}

export default new Router({
  routes: [
    {
      path: '/',
      name: Name.index,
      component: Index
    },
    {
      path: '/settings',
      name: Name.settings,
      component: Settings
    }
  ]
})
