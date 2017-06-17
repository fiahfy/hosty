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
import * as Group from '../utils/group';

const styles = {
  iconHeaderColumn: {
    paddingRight: '0',
    textAlign: 'center',
    userSelect: 'none',
    width: '48px',
  },
  sortableHeaderColumn: {
    cursor: 'pointer',
    userSelect: 'none',
  },
  label: {
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  icon: {
    verticalAlign: 'middle',
  },
  footerColumn: {
    paddingLeft: '20px',
    paddingRight: '20px',
    verticalAlign: 'middle',
    width: '88px',
  },
};

export default class GroupList extends Component {
  static propTypes = {
    groups: PropTypes.arrayOf(PropTypes.object),
    onAddGroup: PropTypes.func,
    onEditGroup: PropTypes.func,
    onDeleteGroups: PropTypes.func,
    onSelectGroups: PropTypes.func,
    onSortGroups: PropTypes.func,
  };
  static defaultProps = {
    groups: [],
    onAddGroup: () => {},
    onEditGroup: () => {},
    onDeleteGroups: () => {},
    onSelectGroups: () => {},
    onSortGroups: () => {},
  };
  state = {
    key: null,
    order: Group.SORT_ASC,
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState);
  }
  handleClickHeader(e, rowId, columnId) {
    const { key, order } = this.state;

    const columns = [null, null, Group.KEY_NAME];
    const newKey = columns[columnId];
    if (!newKey) {
      return;
    }
    let newOrder;
    if (key === newKey && order === Group.SORT_ASC) {
      newOrder = Group.SORT_DESC;
    } else {
      newOrder = Group.SORT_ASC;
    }
    this.setState({ key: newKey, order: newOrder });
    this.props.onSortGroups(newKey, newOrder);
  }
  handleRowSelection(selectedRows) {
    const { groups, onSelectGroups } = this.props;
    const ids = groups.filter((group, i) => selectedRows.includes(i)).map(group => group.id);
    onSelectGroups(ids);
  }
  handleEditGroup(group) {
    this.props.onEditGroup(group.id, group);
  }
  renderHeader() {
    const { key, order } = this.state;

    return (
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        <TableRow onCellClick={(...args) => this.handleClickHeader(...args)}>
          <TableHeaderColumn style={styles.iconHeaderColumn}>
            Status
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.sortableHeaderColumn}>
            <div style={styles.label}>Group</div>
            <SortOrderIcon
              style={styles.icon}
              hidden={key !== Group.KEY_NAME}
              asc={order === Group.SORT_ASC}
            />
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
    );
  }
  renderBody() {
    const { groups } = this.props;

    return (
      <TableBody
        showRowHover
        deselectOnClickaway={false}
        displayRowCheckbox={false}
      >
        {groups.map(group => (
          <GroupItem
            key={group.id}
            group={group}
            selected={group.selected}
            onEditGroup={editedGroup => this.handleEditGroup(editedGroup)}
          />
        ))}
      </TableBody>
    );
  }
  renderFooter() {
    const { groups, onAddGroup, onDeleteGroups } = this.props;
    const selectedCount = groups.filter(group => group.selected).length;
    const disabled = !selectedCount;
    const label = selectedCount > 1 ? `Delete (${selectedCount})` : 'Delete';

    return (
      <TableFooter
        adjustForCheckbox
      >
        <TableRow>
          <TableRowColumn style={styles.footerColumn}>
            <FlatButton
              label="Add"
              primary
              onClick={onAddGroup}
            />
          </TableRowColumn>
          <TableRowColumn style={styles.footerColumn}>
            <FlatButton
              label={label}
              secondary
              disabled={disabled}
              onClick={onDeleteGroups}
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