import fs from 'fs';
import config from './config.base.babel';

const nodeModules = fs.readdirSync('node_modules')
  .filter(dir => dir !== '.bin');

export default {
  ...config,
  target: 'electron',
  entry: './main.js',
  output: {
    path: `${__dirname}/../app/assets/`,
    publicPath: '/assets/',
    filename: '../../main.js',
    libraryTarget: 'commonjs2',
  },
  externals: nodeModules,
  node: {
    __dirname: false,
    __filename: false,
  },
};
