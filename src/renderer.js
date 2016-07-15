import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './renderer/root'
import {configureStore} from './renderer/store'

import {ipcRenderer} from 'electron'
import {bindActionCreators} from 'redux'
import * as ActionCreators from './renderer/actions'
import HostGroup from './renderer/utils/host-group'
import HostsFileManager from './renderer/utils/hosts-file-manager'

// @see http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

const store = configureStore()

ReactDOM.render(
  <Root store={store} />,
  document.querySelector('#app')
)

// TODO:
HostsFileManager.createSymlink()

ipcRenderer.on('sendGroups', (event, {mode, groups}) => {
  if (mode === 'add') {
    const actions = bindActionCreators(ActionCreators, store.dispatch)
    groups.forEach(group => {
      actions.createGroup(group)
    })

    const groupLength = groups.length
    const hostLength = HostGroup.getHostLength(groups)
    actions.createMessage({text: `Added ${groupLength} group(s), ${hostLength} host(s)`})

  } else if (mode === 'import') {
    const actions = bindActionCreators(ActionCreators, store.dispatch)
    actions.initializeGroups(groups)

    const groupLength = groups.length
    const hostLength = HostGroup.getHostLength(groups)
    actions.createMessage({text: `Imported ${groupLength} group(s), ${hostLength} host(s)`})
  }
})

ipcRenderer.on('requestGroups', (event) => {
  const groups = store.getState().groups
  event.sender.send('sendGroups', {groups})
})

ipcRenderer.on('sendMessage', (event, {message}) => {
  const actions = bindActionCreators(ActionCreators, store.dispatch)
  actions.createMessage(message)
})
