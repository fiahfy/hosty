import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/app';
import AppContainer from './containers/app-container';
import SearchContainer from './containers/search-container';

/* eslint-disable react/jsx-filename-extension */
// TODO: Fix initial route
export default (
  <Route path="/" component={App}>
    <IndexRoute components={AppContainer} />
    <Route path="search" components={SearchContainer} />
    <Route path="*" components={AppContainer} />
  </Route>
);
/* eslint-enable react/jsx-filename-extension */
