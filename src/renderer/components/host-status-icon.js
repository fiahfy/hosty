import React, { PropTypes } from 'react'
import * as SvgIcons from 'material-ui/svg-icons'
import * as Styles from 'material-ui/styles'

export default function HostStatusIcon(props) {
  const { invalid, enable } = props
  if (invalid) {
    return (
      <SvgIcons.DeviceSignalCellularConnectedNoInternet4Bar
        color={Styles.colors.yellow700}
      />
    )
  }
  return enable
    ? <SvgIcons.DeviceSignalCellular4Bar color={Styles.colors.green600} />
    : <SvgIcons.DeviceSignalCellularOff color={Styles.colors.grey400} />
}

HostStatusIcon.propTypes = {
  invalid: PropTypes.bool,
  enable: PropTypes.bool,
}

HostStatusIcon.defaultProps = {
  invalid: false,
  enable: false,
}
