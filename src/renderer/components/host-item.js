import React, { Component, PropTypes } from 'react'
import {
  IconButton,
  TableRow, TableRowColumn,
} from 'material-ui'
import HostStatusIcon from './host-status-icon'
import EditableTextField from './editable-text-field'
import isUpdateNeeded from '../utils/is-update-needed'
import Host from '../utils/host'

export default class HostItem extends Component {
  static propTypes = {
    ...TableRow.propTypes,
    host: PropTypes.object,
    selected: PropTypes.bool,
    onEditHost: PropTypes.func,
  };
  static defaultProps = {
    host: {},
    selected: false,
    onEditHost: () => {},
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState)
  }
  focus() {
    this.refs[Host.KEY_HOST].focus()
  }
  handleClickIconButton(e) {
    e.stopPropagation()
    const { host, onEditHost } = this.props
    const newHost = Object.assign({}, host)
    newHost.enable = !newHost.enable
    onEditHost(newHost)
  }
  handleBlur(e) {
    const { host, onEditHost } = this.props
    const { name, value } = e.target
    const newHost = Object.assign({}, host)
    newHost[name] = value.trim()
    onEditHost(newHost)
  }
  handleKeyDown(e) {
    if (e.keyCode === 9 && !e.shiftKey && this.refs[Host.KEY_HOST].isFocused()) {
      e.preventDefault()
      e.target.blur()
      this.refs[Host.KEY_IP].focus()
      return
    }
    if (e.keyCode === 9 && e.shiftKey && this.refs[Host.KEY_IP].isFocused()) {
      e.preventDefault()
      e.target.blur()
      this.refs[Host.KEY_HOST].focus()
      return
    }
    if (e.keyCode === 13) {
      e.target.blur()
    }
  }
  render() {
    const { host, selected, onRowClick, ...others } = this.props
    delete others.onEditHost

    // const errors = Host.getErrorMessages(host)
    const invalid = !Host.isValid(host)

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
              invalid={invalid}
              enable={host.enable}
            />
          </IconButton>
        </TableRowColumn>
        <TableRowColumn>
          <EditableTextField
            name={Host.KEY_HOST}
            ref={Host.KEY_HOST}
            hintText="example.com"
            defaultValue={host.host}
            fullWidth
            onBlur={::this.handleBlur}
            onKeyDown={::this.handleKeyDown}
          />
        </TableRowColumn>
        <TableRowColumn>
          <EditableTextField
            name={Host.KEY_IP}
            ref={Host.KEY_IP}
            hintText="192.0.2.0"
            defaultValue={host.ip}
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
