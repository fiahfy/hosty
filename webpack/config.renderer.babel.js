import fs from 'fs';
import config from './config.base.babel';

const nodeModules = fs.readdirSync('node_modules')
  .filter(dir => dir !== '.bin');

let rules = config.module.rules;
rules = rules.concat([
  {
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
      'resolve-url-loader',
    ],
  },
  {
    test: /\.(jpg|gif|png|svg)$/,
    loader: 'url-loader',
    options: {
      limit: '10000',
      name: 'img/[name].[ext]',
    },
  },
  {
    test: /\.(woff|woff2|eot|ttf)$/,
    loader: 'url-loader',
    options: {
      limit: '10000',
      name: 'font/[name].[ext]',
    },
  },
]);

export default {
  ...config,
  target: 'electron-renderer',
  entry: './renderer.js',
  output: {
    path: `${__dirname}/../app/assets/`,
    publicPath: './assets/',
    filename: 'js/renderer.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules,
  },
  externals: nodeModules,
};
