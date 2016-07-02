import 'babel-polyfill'
import fs from 'fs'
import webpack from 'webpack'
import webpackTargetElectronRenderer from 'webpack-target-electron-renderer'

const debug = process.env.DEBUG != 0
const devtool = debug ? 'cheap-source-map' : 'source-map'
const env = debug ? 'development' : 'production'

const config = {
  debug: debug,
  devtool: devtool,
  target: 'electron-renderer',
  entry: './src/renderer.js',
  output: {
    path: './public/assets/',
    filename: 'js/renderer.js',
    publicPath: '/assets/',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ],
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

config.target = webpackTargetElectronRenderer(config);

export default config
