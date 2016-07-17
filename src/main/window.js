import { app, shell, dialog, ipcMain, BrowserWindow, Menu } from 'electron'
import fs from 'fs'
import path from 'path'
import * as HostGroup from '../renderer/utils/host-group'
import * as Host from '../renderer/utils/host'

export default class Window {
  constructor(application) {
    this.application = application
  }
  open(options) {
    const newOptions = options || { width: 820, height: 600 }

    this.browserWindow = new BrowserWindow(newOptions)

    this.browserWindow.loadURL(`file://${__dirname}/app/index.html`)

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
              dialog.showOpenDialog(
                { filters: [{ name: 'Hosty File', extensions: ['hosty'] }] },
                filenames => {
                  if (!filenames) {
                    return
                  }

                  const filename = filenames[0]
                  const data = fs.readFileSync(filename, 'utf8')
                  try {
                    const groups = JSON.parse(data)
                    this.browserWindow.webContents.send('sendGroups', { mode: 'import', groups })
                  } catch (e) {
                    this.browserWindow.webContents.send('sendMessage', {
                      message: { text: 'Invalid Hosty file' },
                    })
                  }
                }
              )
            },
          },
          {
            label: 'Add Groups from Hosts Files...',
            accelerator: 'Shift+CmdOrCtrl+I',
            click: () => {
              dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }, filenames => {
                if (!filenames) {
                  return
                }

                const groups = filenames
                  .map(filename => {
                    const params = path.parse(filename)
                    const data = fs.readFileSync(filename, 'utf8')
                    let hosts = Host.parse(data)
                    if (!hosts.length) {
                      return null
                    }
                    hosts = hosts.map((host, i) => {
                      const newHost = Object.assign({}, host)
                      newHost.id = i + 1
                      return newHost
                    })
                    return { enable: true, name: params.name, hosts }
                  })
                  .filter(item => !!item)

                this.browserWindow.webContents.send('sendGroups', { mode: 'add', groups })
              })
            },
          },
          {
            type: 'separator',
          },
          {
            label: 'Export Hosty File...',
            accelerator: 'CmdOrCtrl+E',
            click: () => {
              dialog.showSaveDialog(
                { filters: [{ name: 'Hosty File', extensions: ['hosty'] }] },
                filename => {
                  if (!filename) {
                    return
                  }

                  ipcMain.once('sendGroups', (event, { groups }) => {
                    const params = path.parse(filename)
                    let filenameWithExtension = filename
                    if (params.ext !== '.hosty') {
                      filenameWithExtension += '.hosty'
                    }

                    fs.writeFileSync(filenameWithExtension, `${JSON.stringify(groups)}\n`, 'utf8')
                    const groupLength = groups.length
                    const hostLength = HostGroup.getHostLength(groups)
                    this.browserWindow.webContents.send('sendMessage', {
                      message: { text: `Exported ${groupLength} group(s), ${hostLength} host(s)` },
                    })
                  })
                  this.browserWindow.webContents.send('requestGroups')
                }
              )
            },
          },
          {
            label: 'Export Hosts File...',
            accelerator: 'Shift+CmdOrCtrl+E',
            click: () => {
              dialog.showSaveDialog({}, filename => {
                if (!filename) {
                  return
                }

                ipcMain.once('sendGroups', (event, { groups }) => {
                  fs.writeFileSync(filename, `${HostGroup.build(groups)}\n`, 'utf8')
                  const groupLength = groups.length
                  const hostLength = HostGroup.getHostLength(groups)
                  this.browserWindow.webContents.send('sendMessage', {
                    message: { text: `Exported ${groupLength} group(s), ${hostLength} host(s)` },
                  })
                })
                this.browserWindow.webContents.send('requestGroups')
              })
            },
          },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo',
          },
          {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo',
          },
          {
            type: 'separator',
          },
          {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut',
          },
          {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy',
          },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste',
          },
          {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall',
          },
        ],
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: (item, focusedWindow) => {
              if (focusedWindow) {
                focusedWindow.reload()
              }
            },
          },
          {
            label: 'Toggle Full Screen',
            accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
            click: (item, focusedWindow) => {
              if (focusedWindow) {
                focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
              }
            },
          },
          {
            label: 'Toggle Developer Tools',
            accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
            click: (item, focusedWindow) => {
              if (focusedWindow) {
                focusedWindow.webContents.toggleDevTools()
              }
            },
          },
        ],
      },
      {
        label: 'Window',
        role: 'window',
        submenu: [
          {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize',
          },
          {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close',
          },
        ],
      },
      {
        label: 'Help',
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click: () => {
              shell.openExternal('https://github.com/fiahfy/hosty')
            },
          },
        ],
      },
    ]

    if (process.platform === 'darwin') {
      const name = app.getName()
      template.unshift({
        label: name,
        submenu: [
          {
            label: `About ${name}`,
            role: 'about',
          },
          {
            type: 'separator',
          },
          {
            label: 'Services',
            role: 'services',
            submenu: [],
          },
          {
            type: 'separator',
          },
          {
            label: `Hide ${name}`,
            accelerator: 'Command+H',
            role: 'hide',
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Alt+H',
            role: 'hideothers',
          },
          {
            label: 'Show All',
            role: 'unhide',
          },
          {
            type: 'separator',
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: () => { app.quit() },
          },
        ],
      })
      // Window menu.
      template[3].submenu.push(
        {
          type: 'separator',
        },
        {
          label: 'Bring All to Front',
          role: 'front',
        }
      )
    }

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }
}
