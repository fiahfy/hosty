import 'babel-polyfill'
import fs from 'fs'
import webpack from 'webpack'

const debug = process.env.DEBUG != 0
const devtool = debug ? 'cheap-source-map' : 'source-map'
const env = debug ? 'development' : 'production'

export default {
  debug: debug,
  devtool: devtool,
  target: 'electron',
  entry: './src/main.js',
  output: {
    path: './public/assets/',
    filename: '../../main.js',
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
  .filter(dir => '.bin' !== dir),
  node: {
    __filename: false,
    __dirname: false,
  }
}
