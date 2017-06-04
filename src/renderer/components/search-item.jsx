import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  TableRow, TableRowColumn,
} from 'material-ui';
import HostStatusIcon from './host-status-icon';
import EditableTextField from './editable-text-field';
import isUpdateNeeded from '../utils/is-update-needed';
import * as HostGroup from '../utils/host-group';
import * as Host from '../utils/host';

const styles = {
  row: {
    cursor: 'pointer',
  },
  groupColumn: {
    width: 136,
  },
  iconColumn: {
    width: 48,
    textAlign: 'center',
    verticalAlign: 'top',
    paddingRight: 0,
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
  constructor(props) {
    super(props);
    this.state.group = this.props.group;
    this.state.host = this.props.host;
  }
  state = {
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
          <IconButton onClick={e => this.handleClickIconButton(e)}>
            <HostStatusIcon
              invalid={invalid}
              enable={group.enable}
            />
          </IconButton>
        </TableRowColumn>
        <TableRowColumn style={styles.groupColumn}>
          <EditableTextField
            name={HostGroup.KEY_NAME}
            ref={(input) => { this.textInput = input; }}
            hintText="Group name"
            errorText={errors[HostGroup.KEY_HOST]}
            errorStyle={styles.errorTextField}
            value={group.name}
            fullWidth
            clickToEditable={selected}
            onBlur={e => this.handleBlur(e)}
            onKeyDown={e => this.constructor.handleKeyDown(e)}
            onChange={e => this.handleChange(e)}
          />
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
          <EditableTextField
            name={Host.KEY_HOST}
            ref={(input) => {
              this.hostTextInputs = this.hostTextInputs || {};
              this.hostTextInputs[host.id] = input;
            }}
            hintText="example.com"
            errorText={errors[Host.KEY_HOST]}
            errorStyle={styles.errorTextField}
            value={host.host}
            fullWidth
            clickToEditable={selected}
            onBlur={e => this.handleBlur(e)}
            onKeyDown={e => this.handleKeyDown(e)}
            onChange={e => this.handleChange(e)}
          />
        </TableRowColumn>
        <TableRowColumn>
          <EditableTextField
            name={Host.KEY_IP}
            ref={(input) => {
              this.ipTextInputs = this.ipTextInputs || {};
              this.ipTextInputs[host.id] = input;
            }}
            hintText="192.0.2.0"
            errorText={errors[Host.KEY_IP]}
            errorStyle={styles.errorTextField}
            value={host.ip}
            fullWidth
            clickToEditable={selected}
            onBlur={e => this.handleBlur(e)}
            onKeyDown={e => this.handleKeyDown(e)}
            onChange={e => this.handleChange(e)}
          />
        </TableRowColumn>
      </TableRow>
    );
  }
}
