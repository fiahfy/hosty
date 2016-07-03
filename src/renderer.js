import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {bindActionCreators} from 'redux'
import {ipcRenderer} from 'electron'
import Root from './renderer/containers/root'
import {configureStore} from './renderer/store'
import * as ActionCreators from './renderer/actions'
import HostsManager from './renderer/utils/hosts-manager'

HostsManager.createSymlink()

const store = configureStore()

ReactDOM.render(
  <Root store={store} />,
  document.querySelector('#app')
)

ipcRenderer.on('receiveHostsFromMain', (event, {name, hosts}) => {
  const actions = bindActionCreators(ActionCreators, store.dispatch)
  hosts = hosts.map((host, i) => {
    host.id = i + 1
    return host
  })
  actions.createGroup({name, hosts})
})

ipcRenderer.on('receiveGroupsFromMain', (event, {groups}) => {
  const actions = bindActionCreators(ActionCreators, store.dispatch)
  actions.initializeGroups(groups)
})

ipcRenderer.on('sendGroupsToMain', (event, arg) => {
  const groups = store.getState().groups
  event.sender.send('receiveGroupsFromRenderer', {groups})
})
