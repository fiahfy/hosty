const pkg = require('./package')

module.exports = {
  /*
   ** Build configuration
   */
  build: {
    extend(config, ctx) {
      // Extend only webpack config for client-bundle
      if (ctx.isClient) {
        config.target = 'electron-renderer'
      }
      // Set relative path
      config.output.publicPath = './_nuxt/'
    }
  },

  /*
   ** Global CSS
   */
  css: [
    'material-design-icons-iconfont/dist/material-design-icons.css',
    'typeface-roboto/index.css',
    '~/assets/css/app.css'
  ],

  /*
   ** Generate configuration
   */
  generate: {
    dir: 'app'
  },

  /*
   ** Customize the progress-bar color
   */
  loading: false,

  /*
   ** Headers of the page
   */
  head: { title: pkg.productName },

  /*
   ** SPA or Universal
   */
  mode: 'spa',

  /*
   ** Nuxt.js modules
   */
  modules: [
    [
      '@nuxtjs/vuetify',
      {
        materialIcons: false,
        theme: {
          primary: '#ff4081',
          accent: '#ff4081'
        }
      }
    ]
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/filter', '~/plugins/ipc-listener'],

  /*
   ** Router configuration
   */
  router: {
    mode: 'hash'
  },

  /*
   ** Source directory
   */
  srcDir: 'src',

  /*
   ** Transition configuration
   */
  transition: {
    mode: 'in-out'
  },

  /*
   ** Vue configuration
   */
  vue: {
    config: {
      productionTip: false
    }
  }
}
