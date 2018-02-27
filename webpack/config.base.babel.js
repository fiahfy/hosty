import webpack from 'webpack'

const mode = process.env.NODE_ENV || 'development'

export default {
  mode,
  context: `${__dirname}/../src`,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode)
      }
    })
  ]
}
