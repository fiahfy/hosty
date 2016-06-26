import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {
  RaisedButton, Toolbar, ToolbarGroup,
  Drawer
} from 'material-ui'
// const injectTapEventPlugin = require("react-tap-event-plugin")
// injectTapEventPlugin()
import * as ActionCreators from '../actions'
import HostList from '../components/host-list'
import GroupList from '../components/group-list'

function mapStateToProps(state) {
  return {groups: state.groups}
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(ActionCreators, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  static propTypes = {
    groups: PropTypes.arrayOf(PropTypes.object)
  };
  static defaultProps = {
    groups: []
  };
  state = {
    groupId: 1
  };
  handleAddGroup() {
    this.props.actions.createGroup({
      name: '',
      hosts: [],
      enable: false
    })
  }
  handleEditGroup(id, group) {
    this.props.actions.updateGroup(id, group)
  }
  handleDeleteGroups() {
    const ids = this.refs.groupList.selectedGroups().map(group => group.id)
    this.refs.groupList.unselect()
    this.props.actions.deleteGroups(ids)
  }
  handleAddHost() {
    this.props.actions.createHost(this.state.groupId, {
      host: '',
      ip: '',
      enable: false
    })
  }
  handleEditHost(id, host) {
    this.props.actions.updateHost(this.state.groupId, id, host)
  }
  handleDeleteHosts() {
    const ids = this.refs.hostList.selectedHosts().map(host => host.id)
    this.refs.hostList.unselect()
    this.props.actions.deleteHosts(this.state.groupId, ids)
  }
  componentDidMount() {
    console.log(ReactDOM.findDOMNode(this.refs.drawer))
    // ReactDOM.findDOMNode(this.refs.drawer)
    window.addEventListener('scroll', (e) => {
console.log('scroll')
  e.stopPropagation()
  e.preventDefault()
    }, false)
  }
  render() {
    const {groups} = this.props
    const group = groups.filter(group => {
      return group.id === this.state.groupId
    })[0]
    const hosts = group ? group.hosts : []

    return (
      <div style={styles.app}>
        <Drawer open={true} ref="drawer">
          <GroupList
            ref="groupList"
            groups={groups}
            onEditGroup={::this.handleEditGroup}
          />
          <Toolbar style={styles.groupToolbar}>
            <ToolbarGroup firstChild={true}>
              <RaisedButton label="Add" onClick={::this.handleAddGroup}
                primary={true} style={styles.button} />
              <RaisedButton label="Delete" onClick={::this.handleDeleteGroups}
                secondary={true} style={styles.button} />
            </ToolbarGroup>
          </Toolbar>
        </Drawer>
        <div style={styles.hostContainer} className="host-container">
          <HostList
            ref="hostList"
            hosts={hosts}
            onEditHost={::this.handleEditHost}
          />
          <Toolbar style={styles.hostToolbar}>
            <ToolbarGroup firstChild={true}>
              <RaisedButton label="Add" onClick={::this.handleAddHost}
                primary={true} style={styles.button} />
              <RaisedButton label="Delete" onClick={::this.handleDeleteHosts}
                secondary={true} style={styles.button} />
            </ToolbarGroup>
          </Toolbar>
        </div>
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
  button: {
    marginLeft: 20,
    marginRight: 20
  },
  hostContainer: {
    overflow: 'auto',
    height: '100%',
    paddingLeft: 256
  },
  hostToolbar: {
    position: 'fixed',
    bottom: 0,
    left: 256,
    right: 0
  },
  groupToolbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0
  }
}
