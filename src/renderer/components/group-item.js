import React, { Component, PropTypes } from 'react'
import {
  TextField, IconButton,
  TableRow, TableRowColumn,
} from 'material-ui'
import validator from 'validator'
import HostStatusIcon from './host-status-icon'
import EditableTextField from './editable-text-field'
import isUpdateNeeded from '../utils/is-update-needed'

export default class GroupItem extends Component {
  static propTypes = {
    group:       PropTypes.object,
    selected:    PropTypes.bool,
    onEditGroup: PropTypes.func,
  };
  static defaultProps = {
    group:       {},
    selected:    false,
    onEditGroup: () => {},
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState)
  }
  focus() {
    this.refs.nameTextField.focus()
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
    newGroup[name] = value
    onEditGroup(newGroup)
  }
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      e.target.blur()
    }
  }
  render() {
    const { group, selected, onEditGroup, onRowClick, ...others } = this.props

    let errors = []

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
            name="name"
            ref="nameTextField"
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
