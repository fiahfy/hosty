import Vue from 'vue'
import Router from 'vue-router'
import Explorer from '~/pages/Explorer'
import Search from '~/pages/Search'
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
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
})
