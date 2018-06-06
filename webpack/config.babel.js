import webpack from 'webpack'

const mode = process.env.NODE_ENV || 'development'

export default {
  mode,
  context: `${__dirname}/../src/`,
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
        NODE_ENV: JSON.stringify(mode),
        HMR: JSON.stringify(process.env.HMR),
        PORT: JSON.stringify(process.env.PORT)
      }
    })
  ],
  resolve: {
    alias: {
      '~~': `${__dirname}/../`,
      '~': `${__dirname}/../src/`
    }
  }
}
