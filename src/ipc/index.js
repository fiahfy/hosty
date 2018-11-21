import { ipcRenderer, remote } from 'electron'
import { Selector } from '~/store'

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
  ipcRenderer.on('find', () => {
    store.dispatch('focus', { selector: Selector.queryInput })
    store.dispatch('select', { selector: Selector.queryInput })
  })
  ipcRenderer.on('showExplorer', () => {
    store.dispatch('changeRoute', { name: 'explorer' })
  })
  ipcRenderer.on('showSearch', () => {
    store.dispatch('changeRoute', { name: 'search' })
    store.dispatch('focus', { selector: Selector.queryInput })
    store.dispatch('select', { selector: Selector.queryInput })
  })
  ipcRenderer.on('showProblems', () => {
    store.dispatch('changeRoute', { name: 'problems' })
  })
  ipcRenderer.on('showSettings', () => {
    store.dispatch('changeRoute', { name: 'settings' })
  })
  ipcRenderer.on('import', () => {
    const filepathes = remote.dialog.showOpenDialog({
      filters: [{ name: 'Hosty File', extensions: ['hosty'] }]
    })
    if (!filepathes || !filepathes.length) {
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
