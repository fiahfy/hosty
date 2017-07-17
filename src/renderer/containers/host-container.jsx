import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ActionCreators from '../actions';
import HostList from '../components/host-list';
import ContextMenu from '../utils/context-menu';

const styles = {
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
    paddingTop: '59px',
    position: 'relative',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
};

function mapStateToProps(state) {
  const { selectedIds: selectedGroupIds } = state.groupContainer;
  const { copiedHosts } = state.hostContainer;

  const selectedGroupId = selectedGroupIds[0] || 0;
  const selectedGroup = state.groups.find(group => group.id === selectedGroupId);
  const hosts = selectedGroup ? (selectedGroup.hosts || []) : [];

  return {
    selectedGroupId,
    hosts,
    pastable: !!copiedHosts.length,
    ...state.hostContainer,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HostContainer extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    selectedGroupId: PropTypes.number.isRequired,
    hosts: PropTypes.arrayOf(PropTypes.object).isRequired,
    pastable: PropTypes.bool.isRequired,
    focusedId: PropTypes.number.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    sortOptions: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };
  handleAddHost() {
    this.props.actions.createHost();
    window.setTimeout(() => {
      this.props.actions.focusHost();
    }, 0);
  }
  handleEditHost(id, host) {
    this.props.actions.updateHost(id, host);
  }
  handleEnableHosts() {
    this.props.actions.enableHosts();
  }
  handleDisableHosts() {
    this.props.actions.disableHosts();
  }
  handleDeleteHosts() {
    this.props.actions.deleteHosts();
  }
  handleCutHosts() {
    this.props.actions.cutHosts();
  }
  handleCopyHosts() {
    this.props.actions.copyHosts();
  }
  handlePasteHosts() {
    this.props.actions.pasteHosts();
  }
  handleSelectHost(id, option) {
    this.props.actions.selectHost(id, option);
  }
  handleSortHosts(options) {
    this.props.actions.sortHosts(options);
  }
  handleContextMenuForHosts(e) {
    const { selectedGroupId, pastable } = this.props;

    if (!selectedGroupId) {
      return;
    }

    ContextMenu.show(e, [
      {
        label: 'New Host',
        click: () => this.handleAddHost(),
        accelerator: 'CmdOrCtrl+N',
      },
      { type: 'separator' },
      {
        label: 'Cut',
        click: () => this.handleCutHosts(),
        accelerator: 'CmdOrCtrl+Alt+X',
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
        enabled: pastable,
      },
      { type: 'separator' },
      {
        label: 'Delete',
        click: () => this.handleDeleteHosts(),
        accelerator: 'CmdOrCtrl+Backspace',
      },
      { type: 'separator' },
      {
        label: 'Enable',
        click: () => this.handleEnableHosts(),
      },
      {
        label: 'Disable',
        click: () => this.handleDisableHosts(),
      },
    ]);
  }
  render() {
    const { selectedGroupId, hosts, focusedId, selectedIds, sortOptions } = this.props;

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
          focusedId={focusedId}
          selectedIds={selectedIds}
          sortOptions={sortOptions}
          onEditHost={(...args) => this.handleEditHost(...args)}
          onSelectHost={(...args) => this.handleSelectHost(...args)}
          onSortHosts={(...args) => this.handleSortHosts(...args)}
        />
        {emptyView}
      </div>
    );
  }
}
