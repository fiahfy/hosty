import { app, shell, dialog, ipcMain, Menu } from 'electron';
import fs from 'fs';
import path from 'path';
import * as Group from '../renderer/utils/group';
import * as Host from '../renderer/utils/host';

export default class MenuBuilder {
  constructor(window) {
    this.window = window;
  }
  build() {
    if (process.env.NODE_ENV !== 'production') {
      this.setupDevelopmentEnvironment();
    }
    const template = this.buildTemplate();
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
  setupDevelopmentEnvironment() {
    this.window.openDevTools();
    this.window.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu
        .buildFromTemplate([{
          label: 'Inspect element',
          click: () => {
            this.window.inspectElement(x, y);
          },
        }])
        .popup(this.window);
    });
  }
  buildTemplate() {
    const template = [
      {
        label: 'File',
        submenu: [
          { label: 'Import Hosty File...', accelerator: 'CmdOrCtrl+I', click: () => { this.importHostyFile(); } },
          { label: 'Add Groups from Hosts Files...', accelerator: 'Shift+CmdOrCtrl+I', click: () => { this.addHostFiles(); } },
          { type: 'separator' },
          { label: 'Export Hosty File...', accelerator: 'CmdOrCtrl+E', click: () => { this.exportHostyFile(); } },
          { label: 'Export Hosts File...', accelerator: 'Shift+CmdOrCtrl+E', click: () => { this.exportHostsFile(); } },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
          { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
          { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' },
        ],
      },
      {
        label: 'View',
        submenu: [
          { label: 'Groups', accelerator: 'CmdOrCtrl+G', click: () => { this.showGroups(); } },
          { label: 'Search', accelerator: 'CmdOrCtrl+F', click: () => { this.search(); } },
          { type: 'separator' },
          { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => { this.window.webContents.reload(); } },
          { label: 'Toggle Full Screen', accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11', click: () => { this.window.setFullScreen(!this.window.isFullScreen()); } },
          { label: 'Toggle Developer Tools', accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I', click: () => { this.window.toggleDevTools(); } },
        ],
      },
      {
        label: 'Window',
        role: 'window',
        submenu: [
          { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
          { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' },
        ],
      },
      {
        label: 'Help',
        role: 'help',
        submenu: [
          { label: 'Learn More', click: () => { shell.openExternal('https://github.com/fiahfy/hosty'); } },
        ],
      },
    ];

    if (process.platform === 'darwin') {
      const name = app.getName();
      template.unshift({
        label: name,
        submenu: [
          { label: `About ${name}`, role: 'about' },
          { type: 'separator' },
          { label: 'Services', role: 'services', submenu: [] },
          { type: 'separator' },
          { label: `Hide ${name}`, accelerator: 'Command+H', role: 'hide' },
          { label: 'Hide Others', accelerator: 'Command+Alt+H', role: 'hideothers' },
          { label: 'Show All', role: 'unhide' },
          { type: 'separator' },
          { label: 'Quit', accelerator: 'Command+Q', click: () => { app.quit(); } },
        ],
      });
      // Window menu.
      template[3].submenu.push(
        { type: 'separator' },
        { label: 'Bring All to Front', role: 'front' },
      );
    }

    return template;
  }
  importHostyFile() {
    dialog.showOpenDialog(
      { filters: [{ name: 'Hosty File', extensions: ['hosty'] }] },
      (filenames) => {
        if (!filenames) {
          return;
        }

        const filename = filenames[0];
        const data = fs.readFileSync(filename, 'utf8');
        try {
          const groups = JSON.parse(data);
          this.window.webContents.send('sendGroups', { mode: 'import', groups });
        } catch (e) {
          this.window.webContents.send('sendMessage', {
            message: { text: 'Invalid Hosty file' },
          });
        }
      },
    );
  }
  addHostFiles() {
    dialog.showOpenDialog(
      { properties: ['openFile', 'multiSelections'] },
      (filenames) => {
        if (!filenames) {
          return;
        }

        const groups = filenames
          .map((filename) => {
            const { name } = path.parse(filename);
            const data = fs.readFileSync(filename, 'utf8');
            let hosts = Host.parse(data);
            if (!hosts.length) {
              return null;
            }
            hosts = hosts.map((host, i) => {
              const newHost = Object.assign({}, host);
              newHost.id = i + 1;
              return newHost;
            });
            return { enable: true, name, hosts };
          })
          .filter(host => !!host);

        this.window.webContents.send('sendGroups', { mode: 'add', groups });
      },
    );
  }
  exportHostyFile() {
    dialog.showSaveDialog(
      { filters: [{ name: 'Hosty File', extensions: ['hosty'] }] },
      (filename) => {
        if (!filename) {
          return;
        }

        const { ext } = path.parse(filename);
        let filenameWithExtension = filename;
        if (ext !== '.hosty') {
          filenameWithExtension += '.hosty';
        }

        ipcMain.once('sendGroups', (event, { groups }) => {
          fs.writeFileSync(filenameWithExtension, `${JSON.stringify(groups)}\n`, 'utf8');
          const groupLength = groups.length;
          const hostLength = Group.getHostLength(groups);
          this.window.webContents.send('sendMessage', {
            message: { text: `Exported ${groupLength} group(s), ${hostLength} host(s)` },
          });
        });
        this.window.webContents.send('requestGroups');
      },
    );
  }
  exportHostsFile() {
    dialog.showSaveDialog({}, (filename) => {
      if (!filename) {
        return;
      }

      ipcMain.once('sendGroups', (event, { groups }) => {
        fs.writeFileSync(filename, `${Group.build(groups)}\n`, 'utf8');
        const groupLength = groups.length;
        const hostLength = Group.getHostLength(groups);
        this.window.webContents.send('sendMessage', {
          message: { text: `Exported ${groupLength} group(s), ${hostLength} host(s)` },
        });
      });
      this.window.webContents.send('requestGroups');
    });
  }
  showGroups() {
    this.window.webContents.send('showGroupsWindow');
  }
  search() {
    this.window.webContents.send('showSearchWindow');
  }
}
