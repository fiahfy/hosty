import webpack from 'webpack'
import config from './config.renderer.babel'

const port = process.env.PORT || 3000

export default {
  ...config,
  output: {
    ...config.output,
    publicPath: `http://localhost:${port}/`
  },
  plugins: [
    ...config.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  devServer: {
    port,
    inline: true,
    hot: true
  }
}
