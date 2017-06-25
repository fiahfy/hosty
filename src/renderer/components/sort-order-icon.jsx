import React from 'react';
import PropTypes from 'prop-types';
import * as SvgIcons from 'material-ui/svg-icons';

const SortOrderIcon = ({ hidden, asc, style }) => {
  if (hidden) {
    return null;
  }
  return asc
    ? <SvgIcons.NavigationArrowDropDown style={style} />
    : <SvgIcons.NavigationArrowDropUp style={style} />;
};

SortOrderIcon.propTypes = {
  ...SvgIcons.propTypes,
  hidden: PropTypes.bool,
  asc: PropTypes.bool,
  style: PropTypes.object,
};

SortOrderIcon.defaultProps = {
  ...SvgIcons.defaultProps,
  hidden: false,
  asc: true,
  style: {},
};

export default SortOrderIcon;
