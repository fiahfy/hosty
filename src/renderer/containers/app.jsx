import fs from 'fs';
import path from 'path';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Snackbar } from 'material-ui';
import * as ActionCreators from '../actions';
import * as Group from '../utils/group';
import * as Host from '../utils/host';
import ContextMenu from '../utils/context-menu';

const styles = {
  app: {
    boxSizing: 'border-box',
    height: '100%',
    overflow: 'hidden',
  },
  snackbar: {
    textAlign: 'center',
  },
};

function mapStateToProps(state) {
  return { messages: state.messages };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object).isRequired,
    actions: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  };
  static handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
  }
  static handleContextMenu(e) {
    // TODO:
    ContextMenu.show(e);
  }
  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    // TODO:
    const groups = Array.from(e.dataTransfer.files)
      .map((file) => {
        const params = path.parse(file.path);
        const data = fs.readFileSync(file.path, 'utf8');
        let hosts = Host.parse(data);
        if (!hosts.length) {
          return null;
        }
        hosts = hosts.map((host, i) => {
          const newHost = Object.assign({}, host);
          newHost.id = i + 1;
          return newHost;
        });
        return { enable: true, name: params.name, hosts };
      })
      .filter(item => !!item);

    groups.forEach((group) => {
      this.props.actions.createGroup(group);
    });

    const groupLength = groups.length;
    const hostLength = Group.getHostLength(groups);
    this.props.actions.createMessage(
      { text: `Added ${groupLength} group(s), ${hostLength} host(s)` },
    );
  }
  handleRequestClose() {
    this.props.actions.clearMessages();
  }
  renderSnackbar() {
    const { messages } = this.props;
    const message = messages.length ? messages[0].text : '';
    const open = Boolean(message);

    return (
      <Snackbar
        open={open}
        message={message}
        autoHideDuration={4000}
        bodyStyle={styles.snackbar}
        onRequestClose={() => this.handleRequestClose()}
      />
    );
  }
  render() {
    const { children } = this.props;

    return (
      <div
        style={styles.app}
        onDragOver={e => this.constructor.handleDragOver(e)}
        onDrop={e => this.handleDrop(e)}
        onContextMenu={e => this.constructor.handleContextMenu(e)}
      >
        {children}
        {this.renderSnackbar()}
      </div>
    );
  }
}
