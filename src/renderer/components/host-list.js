import React, {Component, PropTypes} from 'react'
import {
  TextField, IconButton, FlatButton,
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHeaderColumn, TableRowColumn
} from 'material-ui'
import * as SvgIcons from 'material-ui/svg-icons'
import validator from 'validator'
import HostItem from './host-item'
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
    onSelectHosts: PropTypes.func
  };
  static defaultProps = {
    groupId:       0,
    hosts:         [],
    onEditHost:    () => {},
    onSelectHosts: () => {}
  };
  state = {
    sortOptions: {
      key:   SORT_KEY_HOST,
      order: SORT_ORDER_ASC
    },
    sortedMap: new Map,
    selectedIds: []
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.groupId === nextProps.groupId && this.props.hosts.length) {
      return
    }

    this.setState({selectedIds: []})
    this.sort(nextProps.hosts, this.state.sortOptions)
  }
  getSelectedHosts() {
    return this.getSortedHosts().filter(host => this.state.selectedIds.includes(host.id))
  }
  getSortedHosts() {
    const {sortedMap} = this.state

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
    const host = hosts[hosts.length-1]
    this.refs[host.id].focus()
  }
  select(ids) {
    this.setState({selectedIds: ids})
  }
  unselectAll() {
    this.setState({selectedIds: []})
  }
  sort(hosts, options) {
    const {key, order} = options

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

    this.setState({sortOptions: options, sortedMap})
  }
  handleEditHost(host) {
    this.props.onEditHost(host.id, host)
  }
  handleClickHeader(e, rowId, columnId) {
    const {key, order} = this.state.sortOptions

    const columns = [,,SORT_KEY_HOST, SORT_KEY_IP]
    const newKey = columns[columnId]
    if (!newKey) {
      return
    }
    const newOrder = key !== newKey
      ? SORT_ORDER_ASC
      : order !== SORT_ORDER_ASC ? SORT_ORDER_ASC : SORT_ORDER_DESC

    this.sort(this.props.hosts, {key: newKey, order: newOrder})
  }
  handleRowSelection(selectedRows) {
    const selectedHosts = this.getSortedHosts()
        .filter((host, i) => selectedRows.includes(i))
    const selectedIds = selectedHosts.map(host => host.id)

    this.setState({selectedIds})
    this.props.onSelectHosts(selectedHosts)
  }
  renderSortArrow(targetKey) {
    const {key, order} = this.state.sortOptions

    if (targetKey !== key) {
      return null
    }

    return order === SORT_ORDER_ASC
      ? <SvgIcons.NavigationArrowDropDown style={styles.headerColumnIcon} />
      : <SvgIcons.NavigationArrowDropUp style={styles.headerColumnIcon} />
  }
  renderHostNodes() {
    return this.getSortedHosts().map(host => {
      return (
        <HostItem
          ref={host.id}
          key={host.id}
          host={host}
          selected={this.state.selectedIds.includes(host.id)}
          onEditHost={::this.handleEditHost}
        />
      )
    })
  }
  render() {
    return (
      <Table
        multiSelectable={true}
        allRowsSelected={false}
        onRowSelection={::this.handleRowSelection}
      >
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
              {this.renderSortArrow(SORT_KEY_HOST)}
            </TableHeaderColumn>
            <TableHeaderColumn style={styles.headerSortableColumn}>
              <div style={styles.headerColumnText}>IP</div>
              {this.renderSortArrow(SORT_KEY_IP)}
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          showRowHover={true}
          deselectOnClickaway={false}
          displayRowCheckbox={false}
        >
          {this.renderHostNodes()}
        </TableBody>
        <TableFooter
          adjustForCheckbox={true}
        >
          <TableRow>
            <TableRowColumn colSpan="3">
              <FlatButton
                label="Add"
                onClick={this.props.onAddHost}
                primary={true}
                style={styles.button}
              />
              <FlatButton
                label="Delete"
                onClick={this.props.onDeleteHosts}
                secondary={true}
                style={styles.button}
              />
            </TableRowColumn>
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
}

const styles = {
  headerIconColumn: {
    width: 48,
    textAlign: 'center',
    paddingRight: 0
  },
  headerSortableColumn: {
    cursor: 'pointer'
  },
  headerColumnText: {
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  headerColumnIcon: {
    verticalAlign: 'middle'
  },
  button: {
    marginLeft: 20,
    marginRight: 20
  }
}
