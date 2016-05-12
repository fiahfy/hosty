import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Dialog, TextField, FlatButton, RaisedButton, Toolbar, ToolbarGroup} from 'material-ui'
// const injectTapEventPlugin = require("react-tap-event-plugin");
// injectTapEventPlugin();
import * as ActionCreators from '../actions'
import HostList from '../components/host-list'

function mapStateToProps(state) {
  return {hosts: state.hosts}
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(ActionCreators, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  state = {
    open: false
  };
  componentDidMount() {
  }
  handleOpenDialog() {
    this.setState({open: true})
  }
  handleCloseDialog() {
    this.setState({open: false})
  }
  handleAddHost() {
    const {hosts} = this.props
    const host = {
      host:   this.refs.host.getValue(),
      ip:     this.refs.ip.getValue(),
      enable: true
    }
    this.props.actions.createHost(host)
    this.handleCloseDialog()
  }
  handleEditHost(index, host) {
    this.props.actions.updateHost(index, host)
  }
  renderDialog() {
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onClick={::this.handleCloseDialog}
      />,
      <FlatButton
        label="Add"
        primary={true}
        onClick={::this.handleAddHost}
      />,
    ];

    return (
      <Dialog
        title="Set Host Config"
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={::this.handleCloseDialog}
      >
        <TextField id="host" ref="host" fullWidth={true}
          floatingLabelText="Host" hintText="example.com" />
        <TextField id="ip" ref="ip" fullWidth={true}
          floatingLabelText="IP" hintText="111.111.111.111" />
      </Dialog>
    )
  }
  render() {
    const {hosts} = this.props

    return (
      <div style={styles.app}>
      {this.renderDialog()}
        <HostList hosts={hosts} onEditHost={::this.handleEditHost} />
        <Toolbar style={styles.toolbar}>
          <ToolbarGroup firstChild={true}>
            <RaisedButton label="Add" onClick={::this.handleOpenDialog} primary={true} style={styles.button} />
            <RaisedButton label="Delete" onClick={::this.handleOpenDialog} secondary={true} style={styles.button} />
          </ToolbarGroup>
        </Toolbar>
      </div>
    )
  }
}

const styles = {
  app: {
    WebkitUserSelect: 'none',
    marginBottom: 56
  },
  button: {
    margin: 12
  },
  toolbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0
  }
}
