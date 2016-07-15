import React, { PropTypes } from 'react'
import * as SvgIcons from 'material-ui/svg-icons'

export default function SortOrderIcon(props) {
  const { hidden, asc, style } = props
  if (hidden) {
    return null
  }
  return asc
    ? <SvgIcons.NavigationArrowDropDown style={style} />
    : <SvgIcons.NavigationArrowDropUp style={style} />
}

SortOrderIcon.propTypes = {
  hidden: React.PropTypes.bool,
  asc:    React.PropTypes.bool,
  style:  React.PropTypes.object,
}

SortOrderIcon.defaultProps = {
  hidden: false,
  asc:    true,
  style:  {},
}
