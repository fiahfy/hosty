import { BrowserWindow } from 'electron'
import ApplicationMenu from './application-menu'

export default class ApplicationWindow {
  constructor(application) {
    this.application = application
  }
  open(args) {
    const options = args || { width: 820, height: 600 }

    this.browserWindow = new BrowserWindow(options)

    this.browserWindow.loadURL(`file://${__dirname}/app/index.html`)

    if (process.env.NODE_ENV === 'development') {
      this.browserWindow.webContents.openDevTools()
    }

    this.createMenu()
    const menu = new ApplicationMenu()
    menu.setup()

    this.handleEvents()
  }
  handleEvents() {
    this.browserWindow.on('close', () => {
      const options = this.browserWindow.getBounds()
      this.application.saveWindowOptions(options)
    })

    this.browserWindow.on('closed', () => {
      this.browserWindow = null
      this.application.removeWindow()
    })
  }
}
