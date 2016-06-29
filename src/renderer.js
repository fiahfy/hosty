import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {bindActionCreators} from 'redux'
import {ipcRenderer} from 'electron'
import Root from './renderer/containers/root'
import {configureStore} from './renderer/store'
import * as ActionCreators from './renderer/actions'

const store = configureStore()

ReactDOM.render(
  <Root store={store} />,
  document.querySelector('#app')
)

ipcRenderer.on('receiveHostsForImport', (event, arg) => {
  const actions = bindActionCreators(ActionCreators, store.dispatch)
  const hosts = arg.map((host, i) => {
    host.id = i + 1
    return host
  })
  actions.createGroup({hosts})
})

ipcRenderer.on('sendHostsForExport', (event, arg) => {
  event.sender.send('receiveHostsForExport', store.getState().groups)
})
