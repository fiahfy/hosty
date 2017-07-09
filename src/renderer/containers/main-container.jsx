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
  const { selectedGroupIds, copiedGroups, copiedHosts } = state.mainContainer;

  const selectedGroupId = selectedGroupIds[0] || 0;
  const selectedGroup = state.groups.find(group => group.id === selectedGroupId);
  const hosts = selectedGroup ? (selectedGroup.hosts || []) : [];

  return {
    groups: state.groups,
    hosts,
    selectedGroupId,
    groupPastable: !!copiedGroups.length,
    hostPastable: !!copiedHosts.length,
    ...state.mainContainer,
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
    hosts: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedGroupId: PropTypes.number.isRequired,
    groupPastable: PropTypes.bool.isRequired,
    hostPastable: PropTypes.bool.isRequired,
    focusedGroupId: PropTypes.number.isRequired,
    focusedHostId: PropTypes.number.isRequired,
    selectedGroupIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    selectedHostIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    groupSortOptions: PropTypes.object.isRequired,
    hostSortOptions: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };
  // handle group
  handleAddGroup() {
    this.props.actions.createGroup();
    window.setTimeout(() => {
      this.props.actions.focusGroup();
    }, 0);
  }
  handleEditGroup(id, group) {
    this.props.actions.updateGroup(id, group);
  }
  handleDeleteGroups() {
    this.props.actions.deleteGroups();
  }
  handleCopyGroups() {
    this.props.actions.copyGroups();
  }
  handlePasteGroups() {
    this.props.actions.pasteGroups();
  }
  handleSelectGroup(id, mode) {
    this.props.actions.selectGroup(id, mode);
  }
  handleSortGroups(options) {
    this.props.actions.sortGroups(options);
  }
  handleContextMenuForGroups(e) {
    const { groupPastable } = this.props;

    ContextMenu.show(e, [
      {
        label: 'New Group',
        click: () => this.handleAddGroup(),
        accelerator: 'CmdOrCtrl+Shift+N',
      },
      {
        label: 'Copy',
        click: () => this.handleCopyGroups(),
        accelerator: 'CmdOrCtrl+Shift+C',
      },
      {
        label: 'Paste',
        click: () => this.handlePasteGroups(),
        accelerator: 'CmdOrCtrl+Shift+V',
        enabled: groupPastable,
      },
      {
        label: 'Delete',
        click: () => this.handleDeleteGroups(),
        accelerator: 'CmdOrCtrl+Shift+Backspace',
      },
    ]);
  }
  // handle host
  handleAddHost() {
    this.props.actions.createHost();
    window.setTimeout(() => {
      this.props.actions.focusHost();
    }, 0);
  }
  handleEditHost(id, host) {
    this.props.actions.updateHost(id, host);
  }
  handleDeleteHosts() {
    this.props.actions.deleteHosts();
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
    this.props.actions.sortHosts(options);
  }
  handleContextMenuForHosts(e) {
    const { selectedGroupId, hostPastable } = this.props;

    if (!selectedGroupId) {
      return;
    }

    ContextMenu.show(e, [
      {
        label: 'New Host',
        click: () => this.handleAddHost(),
        accelerator: 'CmdOrCtrl+N',
      },
      {
        label: 'Copy',
        click: () => this.handleCopyHosts(),
        accelerator: 'CmdOrCtrl+Alt+C',
      },
      {
        label: 'Paste',
        click: () => this.handlePasteHosts(),
        accelerator: 'CmdOrCtrl+Alt+V',
        enabled: hostPastable,
      },
      {
        label: 'Delete',
        click: () => this.handleDeleteHosts(),
        accelerator: 'CmdOrCtrl+Backspace',
      },
    ]);
  }
  // render
  renderGroupList() {
    const { groups, focusedGroupId, selectedGroupIds, groupSortOptions } = this.props;

    let emptyView = null;
    if (!groups.length) {
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
          groups={groups}
          focusedId={focusedGroupId}
          selectedIds={selectedGroupIds}
          sortOptions={groupSortOptions}
          onEditGroup={(...args) => this.handleEditGroup(...args)}
          onSelectGroup={(...args) => this.handleSelectGroup(...args)}
          onSortGroups={(...args) => this.handleSortGroups(...args)}
        />
        {emptyView}
      </div>
    );
  }
  renderHostList() {
    const { selectedGroupId, hosts, focusedHostId, selectedHostIds, hostSortOptions } = this.props;

    let emptyView = null;
    if (!hosts.length) {
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
          groupId={selectedGroupId}
          hosts={hosts}
          focusedId={focusedHostId}
          selectedIds={selectedHostIds}
          sortOptions={hostSortOptions}
          onEditHost={(...args) => this.handleEditHost(...args)}
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
