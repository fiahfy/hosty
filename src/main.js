import {app, shell, dialog, ipcMain, BrowserWindow, Menu} from 'electron'
import fs from 'fs'
import path from 'path'
import HostsManager from './renderer/utils/hosts-manager'

const INIT_FILE = 'init.json'
const INIT_PATH = path.join(app.getPath('userData'), INIT_FILE)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

function createWindow() {
  let options = {width: 820, height: 600}

  const init = readInitFile()
  if (init && init.window) {
    options = init.window
  }

  // Create the browser window.
  mainWindow = new BrowserWindow(options)

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/public/assets/index.html`)

  if (process.env.NODE_ENV === 'development') {
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
  }

  createMenu()

  mainWindow.on('close', () => {
    const data = {window: mainWindow.getBounds()}
    writeInitFile(data)
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function readInitFile() {
  try {
    return JSON.parse(fs.readFileSync(INIT_PATH))
  } catch (e) {
    return null
  }
}

function writeInitFile(data) {
  fs.writeFileSync(INIT_PATH, JSON.stringify(data))
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        // {
        //   label: 'Import Hosts File to New Group...',
        //   accelerator: 'CmdOrCtrl+I',
        //   click: () => {
        //     dialog.showOpenDialog({}, pathes => {
        //       if (!pathes) {
        //         return
        //       }
        //       const path = pathes[0]
        //       const data = fs.readFileSync(path, 'utf8')
        //       console.log(path)
        //       console.log(data)
        //       const hosts = HostsManager.parseHosts(data)
        //       mainWindow.webContents.send('receiveHostsForImport', hosts);
        //     })
        //   }
        // },
        {
          label: 'Export Hosts File...',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            dialog.showSaveDialog({}, path => {
              if (!path) {
                return
              }
              ipcMain.once('receiveHostsForExport', (event, arg) => {
                fs.writeFileSync(path, HostsManager.buildHosts(arg) + '\n', 'utf8')
              })
              mainWindow.webContents.send('sendHostsForExport');
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
