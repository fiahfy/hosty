import { app, shell, dialog, ipcMain, Menu } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
// import * as Group from '../renderer/utils/group'
// import * as HostsFileManager from '../renderer/utils/hosts-file-manager'

export default class MenuBuilder {
  constructor (window) {
    this.window = window
  }
  build () {
    if (process.env.NODE_ENV !== 'production') {
      this.setupDevelopmentEnvironment()
    }
    const template = this.buildTemplate()
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }
  setupDevelopmentEnvironment () {
    installExtension(VUEJS_DEVTOOLS)
      .catch((err) => {
        console.log('Unable to install `vue-devtools`: \n', err) // eslint-disable-line no-console
      })
    this.window.openDevTools()
    this.window.webContents.on('context-menu', (e, props) => {
      const { x, y } = props

      Menu
        .buildFromTemplate([{
          label: 'Inspect element',
          click: () => {
            this.window.inspectElement(x, y)
          }
        }])
        .popup(this.window)
    })
  }
  buildTemplate () {
    const template = [
      {
        label: 'File',
        submenu: [
          { label: 'Import...', accelerator: 'CmdOrCtrl+O', click: () => { this.import() } },
          { label: 'Add...', accelerator: 'CmdOrCtrl+Shift+O', click: () => { this.add() } },
          { type: 'separator' },
          { label: 'Export...', accelerator: 'CmdOrCtrl+S', click: () => { this.export() } }
        ]
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
          {
            label: 'Group',
            submenu: [
              { label: 'New Group', accelerator: 'CmdOrCtrl+Shift+N', click: () => { this.createGroup() } },
              { type: 'separator' },
              { label: 'Cut', accelerator: 'CmdOrCtrl+Shift+X', click: () => { this.cutGroups() } },
              { label: 'Copy', accelerator: 'CmdOrCtrl+Shift+C', click: () => { this.copyGroups() } },
              { label: 'Paste', accelerator: 'CmdOrCtrl+Shift+V', click: () => { this.pasteGroups() } },
              { type: 'separator' },
              { label: 'Enable', accelerator: 'CmdOrCtrl+Shift+E', click: () => { this.enableGroups() } },
              { label: 'Disable', accelerator: 'CmdOrCtrl+Shift+D', click: () => { this.disableGroups() } },
              { type: 'separator' },
              { label: 'Delete', accelerator: 'CmdOrCtrl+Shift+Backspace', click: () => { this.deleteGroups() } }
            ]
          },
          { type: 'separator' },
          {
            label: 'Host',
            submenu: [
              { label: 'New Host', accelerator: 'CmdOrCtrl+N', click: () => { this.createHost() } },
              { type: 'separator' },
              { label: 'Cut', accelerator: 'CmdOrCtrl+Alt+X', click: () => { this.cutHosts() } },
              { label: 'Copy', accelerator: 'CmdOrCtrl+Alt+C', click: () => { this.copyHosts() } },
              { label: 'Paste', accelerator: 'CmdOrCtrl+Alt+V', click: () => { this.pasteHosts() } },
              { type: 'separator' },
              { label: 'Enable', accelerator: 'CmdOrCtrl+E', click: () => { this.enableHosts() } },
              { label: 'Disable', accelerator: 'CmdOrCtrl+D', click: () => { this.disableHosts() } },
              { type: 'separator' },
              { label: 'Delete', accelerator: 'CmdOrCtrl+Backspace', click: () => { this.deleteHosts() } }
            ]
          },
          { type: 'separator' },
          { label: 'Find', accelerator: 'CmdOrCtrl+F', click: () => { this.findHosts() } }
        ]
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
          { role: 'togglefullscreen' }
        ]
      },
      {
        role: 'window',
        submenu: [
          { label: 'Hosts List', accelerator: 'CmdOrCtrl+Shift+H', click: () => { this.showGroups() } },
          { type: 'separator' },
          { role: 'close' },
          { role: 'minimize' }
        ]
      },
      {
        role: 'help',
        submenu: [
          { label: 'Learn More', click: () => { shell.openExternal('https://github.com/fiahfy/hosty') } }
        ]
      }
    ]

    if (process.platform === 'darwin') {
      template.unshift({
        label: app.getName(),
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { label: 'Preferences...', accelerator: 'CmdOrCtrl+,', click: () => { this.showSettings() } },
          { type: 'separator' },
          { role: 'services', submenu: [] },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      })

      // Edit menu
      template[2].submenu.push(
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' }
          ]
        }
      )

      // Window menu
      template[4].submenu.push(
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      )
    }

    return template
  }
  import () {
    dialog.showOpenDialog(
      {},
      (filenames) => {
        if (!filenames) {
          return
        }
        const filename = filenames[0]

        try {
          const groups = []//HostsFileManager.readGroupsFromFile(filename)
          this.window.webContents.send('sendGroups', { method: 'initialize', groups })
        } catch (e) {
          if (e instanceof TypeError) {
            this.window.webContents.send('sendMessage', {
              message: { text: 'Invalid hosty file' }
            })
          } else {
            this.window.webContents.send('sendMessage', {
              message: { text: 'Read file error' }
            })
          }
        }
      }
    )
  }
  add () {
    dialog.showOpenDialog(
      { properties: ['openFile', 'multiSelections'] },
      (filenames) => {
        if (!filenames) {
          return
        }

        try {
          const groups = []//HostsFileManager.readGroupsFromFiles(filenames)
          this.window.webContents.send('sendGroups', { method: 'add', groups })
        } catch (e) {
          if (e instanceof TypeError) {
            this.window.webContents.send('sendMessage', {
              message: { text: 'Invalid hosty file' }
            })
          } else {
            this.window.webContents.send('sendMessage', {
              message: { text: 'Read file error' }
            })
          }
        }
      }
    )
  }
  export () {
    dialog.showSaveDialog(
      { filters: [{ name: 'Hosty File', extensions: ['hosty'] }] },
      (filename) => {
        if (!filename) {
          return
        }

        ipcMain.once('sendGroups', (event, { groups }) => {
          try {
            // HostsFileManager.writeGroupsToFile(groups, filename)
            const groupLength = groups.length
            const hostLength = Group.getHostLength(groups)
            this.window.webContents.send('sendMessage', {
              message: { text: `Exported ${groupLength} group(s), ${hostLength} host(s)` }
            })
          } catch (e) {
            this.window.webContents.send('sendMessage', {
              message: { text: 'Write file error' }
            })
          }
        })
        this.window.webContents.send('requestGroups')
      }
    )
  }
  showGroups () {
    this.window.webContents.send('showGroupsWindow')
  }
  showSettings () {
    this.window.webContents.send('showSettingsWindow')
  }
  findHosts () {
    this.window.webContents.send('showPanel')
  }
  createGroup () {
    this.window.webContents.send('createGroup')
  }
  cutGroups () {
    this.window.webContents.send('cutGroups')
  }
  copyGroups () {
    this.window.webContents.send('copyGroups')
  }
  pasteGroups () {
    this.window.webContents.send('pasteGroups')
  }
  enableGroups () {
    this.window.webContents.send('enableGroups')
  }
  disableGroups () {
    this.window.webContents.send('disableGroups')
  }
  deleteGroups () {
    this.window.webContents.send('deleteGroups')
  }
  createHost () {
    this.window.webContents.send('createHost')
  }
  cutHosts () {
    this.window.webContents.send('cutHosts')
  }
  copyHosts () {
    this.window.webContents.send('copyHosts')
  }
  pasteHosts () {
    this.window.webContents.send('pasteHosts')
  }
  enableHosts () {
    this.window.webContents.send('enableHosts')
  }
  disableHosts () {
    this.window.webContents.send('disableHosts')
  }
  deleteHosts () {
    this.window.webContents.send('deleteHosts')
  }
}
