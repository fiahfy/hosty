import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatButton,
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHeaderColumn, TableRowColumn,
} from 'material-ui';
import HostItem from './host-item';
import SortOrderIcon from './sort-order-icon';
import isUpdateNeeded from '../utils/is-update-needed';
import * as Host from '../utils/host';

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

export default class HostList extends Component {
  static propTypes = {
    groupId: PropTypes.number.isRequired,
    hosts: PropTypes.arrayOf(PropTypes.object),
    selectedIds: PropTypes.arrayOf(PropTypes.number),
    focusedId: PropTypes.number,
    sortOptions: PropTypes.object,
    onAddHost: PropTypes.func,
    onEditHost: PropTypes.func,
    onDeleteHosts: PropTypes.func,
    onSelectHost: PropTypes.func,
    onSortHosts: PropTypes.func,
  };
  static defaultProps = {
    hosts: [],
    selectedIds: [],
    focusedId: null,
    sortOptions: {},
    onAddHost: () => {},
    onEditHost: () => {},
    onDeleteHosts: () => {},
    onSelectHost: () => {},
    onSortHosts: () => {},
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState);
  }
  handleHeaderClick(e, rowId, columnId) {
    const { key, order } = this.props.sortOptions;

    const columns = [null, null, Host.KEY_HOST, Host.KEY_IP];
    const newKey = columns[columnId];
    if (!newKey) {
      return;
    }
    let newOrder;
    if (key === newKey && order === Host.SORT_ASC) {
      newOrder = Host.SORT_DESC;
    } else {
      newOrder = Host.SORT_ASC;
    }
    this.props.onSortHosts({ key: newKey, order: newOrder });
  }
  handleCellClick(rowId, columnId, e) {
    const { hosts, onSelectHost } = this.props;
    const host = hosts[rowId];
    if (!host) {
      return;
    }
    onSelectHost(host.id, (e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey));
  }
  handleEditHost(host) {
    this.props.onEditHost(host.id, host);
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
            Status
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.sortableHeaderColumn}>
            <div style={styles.label}>Host</div>
            <SortOrderIcon
              style={styles.icon}
              hidden={key !== Host.KEY_HOST}
              asc={order === Host.SORT_ASC}
            />
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.sortableHeaderColumn}>
            <div style={styles.label}>IP</div>
            <SortOrderIcon
              style={styles.icon}
              hidden={key !== Host.KEY_IP}
              asc={order === Host.SORT_ASC}
            />
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
    );
  }
  renderBody() {
    const { groupId, hosts, selectedIds, focusedId } = this.props;

    return (
      <TableBody
        showRowHover
        deselectOnClickaway={false}
        displayRowCheckbox={false}
      >
        {hosts.map(host => (
          <HostItem
            key={`${groupId}-${host.id}`}
            host={host}
            selected={selectedIds.includes(host.id)}
            focused={focusedId === host.id}
            editable={selectedIds.includes(host.id) && selectedIds.length === 1}
            onEditHost={editedHost => this.handleEditHost(editedHost)}
          />
        ))}
      </TableBody>
    );
  }
  renderFooter() {
    const { selectedIds, onAddHost, onDeleteHosts } = this.props;
    const selectedCount = selectedIds.length;
    const disabled = !selectedCount;
    const label = selectedCount > 1 ? `Delete (${selectedCount})` : 'Delete';

    return (
      <TableFooter
        adjustForCheckbox={false}
      >
        <TableRow>
          <TableRowColumn style={styles.footerColumn}>
            <FlatButton
              label="Add"
              primary
              onClick={onAddHost}
            />
          </TableRowColumn>
          <TableRowColumn style={styles.footerColumn}>
            <FlatButton
              label={label}
              secondary
              disabled={disabled}
              onClick={onDeleteHosts}
            />
          </TableRowColumn>
          <TableRowColumn />
        </TableRow>
      </TableFooter>
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
        {this.renderFooter()}
      </Table>
    );
  }
}
