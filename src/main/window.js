import { BrowserWindow } from 'electron'
import windowStateKeeper from 'electron-window-state'
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

    const builder = new MenuBuilder(this.win)
    builder.build()

    this.addEventListeners()
  }
  addEventListeners () {
    this.win.on('closed', () => {
      this.win = null
      this.app.removeWindow()
    })
  }
}
