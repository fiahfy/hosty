import React, { Component, PropTypes } from 'react'
import { TextField } from 'material-ui'

export default class EditableTextField extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    ...TextField.propTypes,
    onBlur: PropTypes.func,
    onClick: PropTypes.func,
  };
  static defaultProps = {
    onBlur: () => {},
    onClick: () => {},
  };
  state = {
    editable: false,
  };
  isFocused() {
    return this.state.editable
  }
  focus() {
    this.setState({ editable: true })
  }
  handleBlur(e) {
    this.setState({ editable: false })
    this.props.onBlur(e)
  }
  handleClick(e) {
    e.stopPropagation()
    this.props.onClick(e)
  }
  handleDoubleClick() {
    this.setState({ editable: true })
  }
  render() {
    const { hintText, defaultValue, value, ...others } = this.props
    delete others.onBlur
    delete others.onClick
    const { editable } = this.state

    if (!editable) {
      const sourceValue = value || defaultValue
      const text = sourceValue || hintText
      const style = this.context.muiTheme.textField
      const color = sourceValue ? style.textColor : style.hintColor
      return (
        <div
          style={{ ...styles.label, color }}
          onDoubleClick={::this.handleDoubleClick}
        >
          {text}
        </div>
      )
    }

    return (
      <TextField
        ref="textField"
        hintText={hintText}
        defaultValue={defaultValue}
        value={value}
        autoFocus
        onBlur={::this.handleBlur}
        onClick={::this.handleClick}
        onDoubleClick={e => { e.stopPropagation() }}
        {...others}
      />
    )
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
}
