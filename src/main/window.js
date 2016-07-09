import {app, shell, dialog, ipcMain, BrowserWindow, Menu} from 'electron'
import fs from 'fs'
import path from 'path'
import HostsManager from '../renderer/utils/hosts-manager'

export default class Window {
  constructor(application) {
    this.application = application
  }
  open(options) {
    options = options || {width: 820, height: 600}

    this.browserWindow = new BrowserWindow(options)

    this.browserWindow.loadURL(`file://${__dirname}/public/assets/index.html`)

    if (process.env.NODE_ENV === 'development') {
      this.browserWindow.webContents.openDevTools()
    }

    this.createMenu()

    this.handleEvents()
  }
  handleEvents() {
    this.browserWindow.on('close', () => {
      const settings = this.browserWindow.getBounds()
      this.application.saveWindowSettings(settings)
    })

    this.browserWindow.on('closed', () => {
      this.browserWindow = null
      this.application.removeWindow()
    })
  }
  createMenu() {
    const template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Import Hosty File...',
            accelerator: 'CmdOrCtrl+I',
            click: () => {
              dialog.showOpenDialog({filters: [{name: 'Hosty Setting File', extensions: ['hosty']}]}, pathes => {
                if (!pathes) {
                  return
                }
                const path = pathes[0]
                const data = fs.readFileSync(path, 'utf8')
                const groups = JSON.parse(data)
                this.browserWindow.webContents.send('receiveGroupsFromMain', {groups});
              })
            }
          },
          {
            label: 'Import Hosts Files to New Groups...',
            accelerator: 'Shift+CmdOrCtrl+I',
            click: () => {
              dialog.showOpenDialog({properties: ['openFile', 'multiSelections']}, pathes => {
                if (!pathes) {
                  return
                }
                pathes.forEach(selectedPath => {
                  const params = path.parse(selectedPath)
                  const data = fs.readFileSync(selectedPath, 'utf8')
                  const hosts = HostsManager.parseHosts(data)
                  this.browserWindow.webContents.send('receiveHostsFromMain', {name: params.name, hosts});
                })
              })
            }
          },
          {
            type: 'separator'
          },
          {
            label: 'Export Hosty File...',
            accelerator: 'CmdOrCtrl+E',
            click: () => {
              dialog.showSaveDialog({filters: [{name: 'Hosty Setting File', extensions: ['hosty']}]}, selectedPath => {
                if (!selectedPath) {
                  return
                }
                ipcMain.once('receiveGroupsFromRenderer', (event, {groups}) => {
                  const params = path.parse(selectedPath)
                  if (params.ext !== '.hosty') {
                    selectedPath += '.hosty'
                  }
                  fs.writeFileSync(selectedPath, JSON.stringify(groups) + '\n', 'utf8')
                })
                this.browserWindow.webContents.send('sendGroupsToMain');
              })
            }
          },
          {
            label: 'Export Hosts File...',
            accelerator: 'Shift+CmdOrCtrl+E',
            click: () => {
              dialog.showSaveDialog({}, path => {
                if (!path) {
                  return
                }
                ipcMain.once('receiveGroupsFromRenderer', (event, {groups}) => {
                  fs.writeFileSync(path, HostsManager.buildGroups(groups) + '\n', 'utf8')
                })
                this.browserWindow.webContents.send('sendGroupsToMain');
              })
            }
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo'
          },
          {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo'
          },
          {
            type: 'separator'
          },
          {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
          },
          {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
          },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
          },
          {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall'
          },
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: (item, focusedWindow) => {
              if (focusedWindow)
                focusedWindow.reload()
            }
          },
          {
            label: 'Toggle Full Screen',
            accelerator: (function() {
              if (process.platform == 'darwin')
                return 'Ctrl+Command+F'
              else
                return 'F11'
            })(),
            click: (item, focusedWindow) => {
              if (focusedWindow)
                focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
          },
          {
            label: 'Toggle Developer Tools',
            accelerator: (function() {
              if (process.platform == 'darwin')
                return 'Alt+Command+I'
              else
                return 'Ctrl+Shift+I'
            })(),
            click: (item, focusedWindow) => {
              if (focusedWindow)
                focusedWindow.webContents.toggleDevTools()
            }
          },
        ]
      },
      {
        label: 'Window',
        role: 'window',
        submenu: [
          {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
          },
          {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
          },
        ]
      },
      {
        label: 'Help',
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click: () => {
              shell.openExternal('http://electron.atom.io')
            }
          },
        ]
      },
    ]

    if (process.platform === 'darwin') {
      const name = app.getName()
      template.unshift({
        label: name,
        submenu: [
          {
            label: 'About ' + name,
            role: 'about'
          },
          {
            type: 'separator'
          },
          {
            label: 'Services',
            role: 'services',
            submenu: []
          },
          {
            type: 'separator'
          },
          {
            label: 'Hide ' + name,
            accelerator: 'Command+H',
            role: 'hide'
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Alt+H',
            role: 'hideothers'
          },
          {
            label: 'Show All',
            role: 'unhide'
          },
          {
            type: 'separator'
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: () => { app.quit() }
          },
        ]
      })
      // Window menu.
      template[3].submenu.push(
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          role: 'front'
        }
      )
    }

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }
}
