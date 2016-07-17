import React, { Component, PropTypes } from 'react'
import {
  IconButton,
  TableRow, TableRowColumn,
} from 'material-ui'
import HostStatusIcon from './host-status-icon'
import EditableTextField from './editable-text-field'
import isUpdateNeeded from '../utils/is-update-needed'
import HostGroup from '../utils/host-group'

export default class GroupItem extends Component {
  static propTypes = {
    ...TableRow.propTypes,
    group: PropTypes.object,
    selected: PropTypes.bool,
    onEditGroup: PropTypes.func,
  };
  static defaultProps = {
    group: {},
    selected: false,
    onEditGroup: () => {},
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState)
  }
  focus() {
    this.refs[HostGroup.KEY_NAME].focus()
  }
  handleClickIconButton(e) {
    e.stopPropagation()
    const { group, onEditGroup } = this.props
    const newGroup = Object.assign({}, group)
    newGroup.enable = !newGroup.enable
    onEditGroup(newGroup)
  }
  handleBlur(e) {
    const { group, onEditGroup } = this.props
    const { name, value } = e.target
    const newGroup = Object.assign({}, group)
    newGroup[name] = value.trim()
    onEditGroup(newGroup)
  }
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      e.target.blur()
    }
  }
  render() {
    const { group, selected, onRowClick, ...others } = this.props
    delete others.onEditGroup

    const errors = []

    return (
      <TableRow
        key={group.id}
        style={styles.row}
        selected={selected}
        onRowClick={(...args) => {
          if (window.getSelection().toString().length) {
            return
          }
          onRowClick(...args)
        }}
        {...others}
      >
        {others.children}
        <TableRowColumn style={styles.iconColumn}>
          <IconButton onClick={::this.handleClickIconButton}>
            <HostStatusIcon
              invalid={!!errors.length}
              enable={group.enable}
            />
          </IconButton>
        </TableRowColumn>
        <TableRowColumn>
          <EditableTextField
            name={HostGroup.KEY_NAME}
            ref={HostGroup.KEY_NAME}
            hintText="Group name"
            defaultValue={group.name}
            fullWidth
            onBlur={::this.handleBlur}
            onKeyDown={::this.handleKeyDown}
          />
        </TableRowColumn>
      </TableRow>
    )
  }
}

const styles = {
  row: {
    cursor: 'pointer',
  },
  iconColumn: {
    width: 48,
    textAlign: 'center',
    paddingRight: 0,
  },
}
