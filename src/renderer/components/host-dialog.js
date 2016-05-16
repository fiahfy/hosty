import React, {Component, PropTypes} from 'react'
import {Dialog, FlatButton, TextField} from 'material-ui'

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
    host:    '',
    ip:      '',
    message: ''
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
      ip:   ''
    })
  }
  handleChangeHost(e) {
    this.setState({host: e.target.value})
  }
  handleChangeIP(e) {
    this.setState({ip: e.target.value})
  }
  render() {
    const {open, onClickOK, onClickCancel, onRequestClose} = this.props
    const {host, ip} = this.state

    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onClick={onClickCancel}
      />,
      <FlatButton
        label="Add"
        primary={true}
        onClick={onClickOK}
      />
    ]

    return (
      <Dialog
        title="Set Host Config"
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={onRequestClose}
      >
        <TextField
          id="host"
          ref="host"
          fullWidth={true}
          floatingLabelText="Host"
          hintText="example.com"
          value={host}
          onChange={::this.handleChangeHost}
        />
        <TextField
          id="ip"
          ref="ip"
          fullWidth={true}
          floatingLabelText="IP"
          hintText="111.111.111.111"
          value={ip}
          onChange={::this.handleChangeIP}
        />
      </Dialog>
    )
  }
}
