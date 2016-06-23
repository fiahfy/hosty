import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {RaisedButton, Toolbar, ToolbarGroup,
Drawer, MenuItem} from 'material-ui'
// const injectTapEventPlugin = require("react-tap-event-plugin")
// injectTapEventPlugin()
import * as ActionCreators from '../actions'
import HostList from '../components/host-list'
import HostDialog from '../components/host-dialog'
import {remote} from 'electron'

function mapStateToProps(state) {
  return {hosts: state.hosts}
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(ActionCreators, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  static propTypes = {
    hosts: PropTypes.arrayOf(PropTypes.object)
  };
  static defaultProps = {
    hosts: []
  };
  state = {
    open: false
  };
  handleOpenDialog() {
    this.setState({open: true})
  }
  handleCloseDialog() {
    this.setState({open: false})
  }
  handleAddHost() {
    const host = {
      host:   this.refs.hostDialog.getHost(),
      ip:     this.refs.hostDialog.getIP(),
      enable: true
    }
    this.props.actions.createHost(host)
    this.handleCloseDialog()
  }
  handleEditHost(index, host) {
    this.props.actions.updateHost(index, host)
  }
  handleDeleteHosts() {
    const indexes = this.refs.hostList.selectedHosts().map(host => host.index)
    this.refs.hostList.unselect()
    this.props.actions.deleteHosts(indexes)
  }
  componentDidMount() {
    const menu = new remote.Menu();
menu.append(new remote.MenuItem({label: 'MenuItem1', click() { console.log('item 1 clicked'); }}));
menu.append(new remote.MenuItem({type: 'separator'}));
menu.append(new remote.MenuItem({label: 'MenuItem2', type: 'checkbox', checked: true}));

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);
  }
  render() {
    const {hosts} = this.props
    const {open} = this.state

    return (
      <div style={styles.app}>
        <Drawer open={true}>
          <MenuItem>Menu Item</MenuItem>
          <MenuItem>Menu Item 3</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
        </Drawer>
        <HostDialog
          ref="hostDialog"
          open={open}
          onClickOK={::this.handleAddHost}
          onClickCancel={::this.handleCloseDialog}
          onRequestClose={::this.handleCloseDialog}
        />
        <div style={styles.container}>
          <HostList
            ref="hostList"
            hosts={hosts}
            onEditHost={::this.handleEditHost}
          />
        </div>
        {/*<Toolbar style={styles.toolbar}>
          <ToolbarGroup firstChild={true}>
            <RaisedButton label="Add" onClick={::this.handleOpenDialog} primary={true} style={styles.button} />
            <RaisedButton label="Delete" onClick={::this.handleDeleteHosts} secondary={true} style={styles.button} />
          </ToolbarGroup>
        </Toolbar>*/}
      </div>
    )
  }
}

const styles = {
  app: {
    // WebkitUserSelect: 'none',
    // paddingBottom: 56,
    overflow: 'hidden',
    height: '100%',
    boxSizing: 'border-box'
  },
  container: {
    overflow: 'auto',
    height: '100%',
    paddingLeft: '256px'
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
