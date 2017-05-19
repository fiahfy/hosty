import { BrowserWindow } from 'electron';
import AppMenu from './app-menu';

export default class AppWindow {
  constructor(application) {
    this.application = application;
  }
  open(args) {
    const options = args || { width: 820, height: 600 };

    this.browserWindow = new BrowserWindow(options);

    this.browserWindow.loadURL(`file://${__dirname}/app/index.html`);

    if (process.env.NODE_ENV === 'development') {
      this.browserWindow.webContents.openDevTools();
    }

    AppMenu.setup();

    this.handleEvents();
  }
  handleEvents() {
    this.browserWindow.on('close', () => {
      const options = this.browserWindow.getBounds();
      this.application.constructor.saveWindowOptions(options);
    });

    this.browserWindow.on('closed', () => {
      this.browserWindow = null;
      this.application.removeWindow();
    });
  }
}
