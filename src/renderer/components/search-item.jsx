import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  TableRow, TableRowColumn,
} from 'material-ui';
import HostStatusIcon from './host-status-icon';
import isUpdateNeeded from '../utils/is-update-needed';
import * as Host from '../utils/host';

const styles = {
  row: {
    cursor: 'pointer',
  },
  groupColumn: {
    width: '136px',
  },
  iconColumn: {
    paddingRight: '0',
    textAlign: 'center',
    verticalAlign: 'top',
    width: '48px',
  },
  button: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    height: '100%',
    lineHeight: '48px',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    outline: 'none',
    overflow: 'hidden',
    padding: '0',
    textAlign: 'left',
    textOverflow: 'ellipsis',
    width: '100%',
  },
};

export default class SearchItem extends Component {
  static propTypes = {
    ...TableRow.propTypes,
    group: PropTypes.object,
    host: PropTypes.object,
  };
  static defaultProps = {
    group: {},
    host: {},
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState);
  }
  render() {
    const { group, host } = this.state;
    const { selected, onRowClick, ...others } = this.props;
    delete others.group;
    delete others.host;

    const invalid = !Host.isValid(host);

    return (
      <TableRow
        key={host.id}
        style={styles.row}
        selected={selected}
        onRowClick={(...args) => {
          if (window.getSelection().toString().length) {
            return;
          }
          onRowClick(...args);
        }}
        {...others}
      >
        {others.children}
        <TableRowColumn style={styles.iconColumn}>
          <IconButton onClick={e => this.handleClickIconButton(e)}>
            <HostStatusIcon
              invalid={false}
              enable={group.enable}
            />
          </IconButton>
        </TableRowColumn>
        <TableRowColumn style={styles.groupColumn}>
          <button style={styles.button}>
            {group.name}
          </button>
        </TableRowColumn>
        <TableRowColumn style={styles.iconColumn}>
          <IconButton onClick={e => this.handleClickIconButton(e)}>
            <HostStatusIcon
              invalid={invalid}
              enable={host.enable}
            />
          </IconButton>
        </TableRowColumn>
        <TableRowColumn>
          <button style={styles.button}>
            {host.host}
          </button>
        </TableRowColumn>
        <TableRowColumn>
          <button style={styles.button}>
            {host.ip}
          </button>
        </TableRowColumn>
      </TableRow>
    );
  }
}
