import React, { Component, PropTypes } from 'react'
import { TextField } from 'material-ui'
import * as Styles from 'material-ui/styles'

export default class EditableTextField extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    onBlur:  PropTypes.func,
    onClick: PropTypes.func,
  };
  static defaultProps = {
    onBlur:  () => {},
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
  handleDoubleClick(e) {
    this.setState({ editable: true })
  }
  render() {
    const { hintText, defaultValue, onBlur, onClick, ...others } = this.props
    const { editable } = this.state

    if (!editable) {
      const value = defaultValue || hintText
      const style = this.context.muiTheme.textField
      const color = defaultValue ? style.textColor : style.hintColor
      return (
        <div
          style={{ ...styles.label, color }}
          onDoubleClick={::this.handleDoubleClick}
        >
          {value}
        </div>
      )
    }

    return (
      <TextField
        ref="textField"
        hintText={hintText}
        defaultValue={defaultValue}
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
