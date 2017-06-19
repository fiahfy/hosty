import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'material-ui';

const styles = {
  button: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    height: '100%',
    lineHeight: '48px',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    outline: 'none',
    overflow: 'hidden',
    padding: '0',
    textAlign: 'left',
    textOverflow: 'ellipsis',
    width: '100%',
  },
};

export default class EditableTextField extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    ...TextField.propTypes,
    focused: PropTypes.bool,
    clickToEditable: PropTypes.bool,
  };
  static defaultProps = {
    ...TextField.defaultProps,
    focused: false,
    clickToEditable: false,
  };
  state = {
    editable: false,
  };
  componentDidUpdate(prevProps) {
    if (!prevProps.focused && this.props.focused) {
      this.focus();
    }
  }
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
    delete others.focused;
    delete others.clickToEditable;

    const { editable } = this.state;

    if (!editable) {
      const text = value || hintText;
      const style = this.context.muiTheme.textField;
      const color = value ? style.textColor : style.hintColor;
      return (
        <button
          style={{ ...styles.button, color }}
          onClick={e => this.handleClickLabel(e)}
          onDoubleClick={e => this.handleDoubleClickLabel(e)}
        >
          {text}
        </button>
      );
    }

    return (
      <TextField
        {...others}
        hintText={hintText}
        value={value || ''}
        autoFocus
        onBlur={e => this.handleBlur(e)}
        onClick={e => this.handleClick(e)}
        onDoubleClick={e => this.handleDoubleClick(e)}
      />
    );
  }
}
