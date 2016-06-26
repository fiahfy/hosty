import React, {Component, PropTypes} from 'react'
import {
  TextField, IconButton,
  Table, TableHeader, TableBody,
  TableRow, TableHeaderColumn, TableRowColumn
} from 'material-ui'
import * as SvgIcons from 'material-ui/svg-icons'
import validator from 'validator'
import HostItem from './host-item'

export default class HostList extends Component {
  static propTypes = {
    hosts:      PropTypes.arrayOf(PropTypes.object),
    onEditHost: PropTypes.func
  };
  static defaultProps = {
    hosts:      [],
    onEditHost: () => {}
  };
  state = {
    sort: {
      key: 'host',
      order: 'asc'
    },
    sortedMap: new Map,
    selectedIds: [],
    allRowsSelected: false
  };
  selectedHosts() {
    const {hosts} = this.props
    const {selectedIds, allRowsSelected} = this.state
    if (allRowsSelected) {
      return hosts
    }
    return hosts.filter(host => {
      return selectedIds.includes(host.id)
    })
  }
  unselect() {
    this.setState({
      selectedIds: [],
      allRowsSelected: false
    })
  }
  handleEditHost(host) {
    this.props.onEditHost(host.id, host)
  }
  handleClickHeader(e, rowId, columnId) {
    if (columnId < 2) {
      return
    }
    const {hosts} = this.props
    const {sort} = this.state
    const key = columnId === 2 ? 'host' : 'ip'
    const order = sort.key !== key ? 'asc' : sort.order !== 'asc' ? 'asc' : 'desc'

    const sortedMap = new Map
    hosts.sort((a, b) => {
      const flag = order === 'asc'
      if (!a[key]) { return flag }
      if (!b[key]) { return !flag }
      return flag ? a[key] > b[key] : a[key] < b[key]
    }).map((host, i) => {
      sortedMap.set(host.id, i)
    })

    this.setState({sort: {key, order}, sortedMap})
  }
  handleRowSelection(selectedRows) {
    let selectedIds = []
    let allRowsSelected = false
    if (selectedRows === 'all') {
      selectedIds = []
      allRowsSelected = true
    } else {
      selectedIds = this.sortedHosts().filter((host, i) => {
        return selectedRows.includes(i)
      }).map(host => host.id)
    }
    this.setState({selectedIds, allRowsSelected})
  }
  sortedHosts() {
    const {hosts} = this.props
    const {sortedMap} = this.state

    return hosts.sort((a, b) => {
      return sortedMap.get(a.id)  > sortedMap.get(b.id)
    })
  }
  renderSortArrow(key) {
    const {sort} = this.state

    if (key !== sort.key) {
      return null
    }

    return sort.order === 'asc'
      ? <SvgIcons.NavigationArrowDropDown style={styles.headerColumnIcon} />
      : <SvgIcons.NavigationArrowDropUp style={styles.headerColumnIcon} />
  }
  renderHostNodes() {
    const {selectedIds} = this.state

    return this.sortedHosts().map(host => {
      return (
        <HostItem
          key={host.id}
          host={host}
          selected={selectedIds.includes(host.id)}
          onEditHost={::this.handleEditHost}
        />
      )
    })
  }
  render() {
    const {allRowsSelected} = this.state

    return (
      <Table
        multiSelectable={true}
        onRowSelection={::this.handleRowSelection}
        allRowsSelected={allRowsSelected}
      >
        <TableHeader>
          <TableRow onCellClick={::this.handleClickHeader}>
            <TableHeaderColumn style={styles.iconColumn}>Status</TableHeaderColumn>
            <TableHeaderColumn style={styles.headerSortableColumn}>
              <div style={styles.headerColumnText}>Host</div>
              {this.renderSortArrow('host')}
            </TableHeaderColumn>
            <TableHeaderColumn style={styles.headerSortableColumn}>
              <div style={styles.headerColumnText}>IP</div>
              {this.renderSortArrow('ip')}
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody showRowHover={false} deselectOnClickaway={false}>
          {this.renderHostNodes()}
        </TableBody>
      </Table>
    )
  }
}

const styles = {
  iconColumn: {
    width: 48,
    textAlign: 'center',
    paddingLeft: 0,
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
  }
}
