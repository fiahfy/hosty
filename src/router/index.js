import Vue from 'vue'
import Router from 'vue-router'
import Index from '~/pages/Index'
import Explorer from '~/pages/Explorer'
import Search from '~/pages/Search'
import Problems from '~/pages/Problems'
import Settings from '~/pages/Settings'

Vue.use(Router)

export const Name = {
  index: 'index',
  explorer: 'explorer',
  search: 'search',
  problems: 'problems',
  settings: 'settings'
}

export default new Router({
  routes: [
    {
      path: '/',
      component: Index,
      children: [
        {
          path: '/',
          name: Name.index
        },
        {
          path: '/explorer',
          name: Name.explorer,
          component: Explorer
        },
        {
          path: '/search',
          name: Name.search,
          component: Search
        },
        {
          path: '/problems',
          name: Name.problems,
          component: Problems
        }
      ]
    },
    {
      path: '/settings',
      name: Name.settings,
      component: Settings
    }
  ]
})
