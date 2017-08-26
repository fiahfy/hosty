import React from 'react';
import PropTypes from 'prop-types';
import { getMuiTheme } from 'material-ui/styles';

let DEFAULT_THEME;

function getDefaultTheme() {
  if (!DEFAULT_THEME) {
    DEFAULT_THEME = getMuiTheme();
  }
  return DEFAULT_THEME;
}

// @see https://github.com/callemall/material-ui/issues/4550
// @see https://github.com/facebook/react/issues/4936#issuecomment-179917137
export default function muiThemeable() {
  return (Component) => {
    const MuiComponent = (props, context) => {
      const { muiTheme = getDefaultTheme() } = context;

      return <Component muiTheme={muiTheme} ref={props.inputRef} {...props} />; // eslint-disable-line
    };

    MuiComponent.contextTypes = {
      muiTheme: PropTypes.object.isRequired,
    };
    MuiComponent.propTypes = {
      inputRef: PropTypes.func,
    };
    MuiComponent.defaultProps = {
      inputRef: () => {},
    };

    return MuiComponent;
  };
}
