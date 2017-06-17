import { BrowserWindow } from 'electron';
import MenuBuilder from './menu-builder';

export default class Window {
  constructor(application) {
    this.application = application;
  }
  open(args) {
    const options = args || { width: 820, height: 600 };

    this.browserWindow = new BrowserWindow(options);
    this.browserWindow.loadURL(`file://${__dirname}/app/index.html`);

    const builder = new MenuBuilder(this.browserWindow);
    builder.build();

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
