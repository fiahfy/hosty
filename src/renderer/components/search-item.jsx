import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TableRow, TableRowColumn,
} from 'material-ui';
import { colors } from 'material-ui/styles';
import HostStatusIcon from './host-status-icon';
import isUpdateNeeded from '../utils/is-update-needed';
import * as Host from '../utils/host';

const styles = {
  row: {
    cursor: 'pointer',
  },
  groupColumn: {
    width: '111px',
    paddingRight: '0',
  },
  iconColumn: {
    paddingRight: '0',
    textAlign: 'center',
    verticalAlign: 'top',
    width: '48px',
  },
  shrinkColumn: {
    color: colors.grey500,
    fontSize: '11px',
    paddingLeft: '0',
    paddingRight: '25px',
    textAlign: 'right',
    width: '25px',
  },
  icon: {
    margin: '12px',
    verticalAlign: 'top',
  },
  button: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    height: '100%',
    lineHeight: '48px',
    fontFamily: 'Roboto, sans-serif',
    fontSize: 'inherit',
    outline: 'none',
    overflow: 'hidden',
    padding: '0',
    textAlign: 'left',
    textOverflow: 'ellipsis',
    width: '100%',
  },
};

export default class SearchItem extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    ...TableRow.propTypes,
    item: PropTypes.object,
  };
  static defaultProps = {
    item: {},
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState);
  }
  render() {
    const { item, onRowClick, ...others } = this.props;

    const valid = Host.isValid(item.host);
    const count = (item.group.hosts || []).length;
    const color = this.context.muiTheme.textField.textColor;
    const butonStyle = { ...styles.button, color };

    return (
      <TableRow
        style={styles.row}
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
          <HostStatusIcon
            style={styles.icon}
            valid
            enable={item.group.enable}
          />
        </TableRowColumn>
        <TableRowColumn style={styles.groupColumn}>
          <button style={butonStyle}>
            {item.group.name}
          </button>
        </TableRowColumn>
        <TableRowColumn style={styles.shrinkColumn}>
          {count}
        </TableRowColumn>
        <TableRowColumn style={styles.iconColumn}>
          <HostStatusIcon
            style={styles.icon}
            valid={valid}
            enable={item.host.enable}
          />
        </TableRowColumn>
        <TableRowColumn>
          <button style={butonStyle}>
            {item.host.host}
          </button>
        </TableRowColumn>
        <TableRowColumn>
          <button style={butonStyle}>
            {item.host.ip}
          </button>
        </TableRowColumn>
      </TableRow>
    );
  }
}
