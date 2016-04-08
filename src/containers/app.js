import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {asyncConnect} from 'redux-async-connect'
import * as ActionCreators from '../actions'
import {Dialog, TextField, FlatButton, RaisedButton, IconButton, Styles,
  Table, TableHeader, TableBody,
  TableRow, TableHeaderColumn, TableRowColumn} from 'material-ui'
  // const injectTapEventPlugin = require("react-tap-event-plugin");
  // injectTapEventPlugin();
import {ActionDone} from 'material-ui/lib/svg-icons'

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
    this.props.actions.readHosts()
  }
  handleOpenDialog() {
    this.setState({open: true})
  }
  handleCloseDialog() {
    this.setState({open: false})
  }
  handleAddHost() {
    this.props.actions.addHost({
      host: this.refs.host.getValue(),
      ip: this.refs.ip.getValue()
    })
    this.handleCloseDialog()
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
        <TextField id="host" ref="host" floatingLabelText="Host" hintText="example.com" fullWidth={true} />
        <TextField id="ip" ref="ip" floatingLabelText="IP" hintText="111.111.111.111" fullWidth={true} />
      </Dialog>
    )
  }
  render() {
    let hosts = [
      {host: 'dummy.com',  ip: '0.0.0.0'},
      {host: 'dummy2.com', ip: '0.0.0.1'},
    ];

    const hostNodes = this.props.hosts.map((host, index) => {
      return (
        <TableRow key={index}>
          <TableRowColumn style={styles.iconColumn}>
            <IconButton>
              <ActionDone color={Styles.Colors.green500} />
            </IconButton>
          </TableRowColumn>
          <TableRowColumn>{host.host}</TableRowColumn>
          <TableRowColumn>{host.ip}</TableRowColumn>
        </TableRow>
      )
    })

    return (
      <div>
        <div>
          <RaisedButton label="Add" onClick={::this.handleOpenDialog} />
          {this.renderDialog()}
        </div>
        <Table multiSelectable={true}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn style={styles.iconColumn}>Enable</TableHeaderColumn>
              <TableHeaderColumn>Host</TableHeaderColumn>
              <TableHeaderColumn>IP</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hostNodes}
          </TableBody>
        </Table>
      </div>
    )
  }
}

const styles = {
  iconColumn: {
    width: '72px'
  }
}
