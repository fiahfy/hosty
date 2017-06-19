import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import Routes from '../routes';

const Root = ({ store, history }) => (
  <Provider store={store}>
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>
);

/* eslint-disable react/forbid-prop-types */
Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
/* eslint-enable react/forbid-prop-types */

export default Root;
