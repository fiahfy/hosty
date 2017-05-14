import React from 'react';
import PropTypes from 'prop-types';
import * as SvgIcons from 'material-ui/svg-icons';
import * as Styles from 'material-ui/styles';

export default function HostStatusIcon(props) {
  const { invalid, enable } = props;
  if (invalid) {
    return (
      <SvgIcons.DeviceSignalCellularConnectedNoInternet4Bar
        color={Styles.colors.yellow600}
      />
    );
  }
  return enable
    ? <SvgIcons.DeviceSignalCellular4Bar color={Styles.colors.green400} />
    : <SvgIcons.DeviceSignalCellularOff color={Styles.colors.grey400} />;
}

HostStatusIcon.propTypes = {
  invalid: PropTypes.bool,
  enable: PropTypes.bool,
};

HostStatusIcon.defaultProps = {
  invalid: false,
  enable: false,
};
