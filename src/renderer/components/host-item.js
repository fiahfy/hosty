import React, {Component, PropTypes} from 'react'
import {
  TextField, IconButton,
  TableRow, TableRowColumn
} from 'material-ui'
import * as SvgIcons from 'material-ui/svg-icons'
import * as Styles from 'material-ui/styles'
import validator from 'validator'

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
  state = {
    editableField: null
  };
  handleToggleHostStatus(e) {
    e.stopPropagation()
    const {host, onEditHost} = this.props
    const newHost = Object.assign({}, host)
    newHost.enable = !newHost.enable
    onEditHost(newHost)
  }
  handleEditHost(e) {
    const {host, onEditHost} = this.props
    const {name, value} = e.target
    const newHost = Object.assign({}, host)
    newHost[name] = value
    onEditHost(newHost)
    this.setState({editableField: null})
  }
  handleInputHost(e) {
    if (e.keyCode === 13) {
      e.target.blur()
    }
  }
  renderHostField() {
    const {host} = this.props
    const {editableField} = this.state

    if (editableField !== 'host') {
      return <div style={{height: '100%'}} onDoubleClick={e => this.setState({editableField: 'host'})}>{host.host}</div>
    }

        let error = {}
        if (!host.host || !host.host.length) {
          error.host = 'Missing Host'
        }
        if (!host.ip || !host.ip.length) {
          error.ip = 'Missing IP'
        } else if (!validator.isIP(host.ip)) {
          error.ip = 'Invalid IP'
        }

    return (
      <TextField
        autoFocus={true}
        name="host"
        hintText="example.com"
        underlineShow={!!error.host}
        defaultValue={host.host}
        onClick={e => e.stopPropagation()}
        onBlur={::this.handleEditHost}
        onKeyDown={::this.handleInputHost}
        errorText={error.host}
        fullWidth={true}
      />
    )
  }
  renderIPField() {
    const {host} = this.props
    const {editableField} = this.state

    if (editableField !== 'ip') {
      return <div style={{height: '100%'}} onDoubleClick={e => this.setState({editableField: 'ip'})}>{host.ip}</div>
    }

        let error = {}
        if (!host.host || !host.host.length) {
          error.host = 'Missing Host'
        }
        if (!host.ip || !host.ip.length) {
          error.ip = 'Missing IP'
        } else if (!validator.isIP(host.ip)) {
          error.ip = 'Invalid IP'
        }

    return (
      <TextField
        autoFocus={true}
        name="ip"
        hintText="192.0.2.0"
        underlineShow={!!error.ip}
        defaultValue={host.ip}
        onClick={e => e.stopPropagation()}
        onBlur={::this.handleEditHost}
        onKeyDown={::this.handleInputHost}
        errorText={error.ip}
        fullWidth={true}
      />
    )
  }
  render() {
    const {host, selected, ...others} = this.props

    let error = {}
    if (!host.host || !host.host.length) {
      error.host = 'Missing Host'
    }
    if (!host.ip || !host.ip.length) {
      error.ip = 'Missing IP'
    } else if (!validator.isIP(host.ip)) {
      error.ip = 'Invalid IP'
    }

    let icon = <SvgIcons.ActionDone color={Styles.colors.green600} />
    if (error.host || error.ip) {
      icon = <SvgIcons.AlertWarning color={Styles.colors.yellow600} />
    } else if (!host.enable) {
      icon = <SvgIcons.ActionDone color={Styles.colors.grey300} />
    }

    return (
      <TableRow
        key={host.index}
        selected={selected}
        {...others}
      >
        {others.children}
        <TableRowColumn style={styles.iconColumn}>
          <IconButton onClick={::this.handleToggleHostStatus}>
            {icon}
          </IconButton>
        </TableRowColumn>
        <TableRowColumn>
          {this.renderHostField()}
        </TableRowColumn>
        <TableRowColumn>
          {this.renderIPField()}
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