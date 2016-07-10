import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './renderer/root'
import {configureStore} from './renderer/store'

import {ipcRenderer} from 'electron'
import {bindActionCreators} from 'redux'
import * as ActionCreators from './renderer/actions'
import HostsManager from './renderer/utils/hosts-manager'

const store = configureStore()

ReactDOM.render(
  <Root store={store} />,
  document.querySelector('#app')
)

// TODO:
HostsManager.createSymlink()

ipcRenderer.on('sendGroup', (event, {group}) => {
  const actions = bindActionCreators(ActionCreators, store.dispatch)
  const hosts = group.hosts.map((host, i) => {
    host.id = i + 1
    return host
  })
  actions.createGroup({enable: true, name: group.name, hosts})
  actions.createMessage({text: 'Imported Hosts File'})
})

ipcRenderer.on('sendGroups', (event, {groups}) => {
  const actions = bindActionCreators(ActionCreators, store.dispatch)
  actions.initializeGroups(groups)
  actions.createMessage({text: 'Imported Hosty File'})
})

ipcRenderer.on('requestGroups', (event) => {
  const groups = store.getState()['groups']
  event.sender.send('sendGroups', {groups})
})

ipcRenderer.on('sendMessage', (event, {message}) => {
  const actions = bindActionCreators(ActionCreators, store.dispatch)
  actions.createMessage(message)
})
