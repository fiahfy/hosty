import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const styles = {
  container: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    boxSizing: 'border-box',
    fontSize: '13px',
    height: '24px',
    padding: '0 68px',
    lineHeight: '24px',
    overflow: 'hidden',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    userSelect: 'none',
    WebkitAppRegion: 'drag',
  },
};

function mapStateToProps(state) {
  return {
    ...state.titleContainer,
  };
}

function mapDispatchToProps() {
  return {};
}

@connect(mapStateToProps, mapDispatchToProps)
export default class TitleContainer extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    title: PropTypes.string.isRequired,
  };
  render() {
    const { title } = this.props;

    return (
      <div
        style={{
          ...styles.container,
          borderBottomColor: this.context.muiTheme.palette.borderColor,
          color: this.context.muiTheme.palette.textColor,
        }}
      >{title}</div>
    );
  }
}
