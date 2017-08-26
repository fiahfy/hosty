import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Table, TableHeader, TableBody,
  TableRow, TableHeaderColumn,
} from 'material-ui';
import GroupItem from './group-item';
import SortOrderIcon from './sort-order-icon';
import isUpdateNeeded from '../utils/is-update-needed';
import * as Group from '../utils/group';

const styles = {
  iconHeaderColumn: {
    cursor: 'pointer',
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
    focusedId: PropTypes.number,
    selectedIds: PropTypes.arrayOf(PropTypes.number),
    sortOptions: PropTypes.object,
    onEditGroup: PropTypes.func,
    onSelectGroup: PropTypes.func,
    onSortGroups: PropTypes.func,
  };
  static defaultProps = {
    groups: [],
    focusedId: null,
    selectedIds: [],
    sortOptions: {},
    onEditGroup: () => {},
    onSelectGroup: () => {},
    onSortGroups: () => {},
  };
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return isUpdateNeeded(this, nextProps, nextState, nextContext);
  }
  handleHeaderClick(e, rowId, columnId) {
    const { key, order } = this.props.sortOptions;

    const columns = [null, Group.KEY_ENABLE, Group.KEY_NAME];
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
    this.props.onSortGroups({ key: newKey, order: newOrder });
  }
  handleCellClick(rowId, columnId, e) {
    const { groups, onSelectGroup } = this.props;
    const group = groups[rowId];
    if (!group) {
      return;
    }
    let option = e.shiftKey ? 'shift' : 'leftClick';
    option = (e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey) ? 'ctrl' : option;
    onSelectGroup(group.id, option);
  }
  handleEditGroup(group) {
    this.props.onEditGroup(group.id, group);
  }
  handleContextMenu(e, id) {
    this.props.onSelectGroup(id, 'rightClick');
  }
  renderHeader() {
    const { key, order } = this.props.sortOptions;

    return (
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        <TableRow onCellClick={(...args) => this.handleHeaderClick(...args)}>
          <TableHeaderColumn style={styles.iconHeaderColumn}>
            <div style={styles.label}>Status</div>
            <SortOrderIcon
              style={styles.icon}
              hidden={key !== Group.KEY_ENABLE}
              asc={order === Group.SORT_ASC}
            />
          </TableHeaderColumn>
          <TableHeaderColumn colSpan="2" style={styles.sortableHeaderColumn}>
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
    const { groups, selectedIds, focusedId } = this.props;

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
            selected={selectedIds.includes(group.id)}
            focused={focusedId === group.id}
            editable={selectedIds.includes(group.id) && selectedIds.length === 1}
            onEditGroup={editedGroup => this.handleEditGroup(editedGroup)}
            onContextMenu={e => this.handleContextMenu(e, group.id)}
          />
        ))}
      </TableBody>
    );
  }
  render() {
    return (
      <Table
        allRowsSelected={false}
        multiSelectable
        onCellClick={(...args) => this.handleCellClick(...args)}
      >
        {this.renderHeader()}
        {this.renderBody()}
      </Table>
    );
  }
}
