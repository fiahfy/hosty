import React from 'react';
import PropTypes from 'prop-types';
import * as SvgIcons from 'material-ui/svg-icons';
import * as Styles from 'material-ui/styles';

export default function HostStatusIcon(props) {
  const { invalid, enable, ...others } = props;
  if (invalid) {
    return (
      <SvgIcons.DeviceSignalCellularConnectedNoInternet4Bar
        {...others}
        color={Styles.colors.yellow600}
      />
    );
  }
  return enable
    ? <SvgIcons.DeviceSignalCellular4Bar {...others} color={Styles.colors.green400} />
    : <SvgIcons.DeviceSignalCellularOff {...others} color={Styles.colors.grey400} />;
}

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
