import React, {Component, PropTypes} from 'react'
import {
  TextField, IconButton,
  TableRow, TableRowColumn
} from 'material-ui'
import * as SvgIcons from 'material-ui/svg-icons'
import * as Styles from 'material-ui/styles'
import validator from 'validator'
import isUpdateNeeded from '../utils/is-update-needed'

export default class GroupItem extends Component {
  static propTypes = {
    group:       PropTypes.object,
    selected:    PropTypes.bool,
    onEditGroup: PropTypes.func
  };
  static defaultProps = {
    group:       {},
    selected:    false,
    onEditGroup: () => {}
  };
  state = {
    editableField: null
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState)
  }
  handleToggleGroupStatus(e) {
    e.stopPropagation()
    const {group, onEditGroup} = this.props
    const newGroup = Object.assign({}, group)
    newGroup.enable = !newGroup.enable
    onEditGroup(newGroup)
  }
  handleEditGroup(e) {
    const {group, onEditGroup} = this.props
    const {name, value} = e.target
    const newGroup = Object.assign({}, group)
    newGroup[name] = value
    onEditGroup(newGroup)
    this.setState({editableField: null})
  }
  handleInputGroup(e) {
    if (e.keyCode === 13) {
      e.target.blur()
    }
  }
  renderNameField() {
    const {group} = this.props
    const {editableField} = this.state
    const defaultValue = 'Group name'

    if (editableField !== 'name') {
      const value = group.name || defaultValue
      const color = group.name ? 'inherit' : 'rgba(0, 0, 0, 0.298039)'
      return (
        <div
          style={{...styles.fieldLabel, color}}
          onDoubleClick={e => this.setState({editableField: 'name'})}
        >{value}</div>
      )
    }

    return (
      <TextField
        autoFocus={true}
        name="name"
        hintText={defaultValue}
        underlineShow={true}
        defaultValue={group.name}
        onClick={e => e.stopPropagation()}
        onBlur={::this.handleEditGroup}
        onKeyDown={::this.handleInputGroup}
        fullWidth={true}
      />
    )
  }
  renderIcon() {
    const {group} = this.props

    let errors = []

    let icon = <SvgIcons.DeviceSignalCellularConnectedNoInternet4Bar color={Styles.colors.yellow700} />
    if (!errors.length) {
      icon = group.enable
        ? <SvgIcons.DeviceSignalCellular4Bar color={Styles.colors.green600} />
        : <SvgIcons.DeviceSignalCellularOff color={Styles.colors.grey400} />
    }

    return (
      <IconButton onClick={::this.handleToggleGroupStatus}>
        {icon}
      </IconButton>
    )
  }
  render() {
    const {group, selected, ...others} = this.props

    return (
      <TableRow
        key={group.id}
        selected={selected}
        style={styles.row}
        {...others}
      >
        {others.children}
        <TableRowColumn style={styles.iconColumn}>
          {this.renderIcon()}
        </TableRowColumn>
        <TableRowColumn>
          {this.renderNameField()}
        </TableRowColumn>
      </TableRow>
    )
  }
}

const styles = {
  row: {
    cursor: 'pointer'
  },
  iconColumn: {
    width: 48,
    textAlign: 'center',
    paddingRight: 0
  },
  fieldLabel: {
    height: '100%',
    lineHeight: '48px',
    fontSize: 16,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}
