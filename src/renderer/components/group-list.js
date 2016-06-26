import React, {Component, PropTypes} from 'react'
import {
  TextField, IconButton,
  Table, TableHeader, TableBody,
  TableRow, TableHeaderColumn, TableRowColumn
} from 'material-ui'
import * as SvgIcons from 'material-ui/svg-icons'
import validator from 'validator'
import GroupItem from './group-item'

export default class GroupList extends Component {
  static propTypes = {
    groups:      PropTypes.arrayOf(PropTypes.object),
    onEditGroup: PropTypes.func
  };
  static defaultProps = {
    hosts:       [],
    onEditGroup: () => {}
  };
  state = {
    sort: {
      key: 'name',
      order: 'asc'
    },
    sortedMap: new Map,
    selectedIds: [],
    allRowsSelected: false
  };
  selectedGroups() {
    const {groups} = this.props
    const {selectedIds, allRowsSelected} = this.state
    if (allRowsSelected) {
      return groups
    }
    return groups.filter(group => {
      return selectedIds.includes(group.id)
    })
  }
  unselect() {
    this.setState({
      selectedIds: [],
      allRowsSelected: false
    })
  }
  handleEditGroup(group) {
    this.props.onEditGroup(group.id, group)
  }
  handleClickHeader(e, rowId, columnId) {
    if (columnId < 2) {
      return
    }
    const {groups} = this.props
    const {sort} = this.state
    const key = 'name'
    const order = sort.key !== key ? 'asc' : sort.order !== 'asc' ? 'asc' : 'desc'

    const sortedMap = new Map
    groups.sort((a, b) => {
      const flag = order === 'asc'
      if (!a[key]) { return flag }
      if (!b[key]) { return !flag }
      return flag ? a[key] > b[key] : a[key] < b[key]
    }).map((group, i) => {
      sortedMap.set(group.id, i)
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
      selectedIds = this.sortedGroups().filter((group, i) => {
        return selectedRows.includes(i)
      }).map(group => group.id)
    }
    this.setState({selectedIds, allRowsSelected})
  }
  sortedGroups() {
    const {groups} = this.props
    const {sortedMap} = this.state

    return groups.sort((a, b) => {
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
  renderGroupNodes() {
    const {selectedIds} = this.state

    return this.sortedGroups().map(group => {
      return (
        <GroupItem
          key={group.id}
          group={group}
          selected={selectedIds.includes(group.id)}
          onEditGroup={::this.handleEditGroup}
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
              <div style={styles.headerColumnText}>Group</div>
              {this.renderSortArrow('name')}
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody showRowHover={false} deselectOnClickaway={false}>
          {this.renderGroupNodes()}
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
