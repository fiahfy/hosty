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
  labelColumn: {
    paddingRight: '0',
  },
  shrinkColumn: {
    color: colors.grey500,
    fontSize: '11px',
    paddingLeft: '0',
    textAlign: 'right',
    width: '25px',
  },
  errorTextField: {
    color: colors.yellow700,
  },
};

export default class GroupItem extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    group: PropTypes.object,
    selected: PropTypes.bool,
    focused: PropTypes.bool,
    editable: PropTypes.bool,
    onEditGroup: PropTypes.func,
    ...TableRow.propTypes,
  };
  static defaultProps = {
    group: {},
    selected: false,
    focused: false,
    editable: false,
    onEditGroup: () => {},
    ...TableRow.defaultProps,
  };
  static handleKeyDown(e) {
    if (e.keyCode === 13) {
      e.target.blur();
    }
  }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return isUpdateNeeded(this, nextProps, nextState, nextContext);
  }
  handleClickIconButton(e) {
    e.stopPropagation();
    const { group, onEditGroup } = this.props;
    const newGroup = Object.assign({}, group);
    newGroup.enable = !newGroup.enable;
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
    const { group, onEditGroup } = this.props;
    const { name, value } = e.target;
    const newGroup = Object.assign({}, group);
    newGroup[name] = value.trim();
    onEditGroup(newGroup);
  }
  render() {
    const { group, selected, focused, editable, onRowClick, ...others } = this.props;
    delete others.onEditGroup;

    const count = (group.hosts || []).length;

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
              valid
              enable={group.enable}
            />
          </IconButton>
        </TableRowColumn>
        <TableRowColumn style={styles.labelColumn}>
          <EditableLabel
            name={Group.KEY_NAME}
            ref={(input) => { this.textInput = input; }}
            defaultValue={group.name}
            hintText="Group"
            fullWidth
            onBlur={e => this.handleBlur(e)}
            onKeyDown={e => this.constructor.handleKeyDown(e)}
            onChange={e => this.handleChange(e)}
            focused={focused}
            editable={editable}
          />
        </TableRowColumn>
        <TableRowColumn style={styles.shrinkColumn}>
          {count}
        </TableRowColumn>
      </TableRow>
    );
  }
}
