import {routerMiddleware, routerReducer as routing} from 'react-router-redux'
import {createStore, applyMiddleware, compose, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import {persistStore, autoRehydrate, createPersistor} from 'redux-persist'
import reducers from './reducers'
// import DevTools from './containers/dev-tools'
import hostsManagementMiddleware from './middlewares/hosts-management-middleware'
import history from './history'

const voidMiddleware = () => next => action => {
  return next(action)
}

function createReduxLoggerMiddleware() {
  if (process.env.NODE_ENV === 'development') {
    return createLogger()
  }
  return voidMiddleware
}

const router = routerMiddleware(history)

const enhancer = compose(
  applyMiddleware(thunk, router, createReduxLoggerMiddleware(), hostsManagementMiddleware),
  autoRehydrate(),
  // DevTools.instrument()  // TODO:
)

const rootReducer = combineReducers({
  ...reducers,
  routing
})

export function configureStore(initialState = {}) {
  const store = createStore(rootReducer, initialState, enhancer)

  persistStore(store, {whitelist: ['groups']})

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
