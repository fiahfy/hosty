import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {RaisedButton, Toolbar, ToolbarGroup, Drawer} from 'material-ui'
import fs from 'fs'
import path from 'path'
import * as ActionCreators from '../actions'
import HostList from '../components/host-list'
import GroupList from '../components/group-list'
import HostsManager from '../utils/hosts-manager'

function mapStateToProps(state) {
  return {groups: state.groups}
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(ActionCreators, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  static propTypes = {
    location: PropTypes.object.isRequired,
    actions:  PropTypes.object.isRequired,
    groups:   PropTypes.arrayOf(PropTypes.object)
  };
  static defaultProps = {
    groups: []
  };
  handleSelectGroups(groups) {
    const group = groups[0]
    const id = group ? group.id : 0
    this.context.router.push({query: {id: id}})
  }
  handleAddGroup() {
    this.props.actions.createGroup({})
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
    this.props.actions.createHost(Number(this.props.location.query.id), {})
  }
  handleEditHost(id, host) {
    this.props.actions.updateHost(Number(this.props.location.query.id), id, host)
  }
  handleDeleteHosts() {
    const ids = this.refs.hostList.selectedHosts().map(host => host.id)
    this.refs.hostList.unselect()
    this.props.actions.deleteHosts(Number(this.props.location.query.id), ids)
  }
  handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()

    Array.from(e.dataTransfer.files).forEach(file => {
      const params = path.parse(file.path)
      const data = fs.readFileSync(file.path, 'utf8')
      let hosts = HostsManager.parseHosts(data)
      if (!hosts.length) {
        return
      }
      hosts = hosts.map((host, i) => {
        host.id = i + 1
        return host
      })
      this.props.actions.createGroup({name: params.name, hosts})
    })
  }
  handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
  }
  renderGroupList() {
    const {groups, location} = this.props
    const groupId = Number(location.query.id)

    return (
      <GroupList
        ref="groupList"
        groupId={groupId}
        groups={groups}
        onEditGroup={::this.handleEditGroup}
        onSelectGroups={::this.handleSelectGroups}
      />
    )
  }
  renderHostList() {
    const {groups, location} = this.props
    const groupId = Number(location.query.id)

    if (!groupId) {
      return (
        <div style={styles.messageContainer}>
          <div style={styles.message}>Select Group</div>
        </div>
      )
    }

    const group = groups.filter(group => {
      return group.id === groupId
    })[0]
    const hosts = group ? group.hosts : []

    return (
      <HostList
        ref="hostList"
        groupId={groupId}
        hosts={hosts}
        onEditHost={::this.handleEditHost}
      />
    )
  }
  render() {
    return (
      <div
        style={styles.app}
        onDragOver={::this.handleDragOver}
        onDrop={::this.handleDrop}
      >
        <Drawer
          open={true}
          width={256}
          ref="drawer"
          className="group-container"
        >
          {this.renderGroupList()}
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
          {this.renderHostList()}
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
  },
  messageContainer: {
    width: '100%',
    height: '100%',
    display: 'table',
    paddingBottom: 56
  },
  message: {
    display: 'table-cell',
    textAlign: 'center',
    verticalAlign: 'middle',
    position: 'relative',
    color: 'grey'
  }
}
