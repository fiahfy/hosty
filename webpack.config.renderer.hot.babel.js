import webpack from 'webpack'
import rendererConfig from './webpack.config.renderer.babel'

const [babelLoader, ...otherLoaders] = rendererConfig.module.loaders
let newBabelLoader = babelLoader
newBabelLoader = {
  ...babelLoader,
  query: {
    ...babelLoader.query,
    presets: [
      ...babelLoader.query.presets,
      'react-hmre',
    ],
  },
}

export default {
  ...rendererConfig,
  output: {
    ...rendererConfig.output,
    publicPath: 'http://localhost:8080/assets/',
  },
  plugins: [
    ...rendererConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    ...rendererConfig.module,
    loaders: [
      newBabelLoader,
      ...otherLoaders,
    ],
  },
  devServer: {
    port: 8080,
    inline: true,
    hot: true,
  },
}
