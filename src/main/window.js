import { BrowserWindow } from 'electron'
import windowStateKeeper from 'electron-window-state'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import MenuBuilder from './menu-builder'

export default class Window {
  constructor (app) {
    this.app = app
  }
  open () {
    const windowState = windowStateKeeper({
      defaultWidth: 820,
      defaultHeight: 600
    })

    const options = { ...windowState, titleBarStyle: 'hidden' }

    this.win = new BrowserWindow(options)
    this.win.loadURL(`file://${__dirname}/app/index.html`)

    windowState.manage(this.win)

    const builder = new MenuBuilder(this)
    builder.build()

    if (process.env.NODE_ENV !== 'production') {
      this.setupDevTools()
    }
    this.addEventListeners()
  }
  addEventListeners () {
    this.win.on('closed', () => {
      this.win = null
      this.app.removeWindow()
    })
  }
  setupDevTools () {
    installExtension(VUEJS_DEVTOOLS)
      .catch((err) => {
        console.log('Unable to install `vue-devtools`: \n', err) // eslint-disable-line no-console
      })
    this.win.openDevTools()
  }
  sendMessage (channel) {
    this.win.webContents.send(channel)
  }
}
