import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {RaisedButton, Toolbar, ToolbarGroup} from 'material-ui'
import * as ActionCreators from '../actions'
import HostList from '../components/host-list'

function mapStateToProps(state) {
  return {groups: state.groups}
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(ActionCreators, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HostContainer extends Component {
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
  handleAddHost() {
    this.props.actions.createHost(Number(this.props.location.query.id), {enable: true})
    window.setTimeout(() => {
      this.refs.hostList.focusLastHost()
    }, 0)
  }
  handleEditHost(id, host) {
    this.props.actions.updateHost(Number(this.props.location.query.id), id, host)
  }
  handleDeleteHosts() {
    const ids = this.refs.hostList.getSortedHosts().map(host => host.id)
    const selectedIds = this.refs.hostList.getSelectedHosts().map(host => host.id)
    this.refs.hostList.unselectAll()
    this.props.actions.deleteHosts(Number(this.props.location.query.id), selectedIds)
    window.setTimeout(() => {
      if (selectedIds.length !== 1) {
        return
      }
      const currentId = selectedIds[0]
      let [previous, next, isFound] = [0, 0, false]
      ids.forEach(id => {
        if (isFound && !next) {
          next = id
        }
        if (id === currentId) {
          isFound = true
        }
        if (!isFound) {
          previous = id
        }
      })
      const targetId = next ? next : previous
      if (!targetId) {
        return
      }
      this.refs.hostList.select([targetId])
    }, 0)
  }
  renderHostList() {
    const {groups, location} = this.props
    const groupId = Number(location.query.id)

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
    const groupId = Number(this.props.location.query.id)

    if (!groupId) {
      return (
        <div style={styles.messageContainer}>
          <div style={styles.message}>Select Group</div>
        </div>
      )
    }

    return (
      <div>
        {this.renderHostList()}
        <Toolbar style={styles.toolbar}>
          <ToolbarGroup firstChild={true}>
            <RaisedButton label="Add" onClick={::this.handleAddHost}
              primary={true} style={styles.button} />
            <RaisedButton label="Delete" onClick={::this.handleDeleteHosts}
              secondary={true} style={styles.button} />
          </ToolbarGroup>
        </Toolbar>
      </div>
    )
  }
}

const styles = {
  button: {
    marginLeft: 20,
    marginRight: 20
  },
  toolbar: {
    position: 'fixed',
    bottom: 0,
    left: 256,
    right: 0
  },
  messageContainer: {
    width: '100%',
    height: '100%',
    display: 'table'
  },
  message: {
    display: 'table-cell',
    textAlign: 'center',
    verticalAlign: 'middle',
    position: 'relative',
    color: 'grey'
  }
}
