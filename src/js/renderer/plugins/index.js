import Vue from 'vue'
import Vuetify from 'vuetify'
import { buildText } from '../utils/accelerator'

Vue.use(Vuetify, {
  theme: {
    primary: '#ff4081',
    accent: '#ff4081'
  }
})

Vue.filter('accelerator', (title, accelerator) => {
  return `${title} (${buildText(accelerator)})`
})
