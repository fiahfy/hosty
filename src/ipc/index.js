import { ipcRenderer, remote } from 'electron'
import { Name } from '~/router'
import { Selector } from '~/store'
import Hosty from '~/utils/hosty'

export const addIpcRendererListeners = (store) => {
  ipcRenderer.on('close', async () => {
    await store.dispatch('finalize')
    ipcRenderer.send('close')
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
    store.dispatch('changeRoute', { name: Name.explorer })
  })
  ipcRenderer.on('showSearch', () => {
    store.dispatch('changeRoute', { name: Name.search })
    store.dispatch('focus', { selector: Selector.queryInput })
    store.dispatch('select', { selector: Selector.queryInput })
  })
  ipcRenderer.on('showProblems', () => {
    store.dispatch('changeRoute', { name: Name.problems })
  })
  ipcRenderer.on('showSettings', () => {
    store.dispatch('changeRoute', { name: Name.settings })
  })
  ipcRenderer.on('import', () => {
    const filepathes = remote.dialog.showOpenDialog({
      filters: [{ name: 'Hosty File', extensions: [Hosty.extension] }]
    })
    if (!filepathes || !filepathes.length) {
      return
    }
    const filepath = filepathes[0]
    store.dispatch('import', { filepath })
  })
  ipcRenderer.on('export', () => {
    const filepath = remote.dialog.showSaveDialog({
      filters: [{ name: 'Hosty File', extensions: [Hosty.extension] }]
    })
    if (!filepath) {
      return
    }
    store.dispatch('export', { filepath })
  })
}
