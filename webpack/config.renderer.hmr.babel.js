import webpack from 'webpack'
import config from './config.renderer.babel'

export default {
  ...config,
  output: {
    ...config.output,
    publicPath: 'http://localhost:3000/'
  },
  plugins: [
    ...config.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  devServer: {
    port: 3000,
    inline: true,
    hot: true
  }
}
