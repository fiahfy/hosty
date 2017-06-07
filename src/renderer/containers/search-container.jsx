import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IconButton } from 'material-ui';
import * as SvgIcons from 'material-ui/svg-icons';
import { bindActionCreators } from 'redux';
import * as ActionCreators from '../actions';
import SearchList from '../components/search-list';

const styles = {
  buttonWrapper: {
    position: 'absolute',
    right: '0',
    top: '0',
  },
  button: {
    height: '58px',
    padding: '17px',
    width: '58px',
  },
  container: {
    boxSizing: 'border-box',
    height: '100%',
    overflow: 'hidden',
  },
};

function mapStateToProps(state) {
  return { groups: state.groups };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AppContainers extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  static propTypes = {
    groups: PropTypes.arrayOf(PropTypes.object),
  };
  static defaultProps = {
    groups: [],
  };
  handleClickIconButton() {
    this.context.router.push('/');
  }
  render() {
    const { groups } = this.props;

    return (
      <div className="content" style={styles.container}>
        <div>
          <SearchList groups={groups} />
        </div>
        <div style={styles.buttonWrapper}>
          <IconButton
            style={styles.button}
            onClick={() => this.handleClickIconButton()}
          >
            <SvgIcons.NavigationClose />
          </IconButton>
        </div>
      </div>
    );
  }
}
