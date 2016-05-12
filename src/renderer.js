import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './renderer/containers/root'
import {configureStore} from './renderer/store'

const store = configureStore()

ReactDOM.render(
  <Root store={store} />,
  document.querySelector('#app')
)
