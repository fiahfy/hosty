import { app } from 'electron'
import Window from './window'
// import * as HostsFileManager from '../renderer/utils/hosts-file-manager'

export default class App {
  load () {
    this.addEventListeners()
  }
  createWindow () {
    if (this.window) {
      return
    }

    this.window = new Window(this)
    this.window.open()
  }
  removeWindow () {
    this.window = null
  }
  addEventListeners () {
    app.on('ready', () => {
      this.createWindow()
    })
    app.on('activate', () => {
      this.createWindow()
    })
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
    app.on('will-quit', () => {
      // HostsFileManager.clear()
    })
  }
}
