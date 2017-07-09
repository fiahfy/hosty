import webpack from 'webpack';
import config from './config.renderer.babel';

const plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
]);

export default {
  ...config,
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000/',
    'webpack/hot/only-dev-server',
    config.entry,
  ],
  output: {
    ...config.output,
    publicPath: 'http://localhost:3000/assets/',
  },
  plugins,
  devServer: {
    port: 3000,
    inline: true,
    hot: true,
  },
};
