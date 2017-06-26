import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/app';
import MainContainer from './containers/main-container';
import SearchContainer from './containers/search-container';
import SettingsContainer from './containers/settings-container';

/* eslint-disable react/jsx-filename-extension */
export default () => (
  <App>
    <Switch>
      <Route path="/settings" component={SettingsContainer} />
      <Route path="/search" component={SearchContainer} />
      <Route path="/" component={MainContainer} />
    </Switch>
  </App>
);
/* eslint-enable react/jsx-filename-extension */
