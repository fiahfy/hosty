import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  List, ListItem, Subheader, Checkbox,
} from 'material-ui';
import * as ActionCreators from '../actions';

const styles = {
  container: {
    boxSizing: 'border-box',
    height: '100%',
    overflow: 'hidden',
  },
};

function mapStateToProps(state) {
  return { settings: state.settings };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SettingsContainers extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };
  handleCheck(event, isInputChecked) {
    const { settings, actions } = this.props;
    const newSettings = Object.assign({}, settings);
    newSettings.theme = isInputChecked ? 'dark' : 'light';
    actions.updateSettings(newSettings);
  }
  render() {
    const { theme } = this.props.settings;
    const checked = theme === 'dark';

    return (
      <div style={styles.container}>
        <List>
          <Subheader>General</Subheader>
          <ListItem
            leftCheckbox={
              <Checkbox
                checked={checked}
                onCheck={(...args) => { this.handleCheck(...args); }}
              />
            }
            primaryText="Theme"
            secondaryText="Use dark base theme"
          />
        </List>
      </div>
    );
  }
}
