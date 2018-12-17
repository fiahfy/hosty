import Vue from 'vue'
import electronAcceleratorFormatter from '@fiahfy/electron-accelerator-formatter'

Vue.filter('accelerator', (title, accelerator) => {
  return `${title} (${electronAcceleratorFormatter(accelerator)})`
})
