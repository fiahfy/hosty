import React from 'react';
import PropTypes from 'prop-types';
import * as SvgIcons from 'material-ui/svg-icons';
import * as Styles from 'material-ui/styles';

const styles = {
  off: {
    left: '1px',
    position: 'relative',
    top: '1px',
  },
};

const HostStatusIcon = ({ invalid, enable, style, ...others }) => {
  if (invalid) {
    return (
      <SvgIcons.DeviceSignalCellularConnectedNoInternet4Bar
        {...others}
        color={Styles.colors.yellow600}
        style={style}
      />
    );
  }
  if (enable) {
    return (
      <SvgIcons.DeviceSignalCellular4Bar
        {...others}
        color={Styles.colors.green400}
        style={style}
      />
    );
  }
  return (
    <SvgIcons.DeviceSignalCellularOff
      {...others}
      color={Styles.colors.grey400}
      style={{ ...style, ...styles.off }}
    />
  );
};

HostStatusIcon.propTypes = {
  ...SvgIcons.propTypes,
  invalid: PropTypes.bool,
  enable: PropTypes.bool,
};

HostStatusIcon.defaultProps = {
  ...SvgIcons.defaultProps,
  invalid: false,
  enable: false,
};

export default HostStatusIcon;
