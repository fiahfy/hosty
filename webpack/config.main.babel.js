import config from './config.babel'

export default {
  ...config,
  target: 'electron-main',
  entry: './main.js',
  output: {
    path: `${__dirname}/../app/`,
    filename: '../main.js'
  },
  node: {
    __dirname: false,
    __filename: false
  }
}
