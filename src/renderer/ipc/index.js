import { ipcRenderer, remote } from 'electron'

export const addIpcRendererListeners = (store) => {
  ipcRenderer.on('willQuit', () => {
    store.dispatch('clearHosts')
  })
  ipcRenderer.on('showSettings', () => {
    store.dispatch('changeRoute', { name: 'settings' })
  })
  ipcRenderer.on('import', () => {
    const filepathes = remote.dialog.showOpenDialog({
      filters: [{ name: 'Hosty File', extensions: ['hosty'] }]
    })
    if (!filepathes) {
      return
    }
    const filepath = filepathes[0]
    store.dispatch('importHosts', { filepath })
  })
  ipcRenderer.on('export', () => {
    const filepath = remote.dialog.showSaveDialog({
      filters: [{ name: 'Hosty File', extensions: ['hosty'] }]
    })
    if (!filepath) {
      return
    }
    store.dispatch('exportHosts', { filepath })
  })
}
