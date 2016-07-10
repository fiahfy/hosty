import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {RaisedButton, Toolbar, ToolbarGroup} from 'material-ui'
import * as ActionCreators from '../actions'
import GroupList from '../components/group-list'

function mapStateToProps(state) {
  return {groups: state.groups}
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(ActionCreators, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class GroupContainer extends Component {
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
    this.context.router.push({query: {id}})
  }
  handleAddGroup() {
    this.props.actions.createGroup({enable: true})
    window.setTimeout(() => {
      this.refs.groupList.focusLastGroup()
      const groups = this.refs.groupList.getSortedGroups()
      const group = groups[groups.length - 1]
      this.context.router.push({query: {id: group.id}})
    }, 0)
  }
  handleEditGroup(id, group) {
    this.props.actions.updateGroup(id, group)
  }
  handleDeleteGroups() {
    const ids = this.refs.groupList.getSortedGroups().map(group => group.id)
    const selectedIds = this.refs.groupList.getSelectedGroups().map(group => group.id)
    this.context.router.push({query: {id: 0}})
    this.props.actions.deleteGroups(selectedIds)
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
      this.context.router.push({query: {id: targetId}})
    }, 0)
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
  render() {
    return (
      <div>
        {this.renderGroupList()}
        <Toolbar style={styles.toolbar}>
          <ToolbarGroup firstChild={true}>
            <RaisedButton label="Add" onClick={::this.handleAddGroup}
              primary={true} style={styles.button} />
            <RaisedButton label="Delete" onClick={::this.handleDeleteGroups}
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
    left: 0,
    right: 0
  }
}