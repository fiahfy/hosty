import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatButton,
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHeaderColumn, TableRowColumn,
} from 'material-ui';
import GroupItem from './group-item';
import SortOrderIcon from './sort-order-icon';
import isUpdateNeeded from '../utils/is-update-needed';
import * as HostGroup from '../utils/host-group';

const styles = {
  headerIconColumn: {
    width: 48,
    textAlign: 'center',
    paddingRight: 0,
  },
  headerSortableColumn: {
    cursor: 'pointer',
  },
  headerColumnText: {
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  headerColumnIcon: {
    verticalAlign: 'middle',
  },
  button: {
    marginLeft: 20,
    marginRight: 20,
  },
};

export default class GroupList extends Component {
  static propTypes = {
    groupId: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
    groups: PropTypes.arrayOf(PropTypes.object),
    onAddGroup: PropTypes.func,
    onEditGroup: PropTypes.func,
    onDeleteGroups: PropTypes.func,
    onSelectGroups: PropTypes.func,
  };
  static defaultProps = {
    groupId: 0,
    groups: [],
    onAddGroup: () => {},
    onEditGroup: () => {},
    onDeleteGroups: () => {},
    onSelectGroups: () => {},
  };
  state = {
    sortOptions: {
      key: HostGroup.KEY_NAME,
      order: HostGroup.SORT_ASC,
    },
    sortedMap: new Map(),
    selectedIds: [],
  };
  componentWillReceiveProps(nextProps) {
    const selectedIds = nextProps.groupId ? [nextProps.groupId] : [];
    this.setState({ selectedIds });

    if (this.props.groups.length) {
      return;
    }

    this.sort(nextProps.groups, this.state.sortOptions);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState);
  }
  getSelectedGroups() {
    return this.getSortedGroups().filter(group => this.state.selectedIds.includes(group.id));
  }
  getSortedGroups() {
    const { sortedMap } = this.state;

    return this.props.groups.concat().sort((a, b) => {
      if (!sortedMap.has(a.id) && !sortedMap.has(b.id)) {
        return (a.id > b.id) ? 1 : -1;
      }
      if (!sortedMap.has(a.id)) {
        return 1;
      }
      if (!sortedMap.has(b.id)) {
        return -1;
      }
      return sortedMap.get(a.id) > sortedMap.get(b.id) ? 1 : -1;
    });
  }
  focusLastGroup() {
    const groups = this.getSortedGroups();
    const group = groups[groups.length - 1];
    this.groupItems[group.id].focus();
  }
  select(ids) {
    this.setState({ selectedIds: ids });
  }
  deselectAll() {
    this.setState({ selectedIds: [] });
  }
  sort(groups, options) {
    const { key, order } = options;

    const sortedMap = new Map();
    groups.concat()
      .sort((a, b) => HostGroup.compare(a, b, key, order))
      .forEach((group, i) => {
        sortedMap.set(group.id, i);
      });

    this.setState({ sortOptions: options, sortedMap });
  }
  handleEditGroup(group) {
    this.props.onEditGroup(group.id, group);
  }
  handleClickHeader(e, rowId, columnId) {
    const { key, order } = this.state.sortOptions;

    const columns = [null, null, HostGroup.KEY_NAME];
    const newKey = columns[columnId];
    if (!newKey) {
      return;
    }
    let newOrder;
    if (key !== newKey || order !== HostGroup.SORT_ASC) {
      newOrder = HostGroup.SORT_ASC;
    } else {
      newOrder = HostGroup.SORT_DESC;
    }
    this.sort(this.props.groups, { key: newKey, order: newOrder });
  }
  handleRowSelection(selectedRows) {
    const selectedGroups = this.getSortedGroups()
        .filter((group, i) => selectedRows.includes(i));
    const selectedIds = selectedGroups.map(group => group.id);

    this.setState({ selectedIds });
    this.props.onSelectGroups(selectedGroups);
  }
  renderHeader() {
    const { key, order } = this.state.sortOptions;

    return (
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        <TableRow onCellClick={(...args) => this.handleClickHeader(...args)}>
          <TableHeaderColumn style={styles.headerIconColumn}>
            Status
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.headerSortableColumn}>
            <div style={styles.headerColumnText}>Group</div>
            <SortOrderIcon
              style={styles.headerColumnIcon}
              hidden={key !== HostGroup.KEY_NAME}
              asc={order === HostGroup.SORT_ASC}
            />
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
    );
  }
  renderBody() {
    return (
      <TableBody
        showRowHover
        deselectOnClickaway={false}
        displayRowCheckbox={false}
      >
        {this.getSortedGroups().map(group => (
          <GroupItem
            ref={(item) => {
              this.groupItems = this.groupItems || {};
              this.groupItems[group.id] = item;
            }}
            key={group.id}
            group={group}
            selected={this.state.selectedIds.includes(group.id)}
            onEditGroup={editedGroup => this.handleEditGroup(editedGroup)}
          />
        ))}
      </TableBody>
    );
  }
  renderFooter() {
    const disabled = !this.state.selectedIds.length;

    return (
      <TableFooter
        adjustForCheckbox
      >
        <TableRow>
          <TableRowColumn>
            <FlatButton
              label="Add"
              style={styles.button}
              primary
              onClick={this.props.onAddGroup}
            />
            <FlatButton
              label="Delete"
              style={styles.button}
              secondary
              onClick={this.props.onDeleteGroups}
              disabled={disabled}
            />
          </TableRowColumn>
        </TableRow>
      </TableFooter>
    );
  }
  render() {
    return (
      <Table
        multiSelectable={false}
        allRowsSelected={false}
        onRowSelection={selectedRows => this.handleRowSelection(selectedRows)}
      >
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
      </Table>
    );
  }
}
