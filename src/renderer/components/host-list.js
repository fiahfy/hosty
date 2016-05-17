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
    hosts: [],
    onEditHost: () => {}
  };
  state = {
    sort: {
      key: 'host',
      order: 'asc'
    },
    selectedIndexes: [],
    allRowsSelected: false
  };
  selectedHosts() {
    const {selectedIndexes, allRowsSelected} = this.state
    if (allRowsSelected) {
      return this.props.hosts
    }
    return this.props.hosts.filter(host => {
      return selectedIndexes.indexOf(host.index) !== -1
    })
  }
  unselect() {
    this.setState({
      selectedIndexes: [],
      allRowsSelected: false
    })
  }
  handleEditHost(host) {
    this.props.onEditHost(host.index, host)
  }
  handleClickHeader(e, rowId, columnId) {
    if (columnId < 2) {
      return
    }
    const {key, order} = this.state.sort
    const newKey = columnId === 2 ? 'host' : 'ip'
    const newOrder = key !== newKey ? 'asc' : order !== 'asc' ? 'asc' : 'desc'
    this.setState({sort: {key: newKey, order: newOrder}})
  }
  handleRowSelection(selectedRows) {
    let selectedIndexes = []
    let allRowsSelected = false
    if (selectedRows === 'all') {
      selectedIndexes = []
      allRowsSelected = true
    } else {
      selectedIndexes = this.sortedHosts().filter((host, i) => {
        return selectedRows.indexOf(i) !== -1
      }).map(host => host.index)
    }
    this.setState({selectedIndexes, allRowsSelected})
  }
  sortedHosts() {
    const {key, order} = this.state.sort

    return this.props.hosts.map((host, index) => {
      host.index = index
      return host
    }).sort((a, b) => {
      return order === 'asc' ? a[key] > b[key] : a[key] < b[key]
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
    const {selectedIndexes} = this.state

    return this.sortedHosts().map(host => {
      return (
        <HostItem
          key={host.index}
          host={host}
          selected={selectedIndexes.indexOf(host.index) !== -1}
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
    width: '48px',
    textAlign: 'center'
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
