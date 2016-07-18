import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './renderer/root'
import { configureStore } from './renderer/store'
import { setupListener } from './renderer/ipc-listener'
// @see http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import * as HostsFileManager from './renderer/utils/hosts-file-manager'


const store = configureStore()

setupListener(store)

// TODO:
HostsFileManager.setup()

ReactDOM.render(
  <Root store={store} />,
  document.querySelector('#app')
)
