import 'babel-polyfill'
import fs from 'fs'
import webpack from 'webpack'

export default {
  debug: true,
  devtool: 'cheap-source-map',
  target: 'electron',
  entry: './src/main.js',
  output: {
    path: './public/assets/',
    filename: '../../main.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          plugins: ['transform-decorators-legacy'],
          presets: ['es2015', 'stage-0', 'react']
        }
      }
    ]
  },
  externals: fs.readdirSync('node_modules')
  .filter(dir => '.bin' !== dir)
}
