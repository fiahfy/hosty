import { remote } from 'electron'

const { Menu } = remote

export default class ContextMenu {
  static get Role() {
    return {
      cut: 'Cut',
      copy: 'Copy',
      paste: 'Paste'
    }
  }
  static _appendInspectElementMenu(e, template) {
    const { clientX: x, clientY: y } = e

    if (template.length) {
      template = template.concat([{ type: 'separator' }])
    }

    return template.concat([
      {
        label: 'Inspect Element',
        click: () => remote.getCurrentWindow().inspectElement(x, y)
      }
    ])
  }
  static show(e, template = []) {
    if (process.env.NODE_ENV !== 'production') {
      template = ContextMenu._appendInspectElementMenu(e, template)
    }

    template = template.map((item) => {
      switch (item.role) {
        case ContextMenu.Role.cut:
          return {
            label: item.role,
            click: () => document.execCommand('cut'),
            accelerator: 'CmdOrCtrl+X'
          }
        case ContextMenu.Role.copy:
          return {
            label: item.role,
            click: () => document.execCommand('copy'),
            accelerator: 'CmdOrCtrl+C'
          }
        case ContextMenu.Role.paste:
          return {
            label: item.role,
            click: () => document.execCommand('paste'),
            accelerator: 'CmdOrCtrl+V'
          }
        default:
          return item
      }
    })

    if (!template.length) {
      return
    }

    Menu.buildFromTemplate(template).popup(remote.getCurrentWindow(), {
      async: true
    })
  }
  static showSimpleTextMenus(e) {
    ContextMenu.show(e, [
      { role: ContextMenu.Role.cut },
      { role: ContextMenu.Role.copy },
      { role: ContextMenu.Role.paste }
    ])
  }
}
