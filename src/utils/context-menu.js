import { remote } from 'electron'

const { Menu } = remote

const ROLES = {
  CUT: 'CUT',
  COPY: 'COPY',
  PASTE: 'PASTE'
}

const appendInspectElementMenu = (template) => {
  const { clientX: x, clientY: y } = window.event

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

const show = (template = []) => {
  if (process.env.NODE_ENV !== 'production') {
    template = appendInspectElementMenu(template)
  }

  template = template.map((item) => {
    switch (item.role) {
      case ROLES.CUT:
        return {
          label: item.role,
          click: () => document.execCommand('cut'),
          accelerator: 'CmdOrCtrl+X'
        }
      case ROLES.COPY:
        return {
          label: item.role,
          click: () => document.execCommand('copy'),
          accelerator: 'CmdOrCtrl+C'
        }
      case ROLES.PASTE:
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

const showSimpleTextMenus = () => {
  show([{ role: ROLES.CUT }, { role: ROLES.COPY }, { role: ROLES.PASTE }])
}

export default {
  ROLES,
  show,
  showSimpleTextMenus
}
