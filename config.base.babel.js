import webpack from 'webpack'

const env = process.env.NODE_ENV || 'development'
const devtool = env !== 'production' ? 'inline-source-map' : 'source-map'

export default {
  devtool,
  context: `${__dirname}/../src`,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader?' +
              `{ "includePaths": ["${__dirname}/../node_modules"] }`
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env)
      }
    })
  ],
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  }
}
