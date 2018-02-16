import { BrowserWindow, Menu } from 'electron'
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
      this.setupDevelopmentEnvironment()
    }
    this.addEventListeners()
  }
  sendMessage (channel) {
    this.win.webContents.send(channel)
  }
  setupDevelopmentEnvironment () {
    installExtension(VUEJS_DEVTOOLS)
      .catch((err) => {
        console.log('Unable to install `vue-devtools`: \n', err) // eslint-disable-line no-console
      })
    this.win.openDevTools()
    this.win.webContents.on('context-menu', (e, props) => {
      const { x, y } = props

      Menu
        .buildFromTemplate([{
          label: 'Inspect element',
          click: () => {
            this.win.inspectElement(x, y)
          }
        }])
        .popup(this.win)
    })
  }
  addEventListeners () {
    this.win.on('closed', () => {
      this.win = null
      this.app.removeWindow()
    })
  }
}
