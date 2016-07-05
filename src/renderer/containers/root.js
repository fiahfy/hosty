import React, {Component, PropTypes} from 'react'
import {Provider} from 'react-redux'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import DevTools from './dev-tools'
import App from './app'
import history from '../history'

export default class Root extends Component {
  static propTypes = {
    store:       PropTypes.object.isRequired,
    renderProps: PropTypes.object
  };
  render() {
    const {store, renderProps} = this.props

    // const hasDevTools = false
    // const devTools = hasDevTools ? <DevTools /> : null

    return (
      <Provider store={store} key="provider">
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <App history={history} />
        </MuiThemeProvider>
      </Provider>
    )
  }
}
