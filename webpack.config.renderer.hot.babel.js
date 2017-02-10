import webpack from 'webpack'
import rendererConfig from './webpack.config.renderer.babel'

const [babelRule, ...otherRules] = rendererConfig.module.rules
let newBabelRule = babelRule
newBabelRule = {
  ...babelRule,
  options: {
    ...babelRule.options,
    presets: [
      ...babelRule.options.presets,
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
    rules: [
      newBabelRule,
      ...otherRules,
    ],
  },
  devServer: {
    port: 8080,
    inline: true,
    hot: true,
  },
}
