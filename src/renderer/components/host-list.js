import React, {Component, PropTypes} from 'react'
import {
  TextField, IconButton,
  Table, TableHeader, TableBody,
  TableRow, TableHeaderColumn, TableRowColumn
} from 'material-ui'
import * as SvgIcons from 'material-ui/svg-icons'
import * as Styles from 'material-ui/styles'

export default class HostList extends Component {
  static propTypes = {
    hosts: PropTypes.arrayOf(PropTypes.object)
  };
  static defaultProps = {
    hosts: []
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
  handleToggleHostStatus(index, e) {
    e.stopPropagation()
    const host = this.props.hosts[index]
    host.enable = !host.enable
    this.props.onEditHost(host.index, host)
  }
  handleEditHost(index, e) {
    const {name, value} = e.target
    const host = this.props.hosts[index]
    host[name] = value
    this.props.onEditHost(host.index, host)
  }
  handleInputHost(e) {
    if (e.keyCode === 13) {
      e.target.blur()
    }
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
  render() {
    const {sort, selectedIndexes, allRowsSelected} = this.state
    const {hosts, onRowSelection} = this.props

    let hostOrderNode = null
    if (sort.key === 'host') {
      hostOrderNode = sort.order === 'asc'
        ? <SvgIcons.NavigationArrowDropDown style={styles.headerColumnIcon} />
        : <SvgIcons.NavigationArrowDropUp style={styles.headerColumnIcon} />
    }

    let ipOrderNode = null
    if (sort.key === 'ip') {
      ipOrderNode = sort.order === 'asc'
        ? <SvgIcons.NavigationArrowDropDown style={styles.headerColumnIcon} />
        : <SvgIcons.NavigationArrowDropUp style={styles.headerColumnIcon} />
    }

    const hostNodes = this.sortedHosts().map(host => {
      const color = host.enable ? Styles.colors.green600 : Styles.colors.grey400
      return (
        <TableRow key={host.index} selected={selectedIndexes.indexOf(host.index) !== -1}>
          <TableRowColumn style={styles.iconColumn}>
            <IconButton onClick={this.handleToggleHostStatus.bind(this, host.index)}>
              <SvgIcons.ActionDone color={color} />
            </IconButton>
          </TableRowColumn>
          <TableRowColumn>
            <TextField name="host" hintText="example.com" underlineShow={false}
              defaultValue={host.host}
              onClick={e => e.stopPropagation()}
              onBlur={this.handleEditHost.bind(this, host.index)}
              onKeyDown={::this.handleInputHost} />
          </TableRowColumn>
          <TableRowColumn>
            <TextField name="ip" hintText="111.111.111.111" underlineShow={false}
              defaultValue={host.ip}
              onClick={e => e.stopPropagation()}
              onBlur={this.handleEditHost.bind(this, host.index)}
              onKeyDown={::this.handleInputHost} />
          </TableRowColumn>
        </TableRow>
      )
    })

    return (
      <Table multiSelectable={true} onRowSelection={::this.handleRowSelection} allRowsSelected={allRowsSelected}>
        <TableHeader>
          <TableRow onCellClick={::this.handleClickHeader}>
            <TableHeaderColumn style={styles.iconColumn}>Status</TableHeaderColumn>
            <TableHeaderColumn style={styles.headerSortableColumn}>
              <div style={styles.headerColumnText}>Host</div>
              {hostOrderNode}
            </TableHeaderColumn>
            <TableHeaderColumn style={styles.headerSortableColumn}>
              <div style={styles.headerColumnText}>IP</div>
              {ipOrderNode}
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody showRowHover={false} deselectOnClickaway={false}>
          {hostNodes}
        </TableBody>
      </Table>
    )
  }
}

const styles = {
  iconColumn: {
    width: '48px'
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
