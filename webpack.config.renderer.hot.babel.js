import webpack from 'webpack';
import config from './webpack.config.renderer.babel';

export default {
  ...config,
  entry: [
    'react-hot-loader/patch',
    config.entry,
  ],
  output: {
    ...config.output,
    publicPath: 'http://localhost:8080/assets/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
  devServer: {
    port: 8080,
    inline: true,
    hot: true,
  },
};
