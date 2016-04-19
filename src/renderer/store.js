import {createStore, applyMiddleware, compose, combineReducers} from 'redux'
import {routeReducer, syncHistory} from 'react-router-redux'
import {reducer as reduxAsyncConnect} from 'redux-async-connect'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment'
import reducers from './reducers'
import DevTools from './containers/dev-tools'
import persistState, {mergePersistedState} from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import filter from 'redux-localstorage-filter';

const voidMiddleware = () => next => action => {
  next(action)
}

export function configureStore(history, initialState = {}) {
  let reduxLoggerMiddleware = voidMiddleware
  if (ExecutionEnvironment.canUseDOM) {
    reduxLoggerMiddleware = createLogger()
  }

  const reduxRouterMiddleware = syncHistory(history)

  const storage = compose(
    filter('hosts')
  )(adapter(window.localStorage));

  const finalCreateStore = compose(
    applyMiddleware(thunk),
    applyMiddleware(reduxRouterMiddleware),
    applyMiddleware(reduxLoggerMiddleware),
    persistState(storage, 'my-storage-key'),
    DevTools.instrument()
  )(createStore)

  const store = finalCreateStore(
    compose(
      mergePersistedState()
    )(combineReducers({
      routing: routeReducer,
      reduxAsyncConnect,
      ...reducers
    })),
    initialState
  )

  reduxRouterMiddleware.listenForReplays(store)

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
