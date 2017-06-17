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
    hosts: PropTypes.arrayOf(PropTypes.object),
    onAddHost: PropTypes.func,
    onEditHost: PropTypes.func,
    onDeleteHosts: PropTypes.func,
    onSelectHosts: PropTypes.func,
    onSortHosts: PropTypes.func,
  };
  static defaultProps = {
    hosts: [],
    onAddHost: () => {},
    onEditHost: () => {},
    onDeleteHosts: () => {},
    onSelectHosts: () => {},
    onSortHosts: () => {},
  };
  state = {
    key: null,
    order: Host.SORT_ASC,
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState);
  }
  handleClickHeader(e, rowId, columnId) {
    const { key, order } = this.state;

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
    this.setState({ key: newKey, order: newOrder });
    this.props.onSortHosts(newKey, newOrder);
  }
  handleRowSelection(selectedRows) {
    const { hosts, onSelectHosts } = this.props;
    const ids = hosts.filter((host, i) => selectedRows.includes(i)).map(host => host.id);
    onSelectHosts(ids);
  }
  handleEditHost(host) {
    this.props.onEditHost(host.id, host);
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
    const { hosts } = this.props;

    return (
      <TableBody
        showRowHover
        deselectOnClickaway={false}
        displayRowCheckbox={false}
      >
        {hosts.map(host => (
          <HostItem
            key={host.id}
            host={host}
            selected={host.selected}
            onEditHost={editedHost => this.handleEditHost(editedHost)}
          />
        ))}
      </TableBody>
    );
  }
  renderFooter() {
    const { hosts, onAddHost, onDeleteHosts } = this.props;
    const selectedCount = hosts.filter(host => host.selected).length;
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