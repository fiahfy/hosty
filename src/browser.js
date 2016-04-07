import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './containers/root'
import {configureStore} from './store'
import history from './history'

const store = configureStore(history)

ReactDOM.render(
  <Root store={store} />,
  document.querySelector('#app')
)
