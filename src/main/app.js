import {app} from 'electron'
import fs from 'fs'
import path from 'path'
import Window from './window'
import HostsFileManager from '../renderer/utils/hosts-file-manager'

const WINDOW_INIT_FILE = path.join(app.getPath('userData'), 'window.json')

export default class Application {
  load() {
    this.handleEvents()
  }
  createWindow() {
    if (this.window) {
      return
    }

    const settings = this.loadWindowSettings()

    this.window = new Window(this)
    this.window.open(settings)
  }
  removeWindow() {
    this.window = null
  }
  loadWindowSettings() {
    try {
      return JSON.parse(fs.readFileSync(WINDOW_INIT_FILE))
    } catch (e) {
      return null
    }
  }
  saveWindowSettings(settings) {
    try {
      fs.writeFileSync(WINDOW_INIT_FILE, JSON.stringify(settings))
    } catch (e) {}
  }
  handleEvents() {
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
      HostsFileManager.clear()
    })
  }
}
