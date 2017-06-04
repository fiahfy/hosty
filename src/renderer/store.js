import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import reducers from './reducers';
// import DevTools from './containers/dev-tools'
import hostsFileMiddleware from './middlewares/hosts-file-middleware';

const voidMiddleware = () => next => action => next(action);

function createReduxLoggerMiddleware() {
  if (process.env.NODE_ENV !== 'production') {
    return createLogger();
  }
  return voidMiddleware;
}

export default function configureStore(history, initialState = {}) {
  const reduxRouterMiddleware = routerMiddleware(history);
  const reduxLoggerMiddleware = createReduxLoggerMiddleware();

  const enhancer = compose(
    applyMiddleware(thunk, reduxRouterMiddleware, reduxLoggerMiddleware, hostsFileMiddleware),
    autoRehydrate(),
    // DevTools.instrument()  // TODO:
  );

  const rootReducer = combineReducers({
    ...reducers,
    routing: routerReducer,
  });

  const store = createStore(rootReducer, initialState, enhancer);

  persistStore(store, { whitelist: ['groups'] });

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
