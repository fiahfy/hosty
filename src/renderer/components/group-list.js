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

const SORT_KEY_NAME = 'name'
const SORT_ORDER_ASC = 'asc'
const SORT_ORDER_DESC = 'desc'

export default class GroupList extends Component {
  static propTypes = {
    groupId:        PropTypes.number,
    groups:         PropTypes.arrayOf(PropTypes.object),
    onEditGroup:    PropTypes.func,
    onSelectGroups: PropTypes.func
  };
  static defaultProps = {
    groupId:        0,
    groups:         [],
    onEditGroup:    () => {},
    onSelectGroups: () => {}
  };
  state = {
    sortOptions: {
      key:   SORT_KEY_NAME,
      order: SORT_ORDER_ASC
    },
    sortedMap: new Map,
    selectedIds: []
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.groupId === nextProps.groupId && this.props.groups.length) {
      return
    }

    this.setState({selectedIds: [nextProps.groupId]})
    this.sort(nextProps.groups, this.state.sortOptions)
  }
  getSelectedGroups() {
    return this.props.groups.filter(group => this.state.selectedIds.includes(group.id))
  }
  focusLastGroup() {
    const groups = this.sortedGroups()
    const group = groups[groups.length-1]
    this.refs[group.id].focus()
  }
  unselectAll() {
    this.setState({selectedIds: []})
  }
  sort(groups, options) {
    const {key, order} = options

    const sortedMap = new Map
    groups.concat().sort((a, b) => {
      const flag = order === SORT_ORDER_ASC
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

    this.setState({sortOptions: options, sortedMap})
  }
  handleEditGroup(group) {
    this.props.onEditGroup(group.id, group)
  }
  handleClickHeader(e, rowId, columnId) {
    const {key, order} = this.state.sortOptions

    const columns = [,,SORT_KEY_NAME]
    const newKey = columns[columnId]
    if (!newKey) {
      return
    }
    const newOrder = key !== newKey
      ? SORT_ORDER_ASC
      : order !== SORT_ORDER_ASC ? SORT_ORDER_ASC : SORT_ORDER_DESC

    this.sort(this.props.groups, {key: newKey, order: newOrder})
  }
  handleRowSelection(selectedRows) {
    const selectedGroups = this.sortedGroups()
        .filter((group, i) => selectedRows.includes(i))
    const selectedIds = selectedGroups.map(group => group.id)

    this.setState({selectedIds})
    this.props.onSelectGroups(selectedGroups)
  }
  sortedGroups() {
    const {sortedMap} = this.state

    return this.props.groups.concat().sort((a, b) => {
      if (!sortedMap.has(a.id)) {
        return 1
      }
      if (!sortedMap.has(b.id)) {
        return -1
      }
      return sortedMap.get(a.id) > sortedMap.get(b.id) ? 1 : -1
    })
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
  renderGroupNodes() {
    return this.sortedGroups().map(group => {
      return (
        <GroupItem
          ref={group.id}
          key={group.id}
          group={group}
          selected={this.state.selectedIds.includes(group.id)}
          onEditGroup={::this.handleEditGroup}
        />
      )
    })
  }
  render() {
    return (
      <Table
        multiSelectable={false}
        allRowsSelected={false}
        onRowSelection={::this.handleRowSelection}
      >
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow onCellClick={::this.handleClickHeader}>
            <TableHeaderColumn style={styles.iconColumn}>
              Status
            </TableHeaderColumn>
            <TableHeaderColumn style={styles.headerSortableColumn}>
              <div style={styles.headerColumnText}>Group</div>
              {this.renderSortArrow(SORT_KEY_NAME)}
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          showRowHover={true}
          deselectOnClickaway={false}
          displayRowCheckbox={false}
        >
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
