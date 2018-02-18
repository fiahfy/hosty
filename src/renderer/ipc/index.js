import { ipcRenderer, remote } from 'electron'
import * as HostsFileManager from '../utils/hosts-file-manager'

export const addIpcRendererListeners = (store) => {
  ipcRenderer.on('clearHosts', () => {
    store.dispatch('clearHosts')
  })
  ipcRenderer.on('showSettings', () => {
    store.dispatch('changeRoute', { name: 'settings' })
  })
  ipcRenderer.on('import', () => {
    remote.dialog.showOpenDialog(
      { filters: [{ name: 'Hosty File', extensions: ['hosty'] }] },
      (filepathes) => {
        if (!filepathes) {
          return
        }
        const filepath = filepathes[0]

        try {
          const groups = HostsFileManager.readHostyFile(filepath)
          store.dispatch('group/syncGroups', { groups })
        } catch (e) {
          //
        }
      }
    )
  })
  ipcRenderer.on('export', () => {
    remote.dialog.showSaveDialog(
      { filters: [{ name: 'Hosty File', extensions: ['hosty'] }] },
      (filepath) => {
        if (!filepath) {
          return
        }

        try {
          const groups = store.state.group.groups
          HostsFileManager.writeHostyFile(filepath, groups)
        } catch (e) {
          //
        }
      }
    )
  })
}
