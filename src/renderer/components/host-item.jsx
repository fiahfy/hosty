import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  TableRow, TableRowColumn,
} from 'material-ui';
import * as Styles from 'material-ui/styles';
import HostStatusIcon from './host-status-icon';
import EditableTextField from './editable-text-field';
import isUpdateNeeded from '../utils/is-update-needed';
import * as Host from '../utils/host';

export default class HostItem extends Component {
  static propTypes = {
    ...TableRow.propTypes,
    host: PropTypes.object,
    selected: PropTypes.bool,
    onEditHost: PropTypes.func,
  };
  static defaultProps = {
    host: {},
    selected: false,
    onEditHost: () => {},
  };
  constructor(props) {
    super(props);
    this.state.host = this.props.host;
  }
  state = {
    host: {},
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState);
  }
  focus() {
    this.refs[Host.KEY_HOST].focus();
  }
  handleClickIconButton(e) {
    e.stopPropagation();
    const { host, onEditHost } = this.props;
    const newHost = Object.assign({}, host);
    newHost.enable = !newHost.enable;
    this.setState({ host: newHost });
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
    const { host } = this.state;
    const newHost = Object.assign({}, host);
    if (this.refs[Host.KEY_HOST].isFocused()) {
      newHost.host = e.target.value;
      this.setState({ host: newHost });
    }
    if (this.refs[Host.KEY_IP].isFocused()) {
      newHost.ip = e.target.value;
      this.setState({ host: newHost });
    }
  }
  handleKeyDown(e) {
    if (e.keyCode === 9 && !e.shiftKey && this.refs[Host.KEY_HOST].isFocused()) {
      e.preventDefault();
      this.refs[Host.KEY_IP].focus();
      return;
    }
    if (e.keyCode === 9 && e.shiftKey && this.refs[Host.KEY_IP].isFocused()) {
      e.preventDefault();
      this.refs[Host.KEY_HOST].focus();
      return;
    }
    if (e.keyCode === 13) {
      e.target.blur();
    }
  }
  render() {
    const { host } = this.state;
    const { selected, onRowClick, ...others } = this.props;
    delete others.host;
    delete others.onEditHost;

    const errors = Host.getErrorMessages(host);
    const invalid = !Host.isValid(host);

    return (
      <TableRow
        key={host.id}
        selected={selected}
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
          <IconButton onClick={::this.handleClickIconButton}>
            <HostStatusIcon
              invalid={invalid}
              enable={host.enable}
            />
          </IconButton>
        </TableRowColumn>
        <TableRowColumn>
          <EditableTextField
            name={Host.KEY_HOST}
            ref={Host.KEY_HOST}
            hintText="example.com"
            errorText={errors[Host.KEY_HOST]}
            errorStyle={styles.errorTextField}
            value={host.host}
            fullWidth
            clickToEditable={selected}
            onBlur={::this.handleBlur}
            onKeyDown={::this.handleKeyDown}
            onChange={::this.handleChange}
          />
        </TableRowColumn>
        <TableRowColumn>
          <EditableTextField
            name={Host.KEY_IP}
            ref={Host.KEY_IP}
            hintText="192.0.2.0"
            errorText={errors[Host.KEY_IP]}
            errorStyle={styles.errorTextField}
            value={host.ip}
            fullWidth
            clickToEditable={selected}
            onBlur={::this.handleBlur}
            onKeyDown={::this.handleKeyDown}
            onChange={::this.handleChange}
          />
        </TableRowColumn>
      </TableRow>
    );
  }
}

const styles = {
  row: {
    cursor: 'pointer',
  },
  iconColumn: {
    width: 48,
    textAlign: 'center',
    verticalAlign: 'top',
    paddingRight: 0,
  },
  errorTextField: {
    color: Styles.colors.pinkA200,
  },
};
