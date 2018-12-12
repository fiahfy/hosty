import { ipcRenderer, remote } from 'electron'
import { Selector } from '~/store'
import Hosty from '~/utils/hosty'

export default ({ store }) => {
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
    store.dispatch('changeRoute', '/explorer')
  })
  ipcRenderer.on('showSearch', () => {
    store.dispatch('changeRoute', '/search')
    store.dispatch('focus', { selector: Selector.queryInput })
    store.dispatch('select', { selector: Selector.queryInput })
  })
  ipcRenderer.on('showProblems', () => {
    store.dispatch('changeRoute', '/problems')
  })
  ipcRenderer.on('showSettings', () => {
    store.dispatch('changeRoute', '/settings')
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