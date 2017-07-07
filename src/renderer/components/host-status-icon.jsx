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

const HostStatusIcon = ({ valid, enable, ...others }) => {
  if (!valid) {
    return (
      <SvgIcons.DeviceSignalCellularConnectedNoInternet4Bar
        {...others}
        color={colors.yellow700}
      />
    );
  }
  if (enable) {
    return (
      <SvgIcons.DeviceSignalCellular4Bar
        {...others}
        color={colors.green400}
      />
    );
  }
  return (
    <SvgIcons.DeviceSignalCellularOff
      {...others}
      color={colors.grey400}
      style={{ ...others.style, ...styles.off }}
    />
  );
};

HostStatusIcon.propTypes = {
  valid: PropTypes.bool,
  enable: PropTypes.bool,
  ...SvgIcons.propTypes,
};

HostStatusIcon.defaultProps = {
  valid: false,
  enable: false,
  ...SvgIcons.defaultProps,
};

export default HostStatusIcon;
