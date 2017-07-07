import fs from 'fs';
import path from 'path';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Drawer, Snackbar, Menu, MenuItem } from 'material-ui';
import { ActionList, ActionSearch, ActionSettings } from 'material-ui/svg-icons';
import {
  MuiThemeProvider, getMuiTheme,
  lightBaseTheme, darkBaseTheme,
} from 'material-ui/styles';
import * as ActionCreators from '../actions';
import * as Group from '../utils/group';
import * as Host from '../utils/host';

const styles = {
  app: {
    boxSizing: 'border-box',
    height: '100%',
    overflow: 'hidden',
  },
  drawer: {
    boxSizing: 'content-box',
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    boxShadow: 'none',
  },
  container: {
    height: '100%',
    paddingLeft: '49px',
  },
  snackbar: {
    textAlign: 'center',
  },
};

function mapStateToProps(state) {
  return {
    settings: state.settings,
    messages: state.messages,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  static propTypes = {
    settings: PropTypes.object.isRequired,
    messages: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.node.isRequired,
    actions: PropTypes.object.isRequired,
  };
  static handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
  }
  static menus = [
    { pathname: '/', IconClass: ActionList },
    { pathname: '/search', IconClass: ActionSearch },
    { pathname: '/settings', IconClass: ActionSettings },
  ];
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
  handleItemTouchTap(e, item, index) {
    const menu = this.constructor.menus[index];
    if (!menu) {
      return;
    }
    this.context.router.history.push(menu.pathname);
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
  renderMenu(theme) {
    const currentPathname = this.context.router.history.location.pathname;
    return (
      <Menu onItemTouchTap={(...args) => this.handleItemTouchTap(...args)}>
        {this.constructor.menus.map(({ pathname, IconClass }) => {
          const color = pathname === currentPathname
                      ? theme.palette.accent1Color
                      : theme.palette.primary3Color;
          return (
            <MenuItem
              key={pathname}
              leftIcon={<IconClass color={color} />}
            />
          );
        })}
      </Menu>
    );
  }
  render() {
    const { settings, children } = this.props;
    const theme = settings.theme === 'dark' ? darkBaseTheme : lightBaseTheme;

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
        <div
          style={{ ...styles.app, backgroundColor: theme.palette.canvasColor }}
          onDragOver={e => this.constructor.handleDragOver(e)}
          onDrop={e => this.handleDrop(e)}
        >
          <Drawer
            width={48}
            className="drawer"
            containerStyle={{ ...styles.drawer, borderRightColor: theme.palette.borderColor }}
          >
            {this.renderMenu(theme)}
          </Drawer>
          <div style={styles.container}>
            {children}
          </div>
          {this.renderSnackbar()}
        </div>
      </MuiThemeProvider>
    );
  }
}
