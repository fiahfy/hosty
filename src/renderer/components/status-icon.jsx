import React from 'react';
import PropTypes from 'prop-types';
import { SvgIcon } from 'material-ui';
import {
  DeviceSignalCellular4Bar,
  DeviceSignalCellularConnectedNoInternet4Bar,
} from 'material-ui/svg-icons';
import { colors } from 'material-ui/styles';

const StatusIcon = ({ valid, enable, ...others }) => {
  const Icon = valid
    ? DeviceSignalCellular4Bar
    : DeviceSignalCellularConnectedNoInternet4Bar;
  const color = enable ? colors.green400 : colors.grey400;
  return (
    <Icon
      {...others}
      color={color}
    />
  );
};

StatusIcon.propTypes = {
  valid: PropTypes.bool,
  enable: PropTypes.bool,
  ...SvgIcon.propTypes,
};

StatusIcon.defaultProps = {
  valid: false,
  enable: false,
  ...SvgIcon.defaultProps,
};

export default StatusIcon;
