import React, {Component, PropTypes} from 'react'
import {Dialog, FlatButton, TextField} from 'material-ui'
import validator from 'validator'

export default class HostDialog extends Component {
  static propTypes = {
    open:           PropTypes.bool,
    onClickOK:      PropTypes.func,
    onClickCancel:  PropTypes.func,
    onRequestClose: PropTypes.func
  };
  static defaultProps = {
    open:           false,
    onClickOK:      () => {},
    onClickCancel:  () => {},
    onRequestClose: () => {}
  };
  state = {
    host:  '',
    ip:    '',
    error: {
      host: '',
      ip:   ''
    }
  };
  getHost() {
    return this.refs.host.getValue()
  }
  getIP() {
    return this.refs.ip.getValue()
  }
  clear() {
    this.setState({
      host: '',
      ip:   '',
      error: {
        host: '',
        ip:   ''
      }
    })
  }
  handleChangeHost(e) {
    this.setState({host: e.target.value})
  }
  handleChangeIP(e) {
    this.setState({ip: e.target.value})
  }
  handleRequestClose() {
    const {onRequestClose} = this.props
    this.clear()
    onRequestClose()
  }
  handleClickCancel() {
    const {onClickCancel} = this.props
    this.clear()
    onClickCancel()
  }
  handleClickOK() {
    const {onClickOK} = this.props
    const {host, ip, error} = this.state

    let isValid = true
    if (!host.length) {
      isValid = false
      error.host = 'This field is required'
      this.setState({error})
    }
    if (!ip.length) {
      isValid = false
      error.ip = 'This field is required'
      this.setState({error})
    } else if (!validator.isIP(ip)) {
      isValid = false
      error.ip = 'Invalid IP'
      this.setState({error})
    }
    if (isValid) {
      this.clear()
      onClickOK()
    }
  }
  render() {
    const {open} = this.props
    const {host, ip, error} = this.state

    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onClick={::this.handleClickCancel}
      />,
      <FlatButton
        label="Add"
        primary={true}
        onClick={::this.handleClickOK}
      />
    ]

    return (
      <Dialog
        title="Set Host Config"
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={::this.handleRequestClose}
      >
        <TextField
          id="host"
          ref="host"
          fullWidth={true}
          floatingLabelText="Host"
          hintText="example.com"
          errorText={error.host}
          value={host}
          onChange={::this.handleChangeHost}
        />
        <TextField
          id="ip"
          ref="ip"
          fullWidth={true}
          floatingLabelText="IP"
          hintText="111.111.111.111"
          errorText={error.ip}
          value={ip}
          onChange={::this.handleChangeIP}
        />
      </Dialog>
    )
  }
}
