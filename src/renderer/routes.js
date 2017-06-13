import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/app';
import AppContainer from './containers/app-container';
import SearchContainer from './containers/search-container';

/* eslint-disable react/jsx-filename-extension */
export default () => (
  <App>
    <Switch>
      <Route path="/search" component={SearchContainer} />
      <Route path="/" component={AppContainer} />
    </Switch>
  </App>
);
/* eslint-enable react/jsx-filename-extension */
