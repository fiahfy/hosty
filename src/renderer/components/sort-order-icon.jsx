import React from 'react';
import PropTypes from 'prop-types';
import { SvgIcon } from 'material-ui';
import { NavigationArrowDropDown, NavigationArrowDropUp } from 'material-ui/svg-icons';
import { muiThemeable } from 'material-ui/styles';

const SortOrderIcon = ({ hidden, asc, ...others }) => {
  if (hidden) {
    return null;
  }
  return asc
    ? <NavigationArrowDropDown {...others} />
    : <NavigationArrowDropUp {...others} />;
};

SortOrderIcon.propTypes = {
  hidden: PropTypes.bool,
  asc: PropTypes.bool,
  ...SvgIcon.propTypes,
};

SortOrderIcon.defaultProps = {
  hidden: false,
  asc: true,
  ...SvgIcon.defaultProps,
};

export default muiThemeable()(SortOrderIcon);
