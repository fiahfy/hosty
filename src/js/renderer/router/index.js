import Vue from 'vue'
import Router from 'vue-router'
// import Explorer from '../pages/Explorer'
// import Preview from '../pages/Preview'
import Settings from '../pages/Settings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'explorer',
      component: Settings
    },
    {
      path: '/preview',
      name: 'preview',
      component: Settings
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
})
