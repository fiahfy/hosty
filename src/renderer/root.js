import React, { Component, PropTypes } from 'react'
import { Router } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import history from './history'
import routes from './routes'
// import DevTools from './dev-tools'

export default class Root extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  };
  render() {
    const { store } = this.props

    const syncHistory = syncHistoryWithStore(history, store)

    // TODO:
    // const hasDevTools = false
    // const devTools = hasDevTools ? <DevTools /> : null

    return (
      <Provider store={store} key="provider">
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Router history={syncHistory} routes={routes} />
        </MuiThemeProvider>
      </Provider>
    )
  }
}
