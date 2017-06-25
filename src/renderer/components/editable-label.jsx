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
    fontFamily: 'inherit',
    fontSize: 'inherit',
    outline: 'none',
    overflow: 'hidden',
    padding: '0',
    textAlign: 'left',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  textField: {
    fontSize: 'inherit',
  },
};

export default class EditableLabel extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    ...TextField.propTypes,
    focused: PropTypes.bool,
    editable: PropTypes.bool,
    onKeyDown: PropTypes.func,
  };
  static defaultProps = {
    ...TextField.defaultProps,
    focused: false,
    editable: false,
    onKeyDown: () => {},
  };
  static handleClick(e) {
    e.stopPropagation();
  }
  state = {
    editing: false,
  };
  componentDidUpdate(prevProps) {
    if (!prevProps.focused && this.props.focused) {
      this.focus();
    }
  }
  focus() {
    this.setState({ editing: true });
  }
  handleBlur(e) {
    this.setState({ editing: false });
    this.props.onBlur(e);
  }
  handleClickLabel(e) {
    if (this.props.editable) {
      e.stopPropagation();
      this.setState({ editing: true });
    }
  }
  render() {
    const { onKeyDown, defaultValue, hintText, ...others } = this.props;
    delete others.focused;
    delete others.editable;

    const { editing } = this.state;

    if (!editing) {
      const text = defaultValue || hintText;
      const style = this.context.muiTheme.textField;
      const color = defaultValue ? style.textColor : style.hintColor;
      return (
        <button
          style={{ ...styles.button, color }}
          onClick={e => this.handleClickLabel(e)}
        >
          {text}
        </button>
      );
    }

    return (
      <TextField
        {...others}
        defaultValue={defaultValue}
        hintText={hintText}
        autoFocus
        style={styles.textField}
        onKeyDown={onKeyDown}
        onBlur={e => this.handleBlur(e)}
        onClick={e => this.constructor.handleClick(e)}
      />
    );
  }
}
