import fs from 'fs';
import config from './webpack.config.base.babel';

const nodeModules = fs.readdirSync('node_modules')
  .filter(dir => dir !== '.bin');

let rules = config.module.rules;
rules = rules.concat([
  {
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
    ],
  },
  {
    test: /\.(jpg|gif|png|svg)$/,
    loader: 'url-loader',
    options: {
      limit: '10000',
      name: 'lib/[path][name].[ext]',
      context: 'node_modules',
    },
  },
  {
    test: /\.(woff|woff2|eot|ttf)$/,
    loader: 'url-loader',
    options: {
      limit: '10000',
      name: 'lib/[path][name].[ext]',
      context: 'node_modules',
    },
  },
]);

export default {
  ...config,
  target: 'electron-renderer',
  entry: './renderer.js',
  output: {
    path: `${__dirname}/app/assets/`,
    publicPath: './assets/',
    filename: 'js/renderer.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules,
  },
  externals: nodeModules,
};
