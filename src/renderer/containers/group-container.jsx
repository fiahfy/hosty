import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ActionCreators from '../actions';
import GroupList from '../components/group-list';

function mapStateToProps(state) {
  return { groups: state.groups };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class GroupContainer extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  static propTypes = {
    location: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    groups: PropTypes.arrayOf(PropTypes.object),
  };
  static defaultProps = {
    groups: [],
  };
  handleSelectGroups(groups) {
    const group = groups[0];
    const id = group ? group.id : 0;
    this.context.router.push({ query: { id } });
  }
  handleEditGroup(id, group) {
    this.props.actions.updateGroup(id, group);
  }
  handleAddGroup() {
    this.props.actions.createGroup({ enable: true });
    window.setTimeout(() => {
      this.groupList.focusLastGroup();
      const groups = this.groupList.getSortedGroups();
      const group = groups[groups.length - 1];
      this.context.router.push({ query: { id: group.id } });
    }, 0);
  }
  handleDeleteGroups() {
    const ids = this.groupList.getSortedGroups().map(group => group.id);
    const selectedIds = this.groupList.getSelectedGroups().map(group => group.id);
    this.context.router.push({ query: { id: 0 } });
    this.props.actions.deleteGroups(selectedIds);
    window.setTimeout(() => {
      if (selectedIds.length !== 1) {
        return;
      }
      const currentId = selectedIds[0];
      let [previous, next, isFound] = [0, 0, false];
      ids.forEach((id) => {
        if (isFound && !next) {
          next = id;
        }
        if (id === currentId) {
          isFound = true;
        }
        if (!isFound) {
          previous = id;
        }
      });
      const targetId = next || previous;
      if (!targetId) {
        return;
      }
      this.context.router.push({ query: { id: targetId } });
    }, 0);
  }
  renderGroupList() {
    const { groups, location } = this.props;
    const groupId = Number(location.query.id);

    return (
      <GroupList
        ref={(item) => { this.groupList = item; }}
        groupId={groupId}
        groups={groups}
        onEditGroup={(...args) => this.handleEditGroup(...args)}
        onSelectGroups={selectedGroups => this.handleSelectGroups(selectedGroups)}
        onAddGroup={() => this.handleAddGroup()}
        onDeleteGroups={() => this.handleDeleteGroups()}
      />
    );
  }
  render() {
    return (
      <div>
        {this.renderGroupList()}
      </div>
    );
  }
}
