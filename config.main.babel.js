import config from './config.base.babel'

export default {
  ...config,
  target: 'electron',
  entry: './main.js',
  output: {
    path: `${__dirname}/../app/assets/`,
    publicPath: '/assets/',
    filename: '../../main.js'
  },
  node: {
    __dirname: false,
    __filename: false
  }
}
