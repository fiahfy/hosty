import React, {Component, PropTypes} from 'react'
import {Router} from 'react-router'
import {Provider} from 'react-redux'
import {ReduxAsyncConnect} from 'redux-async-connect'
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
        <App />
      </Provider>
    )
  }
}
