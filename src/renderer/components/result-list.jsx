import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatButton, TextField,
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHeaderColumn, TableRowColumn,
} from 'material-ui';
import ResultItem from './result-item';
import isUpdateNeeded from '../utils/is-update-needed';

const styles = {
  groupHeaderColumn: {
    width: '137px',
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

export default class ResultList extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    results: PropTypes.arrayOf(PropTypes.object),
    query: PropTypes.string,
    sortOptions: PropTypes.object,
    onSelectResult: PropTypes.func,
    onSortResults: PropTypes.func, // eslint-disable-line
    onSearch: PropTypes.func,
  };
  static defaultProps = {
    results: [],
    query: '',
    sortOptions: {},
    onSelectResult: () => {},
    onSortResults: () => {},
    onSearch: () => {},
  };
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return isUpdateNeeded(this, nextProps, nextState, nextContext);
  }
  handleHeaderClick(e, rowId, columnId) { // eslint-disable-line
    // TODO:
  }
  handleCellClick(rowId) {
    const { results, onSelectResult } = this.props;
    const result = results[rowId];
    if (!result) {
      return;
    }
    onSelectResult([result.group.id, result.host.id]);
  }
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.searchButton.props.onClick();
    }
  }
  handleSearch() {
    this.props.onSearch(this.textInput.getValue());
  }
  renderHeader() {
    const { key, order } = this.props.sortOptions; // eslint-disable-line

    return (
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        <TableRow onCellClick={(...args) => this.handleHeaderClick(...args)}>
          <TableHeaderColumn style={styles.iconHeaderColumn}>
            Status
          </TableHeaderColumn>
          <TableHeaderColumn
            colSpan="2"
            style={{
              ...styles.groupHeaderColumn,
              ...styles.sortableHeaderColumn,
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
  renderBody() {
    const { results } = this.props;

    return (
      <TableBody
        showRowHover
        deselectOnClickaway={false}
        displayRowCheckbox={false}
      >
        {results.map(result => (
          <ResultItem
            key={`${result.group.id}-${result.host.id}`}
            result={result}
          />
        ))}
      </TableBody>
    );
  }
  renderFooter() {
    const { query } = this.props;

    return (
      <TableFooter
        adjustForCheckbox={false}
      >
        <TableRow>
          <TableRowColumn style={styles.textFieldFooterColumn}>
            <TextField
              name="query"
              defaultValue={query}
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
              onClick={() => this.handleSearch()}
            />
          </TableRowColumn>
        </TableRow>
      </TableFooter>
    );
  }
  render() {
    return (
      <Table
        allRowsSelected={false}
        multiSelectable
        onCellClick={(...args) => this.handleCellClick(...args)}
      >
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
      </Table>
    );
  }
}
