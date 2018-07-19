import Vue from 'vue'
import Router from 'vue-router'
import Explorer from '~/pages/Explorer'
import Finder from '~/pages/Finder'
import Settings from '~/pages/Settings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'explorer',
      component: Explorer
    },
    {
      path: '/finder',
      name: 'finder',
      component: Finder
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
})
