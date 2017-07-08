import { app, shell, dialog, ipcMain, Menu } from 'electron';
import * as Group from '../renderer/utils/group';
import * as HostsFileManager from '../renderer/utils/hosts-file-manager';

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
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteandmatchstyle' },
          { role: 'delete' },
          { role: 'selectall' },
        ],
      },
      {
        label: 'View',
        submenu: [
          { label: 'Groups', accelerator: 'CmdOrCtrl+G', click: () => { this.showGroups(); } },
          { label: 'Search', accelerator: 'CmdOrCtrl+F', click: () => { this.search(); } },
          { type: 'separator' },
          { role: 'reload' },
          { role: 'forcereload' },
          { role: 'toggledevtools' },
          { type: 'separator' },
          // { role: 'resetzoom' },
          // { role: 'zoomin' },
          // { role: 'zoomout' },
          // { type: 'separator' },
          { role: 'togglefullscreen' },
        ],
      },
      {
        role: 'window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' },
        ],
      },
      {
        role: 'help',
        submenu: [
          { label: 'Learn More', click: () => { shell.openExternal('https://github.com/fiahfy/hosty'); } },
        ],
      },
    ];

    if (process.platform === 'darwin') {
      template.unshift({
        label: app.getName(),
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { label: 'Preferences...', accelerator: 'CmdOrCtrl+,', click: () => { this.showSettings(); } },
          { type: 'separator' },
          { role: 'services', submenu: [] },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' },
        ],
      });

      // Edit menu
      template[2].submenu.push(
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' },
          ],
        },
      );

      // Window menu
      template[4].submenu = [
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
      ];
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

        try {
          const groups = HostsFileManager.readGroupsFromHostyFile(filename);
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

        const groups = HostsFileManager.readGroupsFromHostsFiles(filenames);
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

        ipcMain.once('sendGroups', (event, { groups }) => {
          HostsFileManager.writeGroupsToHostyFile(groups, filename);
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
        HostsFileManager.writeGroupsToHostyFile(groups, filename);
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
  showSettings() {
    this.window.webContents.send('showSettingsWindow');
  }
}
