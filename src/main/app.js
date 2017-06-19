import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import Window from './window';
import * as HostsFileManager from '../renderer/utils/hosts-file-manager';

const PATH_WINDOW_OPTIONS = path.join(app.getPath('userData'), 'window.json');

export default class App {
  load() {
    this.handleEvents();
  }
  createWindow() {
    if (this.window) {
      return;
    }

    const options = App.loadWindowOptions();

    this.window = new Window(this);
    this.window.open(options);
  }
  removeWindow() {
    this.window = null;
  }
  static loadWindowOptions() {
    try {
      return JSON.parse(fs.readFileSync(PATH_WINDOW_OPTIONS));
    } catch (e) {
      return null;
    }
  }
  static saveWindowOptions(options) {
    try {
      fs.writeFileSync(PATH_WINDOW_OPTIONS, JSON.stringify(options));
    } catch (e) {
      //
    }
  }
  handleEvents() {
    app.on('ready', () => {
      this.createWindow();
    });

    app.on('activate', () => {
      this.createWindow();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('will-quit', () => {
      HostsFileManager.clear();
    });
  }
}
