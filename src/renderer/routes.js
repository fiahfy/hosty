import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/app';
import GroupContainer from './containers/group-container';
import HostContainer from './containers/host-container';

/* eslint-disable react/jsx-filename-extension */
// TODO: Fix initial route
export default (
  <Route path="/" component={App}>
    <IndexRoute components={{ sidebar: GroupContainer, content: HostContainer }} />
    <Route path="*" components={{ sidebar: GroupContainer, content: HostContainer }} />
  </Route>
);
/* eslint-enable react/jsx-filename-extension */
