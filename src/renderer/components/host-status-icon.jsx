import React from 'react';
import PropTypes from 'prop-types';
import * as SvgIcons from 'material-ui/svg-icons';
import { colors } from 'material-ui/styles';

const styles = {
  off: {
    left: '1px',
    position: 'relative',
    top: '1px',
  },
};

const HostStatusIcon = ({ valid, enable, style, ...others }) => {
  if (!valid) {
    return (
      <SvgIcons.DeviceSignalCellularConnectedNoInternet4Bar
        {...others}
        color={colors.yellow700}
        style={style}
      />
    );
  }
  if (enable) {
    return (
      <SvgIcons.DeviceSignalCellular4Bar
        {...others}
        color={colors.green400}
        style={style}
      />
    );
  }
  return (
    <SvgIcons.DeviceSignalCellularOff
      {...others}
      color={colors.grey400}
      style={{ ...style, ...styles.off }}
    />
  );
};

HostStatusIcon.propTypes = {
  ...SvgIcons.propTypes,
  valid: PropTypes.bool,
  enable: PropTypes.bool,
};

HostStatusIcon.defaultProps = {
  ...SvgIcons.defaultProps,
  valid: false,
  enable: false,
};

export default HostStatusIcon;
