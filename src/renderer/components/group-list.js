import React, { Component, PropTypes } from 'react'
import {
  FlatButton,
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHeaderColumn, TableRowColumn,
} from 'material-ui'
import GroupItem from './group-item'
import SortOrderIcon from './sort-order-icon'
import isUpdateNeeded from '../utils/is-update-needed'
import HostGroup from '../utils/host-group'

const SORT_KEY_NAME = 'name'
const SORT_ORDER_ASC = 'asc'
const SORT_ORDER_DESC = 'desc'

export default class GroupList extends Component {
  static propTypes = {
    groupId: PropTypes.number,
    groups: PropTypes.arrayOf(PropTypes.object),
    onAddGroup: PropTypes.func,
    onEditGroup: PropTypes.func,
    onDeleteGroups: PropTypes.func,
    onSelectGroups: PropTypes.func,
  };
  static defaultProps = {
    groupId: 0,
    groups: [],
    onAddGroup: () => {},
    onEditGroup: () => {},
    onDeleteGroups: () => {},
    onSelectGroups: () => {},
  };
  state = {
    sortOptions: {
      key: SORT_KEY_NAME,
      order: SORT_ORDER_ASC,
    },
    sortedMap: new Map,
    selectedIds: [],
  };
  componentWillReceiveProps(nextProps) {
    const selectedIds = nextProps.groupId ? [nextProps.groupId] : []
    this.setState({ selectedIds })

    if (this.props.groups.length) {
      return
    }

    this.sort(nextProps.groups, this.state.sortOptions)
  }
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState)
  }
  getSelectedGroups() {
    return this.getSortedGroups().filter(group => this.state.selectedIds.includes(group.id))
  }
  getSortedGroups() {
    const { sortedMap } = this.state

    return this.props.groups.concat().sort((a, b) => {
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
  focusLastGroup() {
    const groups = this.getSortedGroups()
    const group = groups[groups.length - 1]
    this.refs[group.id].focus()
  }
  select(ids) {
    this.setState({ selectedIds: ids })
  }
  deselectAll() {
    this.setState({ selectedIds: [] })
  }
  sort(groups, options) {
    const { key, order } = options

    const flag = order === SORT_ORDER_ASC ? 1 : -1
    const sortedMap = new Map
    groups.concat().sort((a, b) => (
      flag * HostGroup.compare(a, b, key)
    )).forEach((group, i) => {
      sortedMap.set(group.id, i)
    })

    this.setState({ sortOptions: options, sortedMap })
  }
  handleEditGroup(group) {
    this.props.onEditGroup(group.id, group)
  }
  handleClickHeader(e, rowId, columnId) {
    const { key, order } = this.state.sortOptions

    const columns = [null, null, SORT_KEY_NAME]
    const newKey = columns[columnId]
    if (!newKey) {
      return
    }
    let newOrder
    if (key !== newKey || order !== SORT_ORDER_ASC) {
      newOrder = SORT_ORDER_ASC
    } else {
      newOrder = SORT_ORDER_DESC
    }
    this.sort(this.props.groups, { key: newKey, order: newOrder })
  }
  handleRowSelection(selectedRows) {
    const selectedGroups = this.getSortedGroups()
        .filter((group, i) => selectedRows.includes(i))
    const selectedIds = selectedGroups.map(group => group.id)

    this.setState({ selectedIds })
    this.props.onSelectGroups(selectedGroups)
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
            <div style={styles.headerColumnText}>Group</div>
            <SortOrderIcon
              style={styles.headerColumnIcon}
              hidden={key !== SORT_KEY_NAME}
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
        {this.getSortedGroups().map(group => (
          <GroupItem
            ref={group.id}
            key={group.id}
            group={group}
            selected={this.state.selectedIds.includes(group.id)}
            onEditGroup={::this.handleEditGroup}
          />
        ))}
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
          <TableRowColumn colSpan="2">
            <FlatButton
              label="Add"
              style={styles.button}
              primary
              onClick={this.props.onAddGroup}
            />
            <FlatButton
              label="Delete"
              style={styles.button}
              secondary
              onClick={this.props.onDeleteGroups}
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
