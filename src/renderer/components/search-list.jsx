import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatButton, TextField,
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHeaderColumn, TableRowColumn,
} from 'material-ui';
import SearchItem from './search-item';
import isUpdateNeeded from '../utils/is-update-needed';

const styles = {
  headerGroupColumn: {
    width: '136px',
    userSelect: 'none',
  },
  iconHeaderColumn: {
    paddingRight: '0',
    textAlign: 'center',
    userSelect: 'none',
    width: '48px',
  },
  sortableHeaderColumn: {
    cursor: 'pointer',
    userSelect: 'none',
  },
  label: {
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  icon: {
    verticalAlign: 'middle',
  },
  textFieldFooterColumn: {
    paddingLeft: '20px',
    paddingRight: '20px',
    verticalAlign: 'middle',
    width: '100%',
  },
  buttonFooterColumn: {
    paddingLeft: '20px',
    paddingRight: '20px',
    verticalAlign: 'middle',
    width: '88px',
  },
};

export default class SearchList extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    onSelectItems: PropTypes.func,
    onSearchItems: PropTypes.func,
  };
  static defaultProps = {
    items: [],
    onSelectItems: () => {},
    onSearchItems: () => {},
  };
  static renderHeader() {
    return (
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        <TableRow>
          <TableHeaderColumn style={styles.iconHeaderColumn}>
            Status
          </TableHeaderColumn>
          <TableHeaderColumn
            style={{
              ...styles.headerGroupColumn,
              ...styles.headerSortableColumn,
            }}
          >
            <div style={styles.label}>Group</div>
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.iconHeaderColumn}>
            Status
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.sortableHeaderColumn}>
            <div style={styles.label}>Host</div>
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.sortableHeaderColumn}>
            <div style={styles.label}>IP</div>
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
    );
  }
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState);
  }
  handleRowSelection(selectedRows) {
    const { items, onSelectItems } = this.props;
    const ids = items.filter((item, i) => selectedRows.includes(i))
      .map(item => [item.group.id, item.id]);
    onSelectItems(ids);
  }
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.searchButton.props.onClick();
    }
  }
  handleSearchItems() {
    this.props.onSearchItems(this.textInput.getValue());
  }
  renderBody() {
    const { items } = this.props;

    return (
      <TableBody
        showRowHover
        deselectOnClickaway={false}
        displayRowCheckbox={false}
      >
        {items.map(item => (
          <SearchItem
            key={`${item.group.id}-${item.host.id}`}
            item={item}
          />
        ))}
      </TableBody>
    );
  }
  renderFooter() {
    return (
      <TableFooter
        adjustForCheckbox
      >
        <TableRow>
          <TableRowColumn style={styles.textFieldFooterColumn}>
            <TextField
              name="query"
              style={styles.textField}
              ref={(input) => { this.textInput = input; }}
              autoFocus
              fullWidth
              onKeyDown={e => this.handleKeyDown(e)}
            />
          </TableRowColumn>
          <TableRowColumn style={styles.buttonFooterColumn}>
            <FlatButton
              label="Search"
              style={styles.button}
              ref={(button) => { this.searchButton = button; }}
              primary
              onClick={() => this.handleSearchItems()}
            />
          </TableRowColumn>
        </TableRow>
      </TableFooter>
    );
  }
  render() {
    return (
      <Table
        multiSelectable={false}
        allRowsSelected={false}
        onRowSelection={selectedRows => this.handleRowSelection(selectedRows)}
      >
        {this.constructor.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
      </Table>
    );
  }
}
