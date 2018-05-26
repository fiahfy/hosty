import { ipcRenderer, remote } from 'electron'

export const addIpcRendererListeners = (store) => {
  ipcRenderer.on('willQuit', () => {
    store.dispatch('app/finalize')
  })
  ipcRenderer.on('showSettings', () => {
    store.dispatch('app/changeRoute', { name: 'settings' })
  })
  ipcRenderer.on('import', () => {
    const filepathes = remote.dialog.showOpenDialog({
      filters: [{ name: 'Hosty File', extensions: ['hosty'] }]
    })
    if (!filepathes) {
      return
    }
    const filepath = filepathes[0]
    store.dispatch('app/import', { filepath })
  })
  ipcRenderer.on('export', () => {
    const filepath = remote.dialog.showSaveDialog({
      filters: [{ name: 'Hosty File', extensions: ['hosty'] }]
    })
    if (!filepath) {
      return
    }
    store.dispatch('app/export', { filepath })
  })
}
