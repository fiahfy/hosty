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
          { label: 'Import Hosts File...', accelerator: 'CmdOrCtrl+Shift+I', click: () => { this.importHostsFile(); } },
          { label: 'Add Groups from Hosty Files...', click: () => { this.addGroupsFromHostyFiles(); } },
          { label: 'Add Groups from Hosts Files...', click: () => { this.addGroupsFromHostsFiles(); } },
          { type: 'separator' },
          { label: 'Export Hosty File...', accelerator: 'CmdOrCtrl+E', click: () => { this.exportHostyFile(); } },
          { label: 'Export Hosts File...', accelerator: 'CmdOrCtrl+Shift+E', click: () => { this.exportHostsFile(); } },
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
          // { role: 'pasteandmatchstyle' },
          { role: 'delete' },
          { role: 'selectall' },
          { type: 'separator' },
          { label: 'New Group', accelerator: 'CmdOrCtrl+Shift+N', click: () => { this.createGroup(); } },
          { label: 'Copy Group', accelerator: 'CmdOrCtrl+Shift+C', click: () => { this.copyGroups(); } },
          { label: 'Paste Group', accelerator: 'CmdOrCtrl+Shift+V', click: () => { this.pasteGroups(); } },
          { label: 'Delete Group', accelerator: 'CmdOrCtrl+Shift+Backspace', click: () => { this.deleteGroups(); } },
          { type: 'separator' },
          { label: 'New Host', accelerator: 'CmdOrCtrl+N', click: () => { this.createHost(); } },
          { label: 'Copy Host', accelerator: 'CmdOrCtrl+Alt+C', click: () => { this.copyHosts(); } },
          { label: 'Paste Host', accelerator: 'CmdOrCtrl+Alt+V', click: () => { this.pasteHosts(); } },
          { label: 'Delete Host', accelerator: 'CmdOrCtrl+Backspace', click: () => { this.deleteHosts(); } },
          { type: 'separator' },
          { label: 'Search', accelerator: 'CmdOrCtrl+F', click: () => { this.search(); } },
        ],
      },
      {
        label: 'View',
        submenu: [
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
          { label: 'Hosts List', accelerator: 'CmdOrCtrl+Shift+H', click: () => { this.showGroups(); } },
          { type: 'separator' },
          { role: 'close' },
          { role: 'minimize' },
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
      template[4].submenu.push(
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
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

        try {
          const groups = HostsFileManager.readGroupsFromHostyFile(filename);
          this.window.webContents.send('sendGroups', { method: 'initialize', groups });
        } catch (e) {
          this.window.webContents.send('sendMessage', {
            message: { text: 'Invalid Hosty file' },
          });
        }
      },
    );
  }
  importHostsFile() {
    dialog.showOpenDialog(
      {},
      (filenames) => {
        if (!filenames) {
          return;
        }
        const filename = filenames[0];

        const group = HostsFileManager.readGroupFromHostsFile(filename);
        this.window.webContents.send('sendGroups', { method: 'initialize', groups: [group] });
      },
    );
  }
  addGroupsFromHostyFiles() {
    dialog.showOpenDialog(
      {
        filters: [{ name: 'Hosty File', extensions: ['hosty'] }],
        properties: ['openFile', 'multiSelections'],
      },
      (filenames) => {
        if (!filenames) {
          return;
        }

        try {
          const groups = HostsFileManager.readGroupsFromFiles(filenames);
          this.window.webContents.send('sendGroups', { method: 'add', groups });
        } catch (e) {
          this.window.webContents.send('sendMessage', {
            message: { text: 'Invalid Hosty file' },
          });
        }
      },
    );
  }
  addGroupsFromHostsFiles() {
    dialog.showOpenDialog(
      {
        properties: ['openFile', 'multiSelections'],
      },
      (filenames) => {
        if (!filenames) {
          return;
        }

        const groups = HostsFileManager.readGroupsFromFiles(filenames);
        this.window.webContents.send('sendGroups', { method: 'add', groups });
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
  createGroup() {
    this.window.webContents.send('createGroup');
  }
  copyGroups() {
    this.window.webContents.send('copyGroups');
  }
  pasteGroups() {
    this.window.webContents.send('pasteGroups');
  }
  deleteGroups() {
    this.window.webContents.send('deleteGroups');
  }
  createHost() {
    this.window.webContents.send('createHost');
  }
  copyHosts() {
    this.window.webContents.send('copyHosts');
  }
  pasteHosts() {
    this.window.webContents.send('pasteHosts');
  }
  deleteHosts() {
    this.window.webContents.send('deleteHosts');
  }
}
