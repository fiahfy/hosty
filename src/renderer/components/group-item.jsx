import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton, TableRow, TableRowColumn } from 'material-ui';
import { muiThemeable, colors } from 'material-ui/styles';
import StatusIcon from './status-icon';
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
    fontSize: '11px',
    paddingLeft: '0',
    textAlign: 'right',
    width: '25px',
  },
  errorTextField: {
    color: colors.yellow700,
  },
};

@muiThemeable()
export default class GroupItem extends Component {
  static propTypes = {
    group: PropTypes.object,
    selected: PropTypes.bool,
    focused: PropTypes.bool,
    editable: PropTypes.bool,
    onEditGroup: PropTypes.func,
    ...TableRow.propTypes,
    muiTheme: PropTypes.object.isRequired,
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
    const newGroup = Object.assign({}, group, {
      enable: !group.enable,
    });
    onEditGroup(newGroup);
  }
  handleChange(e) {
    const { group, onEditGroup } = this.props;
    const { name, value } = e.target;
    const newGroup = Object.assign({}, group, {
      [name]: value.trim(),
    });
    onEditGroup(newGroup);
  }
  render() {
    const { group, selected, focused, editable, onRowClick, muiTheme, ...others } = this.props;
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
            <StatusIcon
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
            onKeyDown={e => this.constructor.handleKeyDown(e)}
            onBlur={e => this.handleChange(e)}
            onChange={e => this.handleChange(e)}
            focused={focused}
            editable={editable}
          />
        </TableRowColumn>
        <TableRowColumn style={{
          ...styles.shrinkColumn,
          color: muiTheme.palette.primary3Color,
        }}
        >
          {count}
        </TableRowColumn>
      </TableRow>
    );
  }
}
