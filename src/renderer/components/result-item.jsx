import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  TableRow, TableRowColumn,
} from 'material-ui';
import { colors } from 'material-ui/styles';
import HostStatusIcon from './host-status-icon';
import EditableLabel from './editable-label';
import isUpdateNeeded from '../utils/is-update-needed';
import * as Group from '../utils/group';
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
};

export default class ResultItem extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    result: PropTypes.object,
    selected: PropTypes.bool,
    ...TableRow.propTypes,
  };
  static defaultProps = {
    result: {},
    selected: false,
    ...TableRow.defaultProps,
  };
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return isUpdateNeeded(this, nextProps, nextState, nextContext);
  }
  render() {
    const { result, selected, ...others } = this.props;

    const valid = Host.isValid(result.host);
    const count = (result.group.hosts || []).length;
    const isValidHost = Host.isValidHost(result.host.host);
    const isValidIp = Host.isValidIp(result.host.ip);

    return (
      <TableRow
        style={styles.row}
        selected={selected}
        {...others}
      >
        {others.children}
        <TableRowColumn style={styles.iconColumn}>
          <IconButton>
            <HostStatusIcon
              valid
              enable={result.group.enable}
            />
          </IconButton>
        </TableRowColumn>
        <TableRowColumn style={styles.groupColumn}>
          <EditableLabel
            name={Group.KEY_NAME}
            ref={(input) => { this.textInput = input; }}
            defaultValue={result.group.name}
            hintText="Group"
            fullWidth
            editable={false}
          />
        </TableRowColumn>
        <TableRowColumn style={styles.shrinkColumn}>
          {count}
        </TableRowColumn>
        <TableRowColumn style={styles.iconColumn}>
          <IconButton>
            <HostStatusIcon
              valid={valid}
              enable={result.host.enable}
            />
          </IconButton>
        </TableRowColumn>
        <TableRowColumn>
          <EditableLabel
            name={Host.KEY_HOST}
            ref={(input) => { this.hostTextInput = input; }}
            defaultValue={result.host.host}
            hintText="example.com"
            errorText={isValidHost ? null : ' '}
            errorStyle={styles.errorTextField}
            fullWidth
            editable={false}
          />
        </TableRowColumn>
        <TableRowColumn>
          <EditableLabel
            name={Host.KEY_IP}
            ref={(input) => { this.ipTextInput = input; }}
            defaultValue={result.host.ip}
            hintText="192.0.2.0"
            errorText={isValidIp ? null : ' '}
            errorStyle={styles.errorTextField}
            fullWidth
            editable={false}
          />
        </TableRowColumn>
      </TableRow>
    );
  }
}
