import { remote } from 'electron'

const { Menu } = remote

const appendInspectElementMenu = (e, template) => {
  const { clientX: x, clientY: y } = e

  if (template.length) {
    template = template.concat([{ type: 'separator' }])
  }
  return template.concat([{
    label: 'Inspect Element',
    click: () => {
      remote.getCurrentWindow().inspectElement(x, y)
    }
  }])
}

export const Role = {
  cut: 'Cut',
  copy: 'Copy',
  paste: 'Paste'
}

export const show = (e, template = []) => {
  e.preventDefault()
  e.stopPropagation()

  if (process.env.NODE_ENV !== 'production') {
    template = appendInspectElementMenu(e, template)
  }

  template = template.map((item) => {
    switch (item.role) {
      case Role.cut:
        return {
          label: item.role,
          click: () => document.execCommand('cut'),
          accelerator: 'CmdOrCtrl+X'
        }
      case Role.copy:
        return {
          label: item.role,
          click: () => document.execCommand('copy'),
          accelerator: 'CmdOrCtrl+C'
        }
      case Role.paste:
        return {
          label: item.role,
          click: () => document.execCommand('paste'),
          accelerator: 'CmdOrCtrl+V'
        }
      default:
        return item
    }
  })

  Menu
    .buildFromTemplate(template)
    .popup(remote.getCurrentWindow(), { async: true })
}
