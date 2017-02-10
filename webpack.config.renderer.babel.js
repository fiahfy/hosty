import 'babel-polyfill'
import fs from 'fs'
import webpack from 'webpack'

const env = process.env.NODE_ENV || 'development'
const debug = env === 'development'
const devtool = debug ? 'cheap-source-map' : 'source-map'

export default {
  devtool,
  target: 'electron-renderer',
  entry: './src/renderer.js',
  output: {
    path: __dirname + '/app/assets/',
    filename: 'js/renderer.js',
    libraryTarget: 'commonjs2',
    publicPath: './assets/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env),
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          plugins: ['transform-decorators-legacy'],
          presets: ['es2015', 'stage-0', 'react'],
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
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
    ],
  },
  externals: fs.readdirSync('node_modules').filter(dir => dir !== '.bin'),
}
