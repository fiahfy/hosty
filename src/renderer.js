import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {keyPrefix} from 'redux-persist/constants'
import {ipcRenderer} from 'electron'
import Root from './renderer/containers/root'
import {configureStore} from './renderer/store'

const store = configureStore()

ReactDOM.render(
  <Root store={store} />,
  document.querySelector('#app')
)

ipcRenderer.on('receiveHostsForImport', (event, arg) => {
  const groups = loadHosts()
  const maxId = groups.reduce((previous, group) => {
    return group.id > previous ? group.id : previous
  }, 0)
  saveHosts([...groups, {id: maxId + 1, hosts: arg}])
})

ipcRenderer.on('sendHostsForExport', (event, arg) => {
  const hosts = loadHosts()
  event.sender.send('receiveHostsForExport', hosts)
})

function loadHosts() {
  try {
    return JSON.parse(localStorage.getItem(keyPrefix + 'groups'))
  } catch (e) {
    return []
  }
}

function saveHosts(hosts) {
  localStorage.setItem(keyPrefix + 'groups', JSON.stringify(hosts))
}
