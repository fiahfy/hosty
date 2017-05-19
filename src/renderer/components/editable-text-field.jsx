import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'material-ui';

export default class EditableTextField extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    ...TextField.propTypes,
    clickToEditable: PropTypes.bool,
  };
  static defaultProps = {
    ...TextField.defaultProps,
    clickToEditable: false,
    onClick: () => {},
    onDoubleClick: () => {},
    onBlur: () => {},
  };
  state = {
    editable: false,
  };
  isFocused() {
    return this.state.editable;
  }
  focus() {
    this.setState({ editable: true });
  }
  handleBlur(e) {
    this.setState({ editable: false });
    this.props.onBlur(e);
  }
  handleClick(e) {
    e.stopPropagation();
    this.props.onClick(e);
  }
  handleDoubleClick(e) {
    e.stopPropagation();
    this.props.onDoubleClick(e);
  }
  handleClickLabel(e) {
    if (this.props.clickToEditable) {
      e.stopPropagation();
      this.setState({ editable: true });
    }
  }
  handleDoubleClickLabel(e) {
    if (!this.props.clickToEditable) {
      e.stopPropagation();
      this.setState({ editable: true });
    }
  }
  render() {
    const { hintText, value, ...others } = this.props;
    delete others.clickToEditable;

    const { editable } = this.state;

    if (!editable) {
      const text = value || hintText;
      const style = this.context.muiTheme.textField;
      const color = value ? style.textColor : style.hintColor;
      return (
        <div
          style={{ ...styles.label, color }}
          onClick={(e) => this.handleClickLabel(e)}
          onDoubleClick={(e) => this.handleDoubleClickLabel(e)}
        >
          {text}
        </div>
      );
    }

    return (
      <TextField
        {...others}
        ref="textField"
        hintText={hintText}
        value={value || ''}
        autoFocus
        onBlur={(e) => this.handleBlur(e)}
        onClick={(e) => this.handleClick(e)}
        onDoubleClick={(e) => this.handleDoubleClick(e)}
      />
    );
  }
}

const styles = {
  label: {
    height: '100%',
    lineHeight: '48px',
    fontSize: 16,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};
