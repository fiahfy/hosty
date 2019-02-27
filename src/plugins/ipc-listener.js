import { ipcRenderer, remote } from 'electron'
import selector from '~/consts/selector'
import hosty from '~/utils/hosty'

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
    store.dispatch('focus', { selector: selector.QUERY_INPUT })
    store.dispatch('select', { selector: selector.QUERY_INPUT })
  })
  ipcRenderer.on('showExplorer', () => {
    store.$router.push('/explorer')
  })
  ipcRenderer.on('showSearch', () => {
    store.$router.push('/search')
    // wait dom updated
    setTimeout(() => {
      store.dispatch('focus', { selector: selector.QUERY_INPUT })
      store.dispatch('select', { selector: selector.QUERY_INPUT })
    }, 100)
  })
  ipcRenderer.on('showProblems', () => {
    store.$router.push('/problems')
  })
  ipcRenderer.on('showSettings', () => {
    store.$router.push('/settings')
  })
  ipcRenderer.on('import', () => {
    const filepaths = remote.dialog.showOpenDialog({
      filters: [{ name: 'Hosty File', extensions: [hosty.EXTENSION] }]
    })
    if (!filepaths || !filepaths.length) {
      return
    }
    const filepath = filepaths[0]
    store.dispatch('import', { filepath })
  })
  ipcRenderer.on('export', () => {
    const filepath = remote.dialog.showSaveDialog({
      filters: [{ name: 'Hosty File', extensions: [hosty.EXTENSION] }]
    })
    if (!filepath) {
      return
    }
    store.dispatch('export', { filepath })
  })
}
