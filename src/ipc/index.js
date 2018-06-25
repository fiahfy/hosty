import { ipcRenderer, remote } from 'electron'

export const addIpcRendererListeners = (store) => {
  ipcRenderer.on('close', () => {
    store.dispatch('finalize')
  })
  ipcRenderer.on('enterFullScreen', () => {
    store.commit('setFullScreen', { fullScreen: true })
  })
  ipcRenderer.on('leaveFullScreen', () => {
    store.commit('setFullScreen', { fullScreen: false })
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
    store.dispatch('import', { filepath })
  })
  ipcRenderer.on('export', () => {
    const filepath = remote.dialog.showSaveDialog({
      filters: [{ name: 'Hosty File', extensions: ['hosty'] }]
    })
    if (!filepath) {
      return
    }
    store.dispatch('export', { filepath })
  })
}
