import React, {Component, PropTypes} from 'react'
import {
  TextField, IconButton,
  TableRow, TableRowColumn
} from 'material-ui'
import * as SvgIcons from 'material-ui/svg-icons'
import * as Styles from 'material-ui/styles'
import validator from 'validator'

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
  }
  handleInputGroup(e) {
    if (e.keyCode === 13) {
      e.target.blur()
    }
  }
  render() {
    const {group, selected, ...others} = this.props

    let error = {}
    // if (!host.host || !host.host.length) {
    //   error.host = 'Missing Host'
    // }
    // if (!host.ip || !host.ip.length) {
    //   error.ip = 'Missing IP'
    // } else if (!validator.isIP(host.ip)) {
    //   error.ip = 'Invalid IP'
    // }

    let icon = <SvgIcons.ActionDone color={Styles.colors.green600} />
    if (error.name) {
      icon = <SvgIcons.AlertWarning color={Styles.colors.yellow600} />
    } else if (!group.enable) {
      icon = <SvgIcons.ActionDone color={Styles.colors.grey300} />
    }

    return (
      <TableRow
        key={group.index}
        selected={selected}
        {...others}
      >
        {others.children}
        <TableRowColumn style={styles.iconColumn}>
          <IconButton onClick={::this.handleToggleGroupStatus}>
            {icon}
          </IconButton>
        </TableRowColumn>
        <TableRowColumn>
          <TextField
            name="name"
            hintText="Group Name"
            underlineShow={!!error.name}
            defaultValue={group.name}
            onClick={e => e.stopPropagation()}
            onBlur={::this.handleEditGroup}
            onKeyDown={::this.handleInputGroup}
            errorText={error.name}
            fullWidth={true}
          />
        </TableRowColumn>
      </TableRow>
    )
  }
}

const styles = {
  iconColumn: {
    width: 48,
    textAlign: 'center',
    paddingLeft: 0,
    paddingRight: 0
  }
}
