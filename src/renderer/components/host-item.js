import React, {Component, PropTypes} from 'react'
import {
  TextField, IconButton,
  TableRow, TableRowColumn
} from 'material-ui'
import validator from 'validator'
import HostStatusIcon from './host-status-icon'
import EditableTextField from './editable-text-field'
import isUpdateNeeded from '../utils/is-update-needed'

export default class HostItem extends Component {
  static propTypes = {
    host:       PropTypes.object,
    selected:   PropTypes.bool,
    onEditHost: PropTypes.func
  };
  static defaultProps = {
    host:       {},
    selected:   false,
    onEditHost: () => {}
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState)
  }
  focus() {
    this.refs.hostTextField.focus()
  }
  handleClickIconButton(e) {
    e.stopPropagation()
    const {host, onEditHost} = this.props
    const newHost = Object.assign({}, host)
    newHost.enable = !newHost.enable
    onEditHost(newHost)
  }
  handleBlur(e) {
    const {host, onEditHost} = this.props
    const {name, value} = e.target
    const newHost = Object.assign({}, host)
    newHost[name] = value
    onEditHost(newHost)
  }
  handleKeyDown(e) {
    if (e.keyCode === 9 && !e.shiftKey && this.refs.hostTextField.isFocused()) {
      e.preventDefault()
      e.target.blur()
      this.refs.ipTextField.focus()
      return
    }
    if (e.keyCode === 9 && e.shiftKey && this.refs.ipTextField.isFocused()) {
      e.preventDefault()
      e.target.blur()
      this.refs.hostTextField.focus()
      return
    }
    if (e.keyCode === 13) {
      e.target.blur()
    }
  }
  render() {
    const {host, selected, onEditGroup, onRowClick, ...others} = this.props

    let errors = []
    if (!host.host || !host.host.length) {
      errors.push('Missing Host')
    }
    if (!host.ip || !host.ip.length) {
      errors.push('Missing IP')
    } else if (!validator.isIP(host.ip)) {
      errors.push('Invalid IP')
    }

    return (
      <TableRow
        key={host.id}
        selected={selected}
        style={styles.row}
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
              enable={host.enable}
            />
          </IconButton>
        </TableRowColumn>
        <TableRowColumn>
          <EditableTextField
            name="host"
            ref="hostTextField"
            hintText="example.com"
            defaultValue={host.host}
            fullWidth={true}
            onBlur={::this.handleBlur}
            onKeyDown={::this.handleKeyDown}
          />
        </TableRowColumn>
        <TableRowColumn>
          <EditableTextField
            name="ip"
            ref="ipTextField"
            hintText="192.0.2.0"
            defaultValue={host.ip}
            fullWidth={true}
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
    cursor: 'pointer'
  },
  iconColumn: {
    width: 48,
    textAlign: 'center',
    paddingRight: 0
  }
}
