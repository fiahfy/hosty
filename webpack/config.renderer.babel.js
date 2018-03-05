import config from './config.base.babel'

export default {
  ...config,
  target: 'electron-renderer',
  entry: './renderer.js',
  output: {
    path: `${__dirname}/../app/assets/`,
    publicPath: './assets/',
    filename: 'js/renderer.js'
  },
  module: {
    rules: [
      ...config.module.rules,
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader?' +
              `{ "includePaths": ["${__dirname}/../node_modules"] }`
          }
        }
      },
      {
        test: /\.(jpg|gif|png|svg)$/,
        loader: 'url-loader',
        options: {
          limit: '10000',
          name: 'img/[name].[ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url-loader',
        options: {
          limit: '10000',
          name: 'font/[name].[ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  }
}
