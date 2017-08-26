import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware, routerActions } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import rootReducer from './reducers';
import * as actions from './actions';
import hostsFileMiddleware from './middlewares/hosts-file-middleware';

const persistKeys = ['groups', 'settings'];

export default function configureStore(history, initialState = {}) {
  // Redux Configuration
  const middlewares = [];
  const enhancers = [];

  // Thunk Middleware
  middlewares.push(thunk);

  if (process.env.NODE_ENV !== 'production') {
    // Logging Middleware
    const logger = createLogger({
      level: 'info',
      collapsed: true,
    });
    middlewares.push(logger);
  }

  // Router Middleware
  const router = routerMiddleware(history);
  middlewares.push(router);

  // Hosts File
  middlewares.push(hostsFileMiddleware);

  // Redux DevTools Configuration
  const actionCreators = {
    ...actions,
    ...routerActions,
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
      actionCreators,
    })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middlewares));
  enhancers.push(autoRehydrate());
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);

  persistStore(store, { whitelist: persistKeys });

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
