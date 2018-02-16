import { ipcRenderer } from 'electron'

export const addIpcRendererListeners = (store) => {
  ipcRenderer.on('clearHosts', () => {
    store.dispatch('clearHosts')
  })
  ipcRenderer.on('showSettings', () => {
    store.dispatch('changeRoute', { name: 'settings' })
  })
}
