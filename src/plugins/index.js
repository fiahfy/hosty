import Vue from 'vue'
import Vuetify from 'vuetify'
import electronAcceleratorFormatter from '@fiahfy/electron-accelerator-formatter'

Vue.use(Vuetify, {
  theme: {
    primary: '#ff4081',
    accent: '#ff4081'
  }
})

Vue.filter('accelerator', (title, accelerator) => {
  return `${title} (${electronAcceleratorFormatter(accelerator)})`
})
