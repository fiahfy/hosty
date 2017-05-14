import webpack from 'webpack';

const env = process.env.NODE_ENV || 'development';
const debug = env === 'development';
const devtool = debug ? 'eval' : 'source-map';

export default {
  devtool,
  context: `${__dirname}/src`,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env),
      },
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
