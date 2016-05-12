import {createStore, applyMiddleware, compose, combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment'
import persistState, {mergePersistedState} from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import filter from 'redux-localstorage-filter';
import reducers from './reducers'
import DevTools from './containers/dev-tools'

const voidMiddleware = () => next => action => {
  next(action)
}

export function configureStore(initialState = {}) {
  let reduxLoggerMiddleware = voidMiddleware
  if (ExecutionEnvironment.canUseDOM) {
    reduxLoggerMiddleware = createLogger()
  }

  const storage = compose(
    filter('hosts')
  )(adapter(window.localStorage));

  const finalCreateStore = compose(
    applyMiddleware(thunk),
    applyMiddleware(reduxLoggerMiddleware),
    persistState(storage, 'my-storage-key'),
    DevTools.instrument()
  )(createStore)

  const store = finalCreateStore(
    compose(
      mergePersistedState()
    )(combineReducers({
      routing: routerReducer,
      ...reducers
    })),
    initialState
  )

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
