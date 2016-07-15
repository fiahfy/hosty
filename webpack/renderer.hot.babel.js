import webpack from 'webpack'
import rendererConfig from './renderer.babel'

let [babelLoader, ...otherLoaders] = rendererConfig.module.loaders
babelLoader = {
  ...babelLoader,
  query: {
    ...babelLoader.query,
    presets: [
      ...babelLoader.query.presets,
      'react-hmre'
    ]
  }
}

export default {
  ...rendererConfig,
  output: {
    ...rendererConfig.output,
    publicPath: 'http://localhost:8080/assets/'
  },
  plugins: [
    ...rendererConfig.plugins,
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    ...rendererConfig.module,
    loaders: [
      babelLoader,
      ...otherLoaders
    ]
  },
  devServer: {
    port:   8080,
    inline: true,
    hot:    true,
  }
}
