import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Drawer } from 'material-ui';
import * as ActionCreators from '../actions';
import GroupList from '../components/group-list';
import HostList from '../components/host-list';
import * as Group from '../utils/group';
import * as Host from '../utils/host';

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
  messageWrapper: {
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
  return {
    groups: state.groups,
    selectedGroupIds: state.selectedGroupIds,
    selectedHostIds: state.selectedHostIds,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MainContainer extends Component {
  static propTypes = {
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedGroupIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    selectedHostIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    actions: PropTypes.object.isRequired,
  };
  state = {
    groupSortOptions: {
      key: null,
      order: Group.SORT_ASC,
    },
    hostSortOptions: {
      key: null,
      order: Host.SORT_ASC,
    },
  };
  get selectedGroup() {
    return this.props.groups.find(group => this.props.selectedGroupIds.includes(group.id));
  }
  get selectedGroupId() {
    return this.selectedGroup ? this.selectedGroup.id : 0;
  }
  get groups() {
    return this.props.groups;
  }
  get hosts() {
    return this.selectedGroup.hosts;
  }
  handleAddGroup() {
    this.props.actions.createGroup({ enable: true });
    window.setTimeout(() => {
      const group = this.groups[this.groups.length - 1];
      if (group) {
        this.props.actions.selectGroups([group.id]);
      }
    }, 0);
  }
  handleDeleteGroups() {
    const { selectedGroupIds } = this.props;

    const lastIndex = this.groups
      .reduce((previousValue, currentValue, index) => (
        selectedGroupIds.includes(currentValue.id) ? index : previousValue
      ), null);
    const selectedIndex = lastIndex < this.groups.length - 1 ? lastIndex + 1 : lastIndex - 1;
    const newGroup = this.groups[selectedIndex];

    const ids = this.groups
      .filter(group => selectedGroupIds.includes(group.id))
      .map(group => group.id);
    this.props.actions.deleteGroups(ids);

    if (newGroup) {
      this.props.actions.selectGroups([newGroup.id]);
    }
  }
  handleEditGroup(id, group) {
    this.props.actions.updateGroup(id, group);
  }
  handleSelectGroups(ids) {
    this.setState({ hostSortOptions: {} });
    this.props.actions.selectGroups(ids);
  }
  handleSortGroups(options) {
    this.setState({ groupSortOptions: options });
    this.props.actions.sortGroups(options);
  }

  handleAddHost() {
    this.props.actions.createHost(this.selectedGroupId, { enable: true });
    window.setTimeout(() => {
      const host = this.hosts[this.hosts.length - 1];
      if (host) {
        this.props.actions.selectHosts([host.id]);
      }
    }, 0);
  }
  handleDeleteHosts() {
    const { selectedHostIds } = this.props;

    const lastIndex = this.hosts
      .reduce((previousValue, currentValue, index) => (
        selectedHostIds.includes(currentValue.id) ? index : previousValue
      ), null);
    const selectedIndex = lastIndex < this.hosts.length - 1 ? lastIndex + 1 : lastIndex - 1;
    const newHost = this.hosts[selectedIndex];

    const ids = this.hosts
      .filter(host => selectedHostIds
      .includes(host.id)).map(host => host.id);
    this.props.actions.deleteHosts(this.selectedGroupId, ids);

    if (newHost) {
      this.props.actions.selectHosts([newHost.id]);
    }
  }
  handleEditHost(id, host) {
    this.props.actions.updateHost(this.selectedGroupId, id, host);
  }
  handleSelectHosts(ids) {
    this.props.actions.selectHosts(ids);
  }
  handleSortHosts(options) {
    this.setState({ hostSortOptions: options });
    this.props.actions.sortHosts(this.selectedGroupId, options);
  }

  renderGroupList() {
    const { selectedGroupIds } = this.props;
    const { groupSortOptions } = this.state;

    return (
      <div className="list">
        <GroupList
          groups={this.groups}
          selectedIds={selectedGroupIds}
          sortOptions={groupSortOptions}
          onAddGroup={() => this.handleAddGroup()}
          onDeleteGroups={() => this.handleDeleteGroups()}
          onEditGroup={(...args) => this.handleEditGroup(...args)}
          onSelectGroups={selectedGroups => this.handleSelectGroups(selectedGroups)}
          onSortGroups={(...args) => this.handleSortGroups(...args)}
        />
      </div>
    );
  }
  renderHostList() {
    const { selectedHostIds } = this.props;
    const { hostSortOptions } = this.state;

    if (!this.selectedGroupId) {
      return (
        <div style={styles.messageWrapper}>
          <div style={styles.message}>Select Group</div>
        </div>
      );
    }

    return (
      <div className="list">
        <HostList
          groupId={this.selectedGroupId}
          hosts={this.hosts}
          selectedIds={selectedHostIds}
          sortOptions={hostSortOptions}
          onAddHost={() => this.handleAddHost()}
          onDeleteHosts={() => this.handleDeleteHosts()}
          onEditHost={(...args) => this.handleEditHost(...args)}
          onSelectHosts={selectedHosts => this.handleSelectHosts(selectedHosts)}
          onSortHosts={(...args) => this.handleSortHosts(...args)}
        />
      </div>
    );
  }
  render() {
    return (
      <div style={styles.container}>
        <Drawer
          open
          width={256}
          containerStyle={styles.drawer}
        >
          {this.renderGroupList()}
        </Drawer>
        <div style={styles.content}>
          {this.renderHostList()}
        </div>
      </div>
    );
  }
}
