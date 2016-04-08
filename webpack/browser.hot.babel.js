import webpack from 'webpack'
import config from './browser.babel'

let newConfig = Object.assign({}, config)
newConfig.output.publicPath = 'http://localhost:8080/'
newConfig.plugins = [new webpack.HotModuleReplacementPlugin()]
newConfig.module.loaders[0].query.presets.push('react-hmre')
newConfig.devServer = {
  port:   8080,
  inline: true,
  hot:    true,
  // proxy: [{
  //   path: /^((?!\/assets\/).)*$/,
  //   target: 'http://localhost:3000',
  //   secure: false
  // }]
}

export default newConfig
