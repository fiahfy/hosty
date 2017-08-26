import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IconButton, Subheader } from 'material-ui';
import { NavigationClose } from 'material-ui/svg-icons';
import * as ActionCreators from '../actions';
import FindContainer from './find-container';

const styles = {
  container: {
    height: '100%',
  },
  subheader: {
    display: 'flex',
    lineHeight: '38px',
    paddingLeft: '16px',
    paddingRight: '4px',
    userSelect: 'none',
  },
  subheaderText: {
    flex: '1',
  },
  iconButton: {
    height: '38px',
    margin: '0 5px',
    padding: '7px',
    width: '38px',
  },
  contentWrapper: {
    height: 'calc(100% - 38px)',
  },
};


function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PanelContainer extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };
  handleClick() {
    this.props.actions.hidePanel();
  }
  render() {
    return (
      <div style={styles.container}>
        <Subheader style={styles.subheader}>
          <span style={styles.subheaderText}>Find</span>
          <IconButton
            style={styles.iconButton}
            onClick={e => this.handleClick(e)}
          >
            <NavigationClose />
          </IconButton>
        </Subheader>
        <div style={styles.contentWrapper}>
          <FindContainer />
        </div>
      </div>
    );
  }
}
