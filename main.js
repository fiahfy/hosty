const http = require('http')
const { app, ipcMain, shell, BrowserWindow, Menu } = require('electron')
const windowStateKeeper = require('electron-window-state')

const dev = process.env.NODE_ENV === 'development'
const port = process.env.PORT || 3000

let mainWindow = null
let quitting = false

const send = (...args) => {
  mainWindow && mainWindow.webContents.send(...args)
}

const createTemplate = () => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Import...',
          accelerator: 'CmdOrCtrl+O',
          click: () => send('import')
        },
        {
          label: 'Export...',
          accelerator: 'CmdOrCtrl+S',
          click: () => send('export')
        }
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
          label: 'Find...',
          accelerator: 'CmdOrCtrl+F',
          click: () => send('find')
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Explorer',
          accelerator: 'CmdOrCtrl+Shift+E',
          click: () => send('showExplorer')
        },
        {
          label: 'Search',
          accelerator: 'CmdOrCtrl+Shift+F',
          click: () => send('showSearch')
        },
        {
          label: 'Problems',
          accelerator: 'CmdOrCtrl+Shift+M',
          click: () => send('showProblems')
        },
        { type: 'separator' },
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
      submenu: [{ role: 'close' }, { role: 'minimize' }]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: () => shell.openExternal('https://github.com/fiahfy/hosty')
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          click: () => send('showSettings')
        },
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

    template.forEach((menu) => {
      if (menu.label === 'Edit') {
        menu.submenu.push(
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }]
          }
        )
      } else if (menu.role === 'window') {
        menu.submenu.push(
          { role: 'zoom' },
          { type: 'separator' },
          { role: 'front' }
        )
      }
    })
  }

  return template
}

const createWindow = async () => {
  let closing = false

  const windowState = windowStateKeeper({
    defaultWidth: 820,
    defaultHeight: 600
  })

  const options = {
    ...windowState,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  }

  const path = '#/explorer'

  mainWindow = new BrowserWindow(options)

  if (dev) {
    // Disable security warnings
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true

    // Install vue dev tool and open chrome dev tools
    const {
      default: installExtension,
      VUEJS_DEVTOOLS
    } = require('electron-devtools-installer')

    const name = await installExtension(VUEJS_DEVTOOLS.id)
    console.log(`Added Extension: ${name}`) // eslint-disable-line no-console

    // Wait for nuxt to build
    const url = `http://localhost:${port}/${path}`
    const pollServer = () => {
      http
        .get(url, (res) => {
          if (res.statusCode === 200) {
            mainWindow.loadURL(url)
            mainWindow.webContents.openDevTools()
          } else {
            setTimeout(pollServer, 300)
          }
        })
        .on('error', pollServer)
    }
    pollServer()
  } else {
    mainWindow.loadURL(`file://${__dirname}/app/index.html${path}`)
  }

  windowState.manage(mainWindow)

  const template = createTemplate()
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  mainWindow.on('close', (e) => {
    if (closing) {
      return
    }
    e.preventDefault()
    ipcMain.once('close', () => {
      closing = true
      mainWindow.close()
    })
    send('close')
  })
  mainWindow.on('closed', () => (mainWindow = null))
  mainWindow.on('enter-full-screen', () => send('enterFullScreen'))
  mainWindow.on('leave-full-screen', () => send('leaveFullScreen'))
}

app.on('ready', createWindow)
app.on('activate', () => mainWindow === null && createWindow())
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' || quitting) {
    app.quit()
  }
})
app.on('before-quit', () => (quitting = true))
