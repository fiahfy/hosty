import { app, shell, Menu } from 'electron'

export default class MenuBuilder {
  constructor (window) {
    this.window = window
  }
  build () {
    const template = this.buildTemplate()
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }
  buildTemplate () {
    const template = [
      {
        label: 'File',
        submenu: [
          { label: 'Import...', accelerator: 'CmdOrCtrl+O', click: () => { this.window.sendMessage('import') } },
          { label: 'Export...', accelerator: 'CmdOrCtrl+S', click: () => { this.window.sendMessage('export') } }
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
          { role: 'selectall' }
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
          { label: 'Preferences...', accelerator: 'CmdOrCtrl+,', click: () => { this.window.sendMessage('showSettings') } },
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
              submenu: [
                { role: 'startspeaking' },
                { role: 'stopspeaking' }
              ]
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
}
