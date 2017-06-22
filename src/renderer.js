import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'roboto-fontface/css/roboto/roboto-fontface.css';

import Root from './renderer/containers/root';
import history from './renderer/history';
import configureStore from './renderer/store';
import setupListener from './renderer/ipc-listener';
import * as HostsFileManager from './renderer/utils/hosts-file-manager';

(async function main() {
  // Needed for onTouchTap
  // @see http://stackoverflow.com/a/34015469/988941
  injectTapEventPlugin();

  const store = configureStore(history);

  setupListener(store, history);

  // TODO:
  await HostsFileManager.setup();

  const app = document.querySelector('#app'); // eslint-disable-line no-undef
  const renderApp = (RootComponent) => {
    render(
      /* eslint-disable react/jsx-filename-extension */
      <AppContainer>
        <RootComponent store={store} history={history} />
      </AppContainer>,
      /* eslint-enable react/jsx-filename-extension */
      app,
    );
  };

  renderApp(Root);

  if (module.hot) {
    module.hot.accept('./renderer/containers/root', () => {
      const nextRoot = require('./renderer/containers/root').default; // eslint-disable-line global-require
      renderApp(nextRoot);
    });
  }
}());
