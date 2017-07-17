import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ActionCreators from '../actions';
import GroupList from '../components/group-list';
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
  const { copiedGroups } = state.groupContainer;

  return {
    groups: state.groups,
    pastable: !!copiedGroups.length,
    ...state.groupContainer,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class GroupContainer extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    pastable: PropTypes.bool.isRequired,
    focusedId: PropTypes.number.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    sortOptions: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };
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
  handleCutGroups() {
    this.props.actions.cutGroups();
  }
  handleCopyGroups() {
    this.props.actions.copyGroups();
  }
  handlePasteGroups() {
    this.props.actions.pasteGroups();
  }
  handleSelectGroup(id, option) {
    this.props.actions.selectGroup(id, option);
  }
  handleSortGroups(options) {
    this.props.actions.sortGroups(options);
  }
  handleContextMenuForGroups(e) {
    const { pastable } = this.props;

    ContextMenu.show(e, [
      {
        label: 'New Group',
        click: () => this.handleAddGroup(),
        accelerator: 'CmdOrCtrl+Shift+N',
      },
      { type: 'separator' },
      {
        label: 'Cut',
        click: () => this.handleCutGroups(),
        accelerator: 'CmdOrCtrl+Shift+X',
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
        enabled: pastable,
      },
      { type: 'separator' },
      {
        label: 'Delete',
        click: () => this.handleDeleteGroups(),
        accelerator: 'CmdOrCtrl+Shift+Backspace',
      },
    ]);
  }
  render() {
    const { groups, focusedId, selectedIds, sortOptions } = this.props;

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
          focusedId={focusedId}
          selectedIds={selectedIds}
          sortOptions={sortOptions}
          onEditGroup={(...args) => this.handleEditGroup(...args)}
          onSelectGroup={(...args) => this.handleSelectGroup(...args)}
          onSortGroups={(...args) => this.handleSortGroups(...args)}
        />
        {emptyView}
      </div>
    );
  }
}
