import React, {Component, PropTypes} from 'react'
import {Router} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import {Provider} from 'react-redux'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import DevTools from './dev-tools'
import App from './app'
import history from '../history'
// import routes from '../routes'

export default class Root extends Component {
  static propTypes = {
    store:       PropTypes.object.isRequired,
    renderProps: PropTypes.object
  };
  render() {
    const {store, renderProps} = this.props

    const syncHistory = syncHistoryWithStore(history, store)
    //
    // const hasDevTools = false
    // const devTools = hasDevTools ? <DevTools /> : null
    //
    // let component = (
    //   <div>
    //     <Router render={(props) =>
    //       <ReduxAsyncConnect {...props} filter={item => !item.deferred} />
    //     } history={history}>
    //       {routes}
    //     </Router>
    //     {devTools}
    //   </div>
    // )
    // if (renderProps) {
    //   component = (
    //     <div>
    //       <ReduxAsyncConnect {...renderProps} />
    //     </div>
    //   )
    // }

    return (
      <Provider store={store} key="provider">
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <App history={syncHistory} />
        </MuiThemeProvider>
      </Provider>
    )
  }
}
