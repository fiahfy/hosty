import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Drawer } from 'material-ui';
import * as ActionCreators from '../actions';
import GroupList from '../components/group-list';
import HostList from '../components/host-list';

const styles = {
  container: {
    boxSizing: 'border-box',
    height: '100%',
    overflow: 'hidden',
  },
  drawer: {
    borderRight: '1px solid rgb(224, 224, 224)',
    boxShadow: 'none',
  },
  content: {
    height: '100%',
    overflow: 'auto',
    paddingLeft: '256px',
  },
  contentContainer: {
    display: 'table',
    height: '100%',
    width: '100%',
  },
  message: {
    color: 'grey',
    display: 'table-cell',
    position: 'relative',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
};

function mapStateToProps(state) {
  return { groups: state.groups };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MainContainer extends Component {
  static propTypes = {
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    actions: PropTypes.object.isRequired,
  };
  get groupId() {
    const selectedGroup = this.props.groups.find(group => group.selected);
    return selectedGroup ? selectedGroup.id : 0;
  }
  get hosts() {
    const selectedGroup = this.props.groups.find(group => group.selected);
    return selectedGroup.hosts;
  }
  handleAddGroup() {
    this.props.actions.createGroup({ enable: true });
    window.setTimeout(() => {
      const { groups } = this.props;
      const group = groups[groups.length - 1];
      if (group) {
        this.props.actions.selectGroup(group.id);
      }
    }, 0);
  }
  handleDeleteGroups() {
    const { groups } = this.props;

    const lastIndex = groups.reduce((previousValue, currentValue, index) => (
      currentValue.selected ? index : previousValue
    ), null);
    const selectedIndex = lastIndex < groups.length - 1 ? lastIndex + 1 : lastIndex - 1;
    const newGroup = groups[selectedIndex];

    const ids = groups.filter(group => group.selected).map(group => group.id);
    this.props.actions.deleteGroups(ids);

    if (newGroup) {
      this.props.actions.selectGroup(newGroup.id);
    }
  }
  handleEditGroup(id, group) {
    this.props.actions.updateGroup(id, group);
  }
  handleSelectGroups(ids) {
    this.props.actions.selectGroups(ids);
  }
  handleSortGroups(key, order) {
    this.props.actions.sortGroups(key, order);
  }

  handleAddHost() {
    this.props.actions.createHost(this.groupId, { enable: true });
    window.setTimeout(() => {
      const host = this.hosts[this.hosts.length - 1];
      if (host) {
        this.props.actions.selectHost(this.groupId, host.id);
      }
    }, 0);
  }
  handleDeleteHosts() {
    const hosts = this.hosts;

    const lastIndex = hosts.reduce((previousValue, currentValue, index) => (
      currentValue.selected ? index : previousValue
    ), null);
    const selectedIndex = lastIndex < hosts.length - 1 ? lastIndex + 1 : lastIndex - 1;
    const newHost = hosts[selectedIndex];

    const ids = hosts.filter(group => group.selected).map(group => group.id);
    this.props.actions.deleteHosts(this.groupId, ids);

    if (newHost) {
      this.props.actions.selectHost(this.groupId, newHost.id);
    }
  }
  handleEditHost(id, host) {
    this.props.actions.updateHost(this.groupId, id, host);
  }
  handleSelectHosts(ids) {
    this.props.actions.selectHosts(this.groupId, ids);
  }
  handleSortHosts(key, order) {
    this.props.actions.sortHosts(this.groupId, key, order);
  }

  renderGroupList() {
    const { groups } = this.props;

    return (
      <GroupList
        groups={groups}
        onAddGroup={() => this.handleAddGroup()}
        onDeleteGroups={() => this.handleDeleteGroups()}
        onEditGroup={(...args) => this.handleEditGroup(...args)}
        onSelectGroups={selectedGroups => this.handleSelectGroups(selectedGroups)}
        onSortGroups={(...args) => this.handleSortGroups(...args)}
      />
    );
  }
  renderHostList() {
    if (!this.groupId) {
      return (
        <div style={styles.message}>Select Group</div>
      );
    }
    return (
      <HostList
        groupId={this.groupId}
        hosts={this.hosts}
        onAddHost={() => this.handleAddHost()}
        onDeleteHosts={() => this.handleDeleteHosts()}
        onEditHost={(...args) => this.handleEditHost(...args)}
        onSelectHosts={selectedHosts => this.handleSelectHosts(selectedHosts)}
        onSortHosts={(...args) => this.handleSortHosts(...args)}
      />
    );
  }
  render() {
    return (
      <div style={styles.container}>
        <Drawer
          open
          width={256}
          className="sidebar"
          containerStyle={styles.drawer}
        >
          <div>
            {this.renderGroupList()}
          </div>
        </Drawer>
        <div
          className="content"
          style={styles.content}
        >
          <div style={styles.contentContainer}>
            {this.renderHostList()}
          </div>
        </div>
      </div>
    );
  }
}
