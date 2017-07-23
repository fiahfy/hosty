import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton, TableRow, TableRowColumn,
} from 'material-ui';
import { colors } from 'material-ui/styles';
import StatusIcon from './status-icon';
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
    borderColor: colors.yellow700,
  },
};

export default class HostItem extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    host: PropTypes.object,
    selected: PropTypes.bool,
    focused: PropTypes.bool,
    editable: PropTypes.bool,
    onEditHost: PropTypes.func,
    ...TableRow.propTypes,
  };
  static defaultProps = {
    host: {},
    selected: false,
    focused: false,
    editable: false,
    onEditHost: () => {},
    ...TableRow.defaultProps,
  };
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return isUpdateNeeded(this, nextProps, nextState, nextContext);
  }
  handleClickIconButton(e) {
    e.stopPropagation();
    const { host, onEditHost } = this.props;
    const newHost = Object.assign({}, host, {
      enable: !host.enable,
    });
    onEditHost(newHost);
  }
  handleChange(e) {
    const { host, onEditHost } = this.props;
    const { name, value } = e.target;
    const newHost = Object.assign({}, host, {
      [name]: value.trim(),
    });
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
    const { host, selected, focused, editable, ...others } = this.props;
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
            <StatusIcon
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
            fullWidth
            underlineFocusStyle={isValidHost ? null : styles.errorTextField}
            onKeyDown={e => this.handleKeyDown(e)}
            onBlur={e => this.handleChange(e)}
            onChange={e => this.handleChange(e)}
            focused={focused}
            editable={editable}
          />
        </TableRowColumn>
        <TableRowColumn>
          <EditableLabel
            name={Host.KEY_IP}
            ref={(input) => { this.ipTextInput = input; }}
            defaultValue={host.ip}
            hintText="192.0.2.0"
            fullWidth
            underlineFocusStyle={isValidIp ? null : styles.errorTextField}
            onKeyDown={e => this.handleKeyDown(e)}
            onBlur={e => this.handleChange(e)}
            onChange={e => this.handleChange(e)}
            editable={editable}
          />
        </TableRowColumn>
      </TableRow>
    );
  }
}
