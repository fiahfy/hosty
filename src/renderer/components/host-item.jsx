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
import * as Host from '../utils/host';

const styles = {
  row: {
    cursor: 'pointer',
  },
  iconColumn: {
    paddingRight: '0',
    textAlign: 'center',
    verticalAlign: 'top',
    width: '48px',
  },
  errorTextField: {
    color: colors.yellow700,
  },
};

export default class HostItem extends Component {
  static propTypes = {
    host: PropTypes.object,
    selected: PropTypes.bool,
    focused: PropTypes.bool,
    onEditHost: PropTypes.func,
    ...TableRow.propTypes,
  };
  static defaultProps = {
    host: {},
    selected: false,
    focused: false,
    onEditHost: () => {},
    ...TableRow.defaultProps,
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState);
  }
  handleClickIconButton(e) {
    e.stopPropagation();
    const { host, onEditHost } = this.props;
    const newHost = Object.assign({}, host);
    newHost.enable = !newHost.enable;
    onEditHost(newHost);
  }
  handleBlur(e) {
    const { host, onEditHost } = this.props;
    const { name, value } = e.target;
    const newHost = Object.assign({}, host);
    newHost[name] = value.trim();
    onEditHost(newHost);
  }
  handleChange(e) {
    const { host, onEditHost } = this.props;
    const { name, value } = e.target;
    const newHost = Object.assign({}, host);
    newHost[name] = value.trim();
    onEditHost(newHost);
  }
  handleKeyDown(e) {
    const { name } = e.target;
    if (e.keyCode === 9 && !e.shiftKey && name === Host.KEY_HOST) {
      e.preventDefault();
      this.ipTextInput.focus();
      return;
    }
    if (e.keyCode === 9 && e.shiftKey && name === Host.KEY_IP) {
      e.preventDefault();
      this.hostTextInput.focus();
      return;
    }
    if (e.keyCode === 13) {
      e.target.blur();
    }
  }
  render() {
    const { host, selected, focused, ...others } = this.props;
    delete others.onEditHost;

    const isValidHost = Host.isValidHost(host.host);
    const isValidIp = Host.isValidIp(host.ip);
    const valid = isValidHost && isValidIp;

    return (
      <TableRow
        style={styles.row}
        selected={selected}
        {...others}
      >
        {others.children}
        <TableRowColumn style={styles.iconColumn}>
          <IconButton onClick={e => this.handleClickIconButton(e)}>
            <HostStatusIcon
              valid={valid}
              enable={host.enable}
            />
          </IconButton>
        </TableRowColumn>
        <TableRowColumn>
          <EditableLabel
            name={Host.KEY_HOST}
            ref={(input) => { this.hostTextInput = input; }}
            defaultValue={host.host}
            hintText="example.com"
            errorText={isValidHost ? null : ' '}
            errorStyle={styles.errorTextField}
            fullWidth
            onBlur={e => this.handleBlur(e)}
            onKeyDown={e => this.handleKeyDown(e)}
            onChange={e => this.handleChange(e)}
            focused={focused}
            editable={selected}
          />
        </TableRowColumn>
        <TableRowColumn>
          <EditableLabel
            name={Host.KEY_IP}
            ref={(input) => { this.ipTextInput = input; }}
            defaultValue={host.ip}
            hintText="192.0.2.0"
            errorText={isValidIp ? null : ' '}
            errorStyle={styles.errorTextField}
            fullWidth
            onBlur={e => this.handleBlur(e)}
            onKeyDown={e => this.handleKeyDown(e)}
            onChange={e => this.handleChange(e)}
            editable={selected}
          />
        </TableRowColumn>
      </TableRow>
    );
  }
}
