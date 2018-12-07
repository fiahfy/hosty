import { app, shell, BrowserWindow, Menu } from 'electron'
import windowStateKeeper from 'electron-window-state'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

let mainWindow

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

const createWindow = () => {
  const windowState = windowStateKeeper({
    defaultWidth: 820,
    defaultHeight: 600
  })

  const options = {
    ...windowState,
    titleBarStyle: 'hidden'
  }

  let url = `file://${__dirname}/app/index.html`

  if (process.env.HMR) {
    const port = process.env.PORT || 3000
    url = `http://localhost:${port}/index.html`
    options.webPreferences = {
      ...options.webPreferences,
      webSecurity: false
    }
  }

  url += '#/explorer'

  mainWindow = new BrowserWindow(options)
  mainWindow.loadURL(url)

  windowState.manage(mainWindow)

  const template = createTemplate()
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  if (process.env.NODE_ENV !== 'production') {
    installExtension(VUEJS_DEVTOOLS.id).catch((err) => {
      console.log('Unable to install `vue-devtools`: \n', err) // eslint-disable-line no-console
    })
    mainWindow.openDevTools()
  }

  mainWindow.on('close', () => {
    send('close')
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('enter-full-screen', () => {
    send('enterFullScreen')
  })

  mainWindow.on('leave-full-screen', () => {
    send('leaveFullScreen')
  })
}

app.on('ready', () => {
  createWindow()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
