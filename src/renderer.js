import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './renderer/containers/root'
import {configureStore} from './renderer/store'
import history from './renderer/history'

const store = configureStore(history)

ReactDOM.render(
  <Root store={store} />,
  document.querySelector('#app')
)
