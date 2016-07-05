import {createStore, applyMiddleware, compose, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment'
import {persistStore, autoRehydrate, createPersistor} from 'redux-persist'
import reducers from './reducers'
import DevTools from './containers/dev-tools'
import hostsManagementMiddleware from './middlewares/hosts-management-middleware'

const voidMiddleware = () => next => action => {
  next(action)
}

export function configureStore(initialState = {}) {
  let reduxLoggerMiddleware = voidMiddleware
  if (process.env.NODE_ENV === 'development') {
    reduxLoggerMiddleware = createLogger()
  }

  const finalCreateStore = compose(
    applyMiddleware(thunk),
    applyMiddleware(reduxLoggerMiddleware),
    autoRehydrate(),
    applyMiddleware(hostsManagementMiddleware),
    DevTools.instrument()
  )(createStore)

  const store = finalCreateStore(combineReducers(reducers), initialState)

  persistStore(store, {whitelist: ['groups']})

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
