import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ActionCreators from '../actions';
import GroupList from '../components/group-list';
import HostList from '../components/host-list';
import ContextMenu from '../utils/context-menu';

const styles = {
  container: {
    boxSizing: 'border-box',
    height: '100%',
    overflow: 'hidden',
  },
  nav: {
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    boxSizing: 'content-box',
    float: 'left',
    height: '100%',
    width: '256px',
  },
  contentWrapper: {
    height: '100%',
    float: 'right',
    marginLeft: '-257px',
    width: '100%',
  },
  content: {
    height: '100%',
    paddingLeft: '257px',
  },
  emptyWrapper: {
    display: 'table',
    height: '100%',
    position: 'absolute',
    top: '0',
    width: '100%',
  },
  emptyMessage: {
    display: 'table-cell',
    fontSize: '14px',
    position: 'relative',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
};

function mapStateToProps(state) {
  return {
    groups: state.groups,
    ...state.mainContainer,
    hostPastable: !!state.mainContainer.copiedHosts.length,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MainContainer extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    focusedGroupId: PropTypes.number.isRequired,
    focusedHostId: PropTypes.number.isRequired,
    selectedGroupIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    selectedHostIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    groupSortOptions: PropTypes.object.isRequired,
    hostSortOptions: PropTypes.object.isRequired,
    hostPastable: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };
  get selectedGroup() {
    const selectedGroupIds = this.props.selectedGroupIds;
    if (!selectedGroupIds) {
      return null;
    }
    return this.props.groups.find(group => group.id === selectedGroupIds[0]);
  }
  get selectedGroupId() {
    return this.selectedGroup ? this.selectedGroup.id : 0;
  }
  get groups() {
    return this.props.groups;
  }
  get hosts() {
    if (!this.selectedGroup) {
      return [];
    }
    return this.selectedGroup.hosts || [];
  }
  // handle group
  handleAddGroup() {
    this.props.actions.createGroup({ enable: true });
    window.setTimeout(() => {
      this.props.actions.focusGroup();
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
      this.props.actions.selectGroup(newGroup.id);
      return;
    }
    this.props.actions.unselectGroupAll();
  }
  handleEditGroup(id, group) {
    this.props.actions.updateGroup(id, group);
  }
  handleSelectGroup(id, mode) {
    this.props.actions.selectGroup(id, mode);
  }
  handleSortGroups(options) {
    this.props.actions.sortGroups(options);
  }
  handleContextMenuForGroups(e) {
    ContextMenu.show(e, [{ label: 'New Group', click: () => this.handleAddGroup() }]);
  }
  // handle host
  handleAddHost() {
    this.props.actions.createHost(this.selectedGroupId, { enable: true });
    window.setTimeout(() => {
      this.props.actions.focusHost();
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
      this.props.actions.selectHost(newHost.id);
      return;
    }
    this.props.actions.unselectHostAll();
  }
  handleEditHost(id, host) {
    this.props.actions.updateHost(this.selectedGroupId, id, host);
  }
  handleCopyHosts() {
    this.props.actions.copyHosts();
  }
  handlePasteHosts() {
    this.props.actions.pasteHosts();
  }
  handleSelectHost(id, mode) {
    this.props.actions.selectHost(id, mode);
  }
  handleSortHosts(options) {
    this.props.actions.sortHosts(this.selectedGroupId, options);
  }
  handleContextMenuForHosts(e) {
    const { hostPastable } = this.props;

    let menus = [];
    if (this.selectedGroupId) {
      menus = [
        {
          label: 'New Host',
          click: () => this.handleAddHost(),
        },
        {
          label: 'Copy',
          click: () => this.handleCopyHosts(),
        },
        {
          label: 'Paste',
          click: () => this.handlePasteHosts(),
          enabled: hostPastable,
        },
        {
          label: 'Delete',
          click: () => this.handleDeleteHosts(),
        },
      ];
    }
    ContextMenu.show(e, menus);
  }
  // render
  renderGroupList() {
    const { focusedGroupId, selectedGroupIds, groupSortOptions } = this.props;

    let emptyView = null;
    if (!this.groups.length) {
      emptyView = (
        <div style={styles.emptyWrapper}>
          <div style={{
            ...styles.emptyMessage,
            color: this.context.muiTheme.palette.primary3Color,
          }}
          >No groups</div>
        </div>
      );
    }

    return (
      <div
        className="list"
        onContextMenu={e => this.handleContextMenuForGroups(e)}
      >
        <GroupList
          groups={this.groups}
          focusedId={focusedGroupId}
          selectedIds={selectedGroupIds}
          sortOptions={groupSortOptions}
          onAddGroup={() => this.handleAddGroup()}
          onEditGroup={(...args) => this.handleEditGroup(...args)}
          onDeleteGroups={() => this.handleDeleteGroups()}
          onSelectGroup={(...args) => this.handleSelectGroup(...args)}
          onSortGroups={(...args) => this.handleSortGroups(...args)}
        />
        {emptyView}
      </div>
    );
  }
  renderHostList() {
    const { focusedHostId, selectedHostIds, hostSortOptions } = this.props;

    let emptyView = null;
    if (!this.hosts.length) {
      emptyView = (
        <div style={styles.emptyWrapper}>
          <div style={{
            ...styles.emptyMessage,
            color: this.context.muiTheme.palette.primary3Color,
          }}
          >No hosts</div>
        </div>
      );
    }

    return (
      <div
        className="list"
        onContextMenu={e => this.handleContextMenuForHosts(e)}
      >
        <HostList
          groupId={this.selectedGroupId}
          hosts={this.hosts}
          focusedId={focusedHostId}
          selectedIds={selectedHostIds}
          sortOptions={hostSortOptions}
          onAddHost={() => this.handleAddHost()}
          onEditHost={(...args) => this.handleEditHost(...args)}
          onDeleteHosts={() => this.handleDeleteHosts()}
          onSelectHost={(...args) => this.handleSelectHost(...args)}
          onSortHosts={(...args) => this.handleSortHosts(...args)}
        />
        {emptyView}
      </div>
    );
  }
  render() {
    return (
      <div style={styles.container}>
        <div
          style={{ ...styles.nav, borderRightColor: this.context.muiTheme.palette.primary3Color }}
          className="nav"
        >
          {this.renderGroupList()}
        </div>
        <div style={styles.contentWrapper}>
          <div style={styles.content}>
            {this.renderHostList()}
          </div>
        </div>
      </div>
    );
  }
}
