import 'babel-polyfill'
import fs from 'fs'
// import path from 'path'
import webpack from 'webpack'
import webpackTargetElectronRenderer from 'webpack-target-electron-renderer'

 const config = {
  debug: true,
  devtool: 'cheap-source-map',
  target: 'electron-renderer',
  entry: './src/browser.js',
  output: {
    path: './src/',
    filename: 'bundle.js',
    publicPath: '/',
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
  .filter(dir => '.bin' !== dir),
  // resolve: {
  //   alias: {
  //     react: path.resolve('./node_modules/react'),
  //   }
  // }
}

config.target = webpackTargetElectronRenderer(config);

export default config
