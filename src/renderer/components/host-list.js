import React, { Component, PropTypes } from 'react'
import {
  FlatButton,
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHeaderColumn, TableRowColumn,
} from 'material-ui'
import HostItem from './host-item'
import SortOrderIcon from './sort-order-icon'
import isUpdateNeeded from '../utils/is-update-needed'
import Host from '../utils/host'

export default class HostList extends Component {
  static propTypes = {
    groupId: PropTypes.number,
    hosts: PropTypes.arrayOf(PropTypes.object),
    onAddHost: PropTypes.func,
    onEditHost: PropTypes.func,
    onDeleteHosts: PropTypes.func,
    onSelectHosts: PropTypes.func,
  };
  static defaultProps = {
    groupId: 0,
    hosts: [],
    onAddHost: () => {},
    onEditHost: () => {},
    onDeleteHosts: () => {},
    onSelectHosts: () => {},
  };
  state = {
    sortOptions: {
      key: Host.KEY_HOST,
      order: Host.SORT_ASC,
    },
    sortedMap: new Map,
    selectedIds: [],
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.groupId === nextProps.groupId && this.props.hosts.length) {
      return
    }

    this.setState({ selectedIds: [] })
    this.sort(nextProps.hosts, this.state.sortOptions)
  }
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState)
  }
  getSelectedHosts() {
    return this.getSortedHosts().filter(host => this.state.selectedIds.includes(host.id))
  }
  getSortedHosts() {
    const { sortedMap } = this.state

    return this.props.hosts.concat().sort((a, b) => {
      if (!sortedMap.has(a.id) && !sortedMap.has(b.id)) {
        return (a.id > b.id) ? 1 : -1
      }
      if (!sortedMap.has(a.id)) {
        return 1
      }
      if (!sortedMap.has(b.id)) {
        return -1
      }
      return sortedMap.get(a.id) > sortedMap.get(b.id) ? 1 : -1
    })
  }
  focusLastHost() {
    const hosts = this.getSortedHosts()
    const host = hosts[hosts.length - 1]
    this.refs[host.id].focus()
  }
  select(ids) {
    this.setState({ selectedIds: ids })
  }
  deselectAll() {
    this.setState({ selectedIds: [] })
  }
  sort(hosts, options) {
    const { key, order } = options

    const sortedMap = new Map
    hosts.concat()
      .sort((a, b) => Host.compare(a, b, key, order))
      .forEach((host, i) => {
        sortedMap.set(host.id, i)
      })

    this.setState({ sortOptions: options, sortedMap })
  }
  handleEditHost(host) {
    this.props.onEditHost(host.id, host)
  }
  handleClickHeader(e, rowId, columnId) {
    const { key, order } = this.state.sortOptions

    const columns = [null, null, Host.KEY_HOST, Host.KEY_IP]
    const newKey = columns[columnId]
    if (!newKey) {
      return
    }
    let newOrder
    if (key !== newKey || order !== Host.SORT_ASC) {
      newOrder = Host.SORT_ASC
    } else {
      newOrder = Host.SORT_DESC
    }
    this.sort(this.props.hosts, { key: newKey, order: newOrder })
  }
  handleRowSelection(selectedRows) {
    const selectedHosts = this.getSortedHosts()
        .filter((host, i) => selectedRows.includes(i))
    const selectedIds = selectedHosts.map(host => host.id)

    this.setState({ selectedIds })
    this.props.onSelectHosts(selectedHosts)
  }
  renderHeader() {
    const { key, order } = this.state.sortOptions

    return (
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        <TableRow onCellClick={::this.handleClickHeader}>
          <TableHeaderColumn style={styles.headerIconColumn}>
            Status
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.headerSortableColumn}>
            <div style={styles.headerColumnText}>Host</div>
            <SortOrderIcon
              style={styles.headerColumnIcon}
              hidden={key !== Host.KEY_HOST}
              asc={order === Host.SORT_ASC}
            />
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.headerSortableColumn}>
            <div style={styles.headerColumnText}>IP</div>
            <SortOrderIcon
              style={styles.headerColumnIcon}
              hidden={key !== Host.KEY_IP}
              asc={order === Host.SORT_ASC}
            />
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
    )
  }
  renderBody() {
    return (
      <TableBody
        showRowHover
        deselectOnClickaway={false}
        displayRowCheckbox={false}
      >
        {this.getSortedHosts().map(host => (
          <HostItem
            ref={host.id}
            key={host.id}
            host={host}
            selected={this.state.selectedIds.includes(host.id)}
            onEditHost={::this.handleEditHost}
          />
        ))}
      </TableBody>
    )
  }
  renderFooter() {
    const count = this.state.selectedIds.length
    const disabled = !count
    const label = count > 1 ? `Delete (${count})` : 'Delete'

    return (
      <TableFooter
        adjustForCheckbox
      >
        <TableRow>
          <TableRowColumn colSpan="3">
            <FlatButton
              label="Add"
              style={styles.button}
              primary
              onClick={this.props.onAddHost}
            />
            <FlatButton
              label={label}
              style={styles.button}
              secondary
              onClick={this.props.onDeleteHosts}
              disabled={disabled}
            />
          </TableRowColumn>
        </TableRow>
      </TableFooter>
    )
  }
  render() {
    return (
      <Table
        multiSelectable
        allRowsSelected={false}
        onRowSelection={::this.handleRowSelection}
      >
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
      </Table>
    )
  }
}

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
}
