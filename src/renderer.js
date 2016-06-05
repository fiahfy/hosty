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

ipcRenderer.on('sendHosts', (event, arg) => {
  const hosts = loadHosts()
  event.sender.send('receiveHosts', hosts)
})

function loadHosts() {
  try {
    return JSON.parse(localStorage.getItem(keyPrefix + 'hosts'))
  } catch (e) {
    return []
  }
}
