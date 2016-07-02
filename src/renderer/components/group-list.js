import React, {Component, PropTypes} from 'react'
import {
  TextField, IconButton,
  Table, TableHeader, TableBody,
  TableRow, TableHeaderColumn, TableRowColumn
} from 'material-ui'
import * as SvgIcons from 'material-ui/svg-icons'
import validator from 'validator'
import GroupItem from './group-item'
import isUpdateNeeded from '../utils/is-update-needed'

export default class GroupList extends Component {
  static propTypes = {
    groups:        PropTypes.arrayOf(PropTypes.object),
    onEditGroup:   PropTypes.func,
    onSelectGroup: PropTypes.func
  };
  static defaultProps = {
    hosts:         [],
    onEditGroup:   () => {},
    onSelectGroup: () => {}
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
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState)
  }
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
    groups.slice().sort((a, b) => {
      const flag = order === 'asc'
      if (!a[key]) {
        return flag ? 1 : -1
      }
      if (!b[key]) {
        return !flag ? 1 : -1
      }
      return (flag ? a[key] > b[key] : a[key] < b[key]) ? 1 : -1
    }).map((group, i) => {
      sortedMap.set(group.id, i)
    })

    this.setState({sort: {key, order}, sortedMap})
  }
  handleRowSelection(selectedRows) {
    const {onSelectGroup} = this.props

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
    onSelectGroup(selectedIds[0])
    this.setState({selectedIds, allRowsSelected})
  }
  sortedGroups() {
    const {groups} = this.props
    const {sortedMap} = this.state

    return groups.slice().sort((a, b) => {
      if (!sortedMap.has(a.id)) {
        return 1
      }
      if (!sortedMap.has(b.id)) {
        return -1
      }
      return sortedMap.get(a.id)  > sortedMap.get(b.id) ? 1 : -1
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
        multiSelectable={false}
        onRowSelection={::this.handleRowSelection}
        allRowsSelected={allRowsSelected}
      >
        <TableHeader displaySelectAll={false}>
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
