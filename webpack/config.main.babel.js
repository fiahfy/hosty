import config from './config.base.babel'

export default {
  ...config,
  target: 'electron-main',
  entry: './js/main/index.js',
  output: {
    path: `${__dirname}/../app/`,
    filename: '../main.js'
  },
  node: {
    __dirname: false,
    __filename: false
  }
}
