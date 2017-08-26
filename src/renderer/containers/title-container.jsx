import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { muiThemeable } from 'material-ui/styles';

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

@muiThemeable()
@connect(mapStateToProps, mapDispatchToProps)
export default class TitleContainer extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    muiTheme: PropTypes.object.isRequired,
  };
  render() {
    const { title, muiTheme } = this.props;

    return (
      <div
        style={{
          ...styles.container,
          borderBottomColor: muiTheme.palette.borderColor,
          color: muiTheme.palette.textColor,
        }}
      >{title}</div>
    );
  }
}
