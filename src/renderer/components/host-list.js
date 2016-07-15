import React, { Component, PropTypes } from 'react'
import {
  TextField, IconButton, FlatButton,
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHeaderColumn, TableRowColumn,
} from 'material-ui'
import validator from 'validator'
import HostItem from './host-item'
import SortOrderIcon from './sort-order-icon'
import isUpdateNeeded from '../utils/is-update-needed'

const SORT_KEY_HOST = 'host'
const SORT_KEY_IP = 'ip'
const SORT_ORDER_ASC = 'asc'
const SORT_ORDER_DESC = 'desc'

export default class HostList extends Component {
  static propTypes = {
    groupId:       PropTypes.number,
    hosts:         PropTypes.arrayOf(PropTypes.object),
    onEditHost:    PropTypes.func,
    onSelectHosts: PropTypes.func,
  };
  static defaultProps = {
    groupId:       0,
    hosts:         [],
    onEditHost:    () => {},
    onSelectHosts: () => {},
  };
  state = {
    sortOptions: {
      key:   SORT_KEY_HOST,
      order: SORT_ORDER_ASC,
    },
    sortedMap: new Map,
    selectedIds: [],
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.groupId === nextProps.groupId && this.props.hosts.length) {
      return
    }

    this.setState({ selectedIds: [] })
    this.sort(nextProps.hosts, this.state.sortOptions)
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
    hosts.concat().sort((a, b) => {
      const flag = order === SORT_ORDER_ASC
      if (!a[key]) {
        return flag ? 1 : -1
      }
      if (!b[key]) {
        return !flag ? 1 : -1
      }
      return (flag ? a[key] > b[key] : a[key] < b[key]) ? 1 : -1
    }).map((host, i) => {
      sortedMap.set(host.id, i)
    })

    this.setState({ sortOptions: options, sortedMap })
  }
  handleEditHost(host) {
    this.props.onEditHost(host.id, host)
  }
  handleClickHeader(e, rowId, columnId) {
    const { key, order } = this.state.sortOptions

    const columns = [,, SORT_KEY_HOST, SORT_KEY_IP]
    const newKey = columns[columnId]
    if (!newKey) {
      return
    }
    const newOrder = key !== newKey
      ? SORT_ORDER_ASC
      : order !== SORT_ORDER_ASC ? SORT_ORDER_ASC : SORT_ORDER_DESC

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
              hidden={key !== SORT_KEY_HOST}
              asc={order === SORT_ORDER_ASC}
            />
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.headerSortableColumn}>
            <div style={styles.headerColumnText}>IP</div>
            <SortOrderIcon
              style={styles.headerColumnIcon}
              hidden={key !== SORT_KEY_IP}
              asc={order === SORT_ORDER_ASC}
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
        {this.getSortedHosts().map(host => {
          return (
            <HostItem
              ref={host.id}
              key={host.id}
              host={host}
              selected={this.state.selectedIds.includes(host.id)}
              onEditHost={::this.handleEditHost}
            />
          )
        })}
      </TableBody>
    )
  }
  renderFooter() {
    const disabled = !this.state.selectedIds.length

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
              label="Delete"
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
        multiSelectable={false}
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
