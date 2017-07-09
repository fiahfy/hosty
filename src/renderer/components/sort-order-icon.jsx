import React from 'react';
import PropTypes from 'prop-types';
import * as SvgIcons from 'material-ui/svg-icons';

const SortOrderIcon = ({ hidden, asc, ...others }) => {
  if (hidden) {
    return null;
  }
  return asc
    ? <SvgIcons.NavigationArrowDropDown {...others} />
    : <SvgIcons.NavigationArrowDropUp {...others} />;
};

SortOrderIcon.propTypes = {
  hidden: PropTypes.bool,
  asc: PropTypes.bool,
  ...SvgIcons.propTypes,
};

SortOrderIcon.defaultProps = {
  hidden: false,
  asc: true,
  ...SvgIcons.defaultProps,
};

export default SortOrderIcon;
