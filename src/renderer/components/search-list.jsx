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
  },
  headerIconColumn: {
    paddingRight: '0',
    textAlign: 'center',
    width: '48px',
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
  footerTextFieldColumn: {
    width: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
  footerButtonColumn: {
    width: '128px',
  },
  button: {
    marginLeft: '20px',
    marginRight: '20px',
  },
};

export default class SearchList extends Component {
  static propTypes = {
    groups: PropTypes.arrayOf(PropTypes.object),
  };
  static defaultProps = {
    groups: [],
  };
  static renderHeader() {
    return (
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        <TableRow>
          <TableHeaderColumn style={styles.headerIconColumn}>
            Status
          </TableHeaderColumn>
          <TableHeaderColumn
            style={{
              ...styles.headerGroupColumn,
              ...styles.headerSortableColumn,
            }}
          >
            <div style={styles.headerColumnText}>Group</div>
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.headerIconColumn}>
            Status
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.headerSortableColumn}>
            <div style={styles.headerColumnText}>Host</div>
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.headerSortableColumn}>
            <div style={styles.headerColumnText}>IP</div>
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
    );
  }
  state = {
    query: '',
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState);
  }
  getItems() {
    const { query } = this.state;

    /* eslint-disable arrow-body-style */
    return this.props.groups.reduce((prev, current) => {
      return prev.concat((current.hosts || []).map((host) => {
        return { group: current, host };
      }));
    }, [])
    .filter((item) => {
      if (query === '') {
        return true;
      }
      if ((item.host.host || '').indexOf(query) > -1) {
        return true;
      }
      if ((item.host.ip || '').indexOf(query) > -1) {
        return true;
      }
      return false;
    });
    /* eslint-enable allow-body-style */
  }
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.searchButton.props.onClick();
    }
  }
  search() {
    this.setState({ query: this.textInput.getValue() });
  }
  renderBody() {
    return (
      <TableBody
        showRowHover
        deselectOnClickaway={false}
        displayRowCheckbox={false}
      >
        {this.getItems().map(item => (
          <SearchItem
            key={`${item.group.id}-${item.host.id}`}
            group={item.group}
            host={item.host}
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
          <TableRowColumn style={styles.footerTextFieldColumn}>
            <TextField
              name="query"
              style={styles.textField}
              ref={(input) => { this.textInput = input; }}
              autoFocus
              fullWidth
              onKeyDown={e => this.handleKeyDown(e)}
            />
          </TableRowColumn>
          <TableRowColumn style={styles.footerButtonColumn}>
            <FlatButton
              label="Search"
              style={styles.button}
              ref={(button) => { this.searchButton = button; }}
              primary
              onClick={() => this.search()}
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
        selectable={false}
      >
        {this.constructor.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
      </Table>
    );
  }
}
