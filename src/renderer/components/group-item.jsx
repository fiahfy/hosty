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
import * as Group from '../utils/group';

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
    color: Styles.colors.pinkA200,
  },
};

export default class GroupItem extends Component {
  static propTypes = {
    ...TableRow.propTypes,
    group: PropTypes.object,
    selected: PropTypes.bool,
    onEditGroup: PropTypes.func,
  };
  static defaultProps = {
    group: {},
    selected: false,
    onEditGroup: () => {},
  };
  static handleKeyDown(e) {
    if (e.keyCode === 13) {
      e.target.blur();
    }
  }
  constructor(props) {
    super(props);
    this.state.group = this.props.group;
  }
  state = {
    group: {},
  };
  shouldComponentUpdate(nextProps, nextState) {
    return isUpdateNeeded(this, nextProps, nextState);
  }
  focus() {
    this.textInput.focus();
  }
  handleClickIconButton(e) {
    e.stopPropagation();
    const { group, onEditGroup } = this.props;
    const newGroup = Object.assign({}, group);
    newGroup.enable = !newGroup.enable;
    this.setState({ group: newGroup });
    onEditGroup(newGroup);
  }
  handleBlur(e) {
    const { group, onEditGroup } = this.props;
    const { name, value } = e.target;
    const newGroup = Object.assign({}, group);
    newGroup[name] = value.trim();
    onEditGroup(newGroup);
  }
  handleChange(e) {
    const { group } = this.state;
    const newGroup = Object.assign({}, group);
    if (this.textInput.isFocused()) {
      newGroup.name = e.target.value;
      this.setState({ group: newGroup });
    }
  }
  render() {
    const { group } = this.state;
    const { selected, onRowClick, ...others } = this.props;
    delete others.group;
    delete others.onEditGroup;

    const errors = {};
    const invalid = false;

    return (
      <TableRow
        key={group.id}
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
              invalid={invalid}
              enable={group.enable}
            />
          </IconButton>
        </TableRowColumn>
        <TableRowColumn>
          <EditableTextField
            name={Group.KEY_NAME}
            ref={(input) => { this.textInput = input; }}
            hintText="Group name"
            errorText={errors[Group.KEY_HOST]}
            errorStyle={styles.errorTextField}
            value={group.name}
            fullWidth
            clickToEditable={selected}
            onBlur={e => this.handleBlur(e)}
            onKeyDown={e => this.constructor.handleKeyDown(e)}
            onChange={e => this.handleChange(e)}
          />
        </TableRowColumn>
      </TableRow>
    );
  }
}
