import {createStore, applyMiddleware, compose, combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment'
// import persistState, {mergePersistedState} from 'redux-localstorage'
// import adapter from 'redux-localstorage/lib/adapters/localStorage'
// import filter from 'redux-localstorage-filter'
import {persistStore, autoRehydrate, createPersistor} from 'redux-persist'
import reducers from './reducers'
import DevTools from './containers/dev-tools'
import hostsManagementMiddleware from './middlewares/hosts-management-middleware'

const voidMiddleware = () => next => action => {
  next(action)
}

export function configureStore(initialState = {}) {
  let reduxLoggerMiddleware = voidMiddleware
  if (ExecutionEnvironment.canUseDOM) {
    reduxLoggerMiddleware = createLogger()
  }

  const finalCreateStore = compose(
    applyMiddleware(thunk),
    applyMiddleware(reduxLoggerMiddleware),
    autoRehydrate(),
    applyMiddleware(hostsManagementMiddleware),
    DevTools.instrument()
  )(createStore)

  const store = finalCreateStore(
    combineReducers({
      routing: routerReducer,
      ...reducers
    }),
    initialState
  )

  persistStore(store, {whitelist: ['groups']})

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
