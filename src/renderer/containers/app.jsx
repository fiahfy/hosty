import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Drawer, Menu, MenuItem, Snackbar } from 'material-ui';
import { ActionList, ActionSettings } from 'material-ui/svg-icons';
import { MuiThemeProvider, getMuiTheme, lightBaseTheme, darkBaseTheme } from 'material-ui/styles';
import * as ActionCreators from '../actions';
import TitleContainer from './title-container';
import * as Group from '../utils/group';
import * as HostsFileManager from '../utils/hosts-file-manager';

const styles = {
  app: {
    height: '100%',
  },
  content: {
    height: '100%',
  },
  drawer: {
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    boxShadow: 'none',
    boxSizing: 'content-box',
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
    ...state.app,
    settings: state.settings,
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
    messages: PropTypes.arrayOf(PropTypes.object).isRequired,
    settings: PropTypes.object.isRequired,
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
    { pathname: '/settings', IconClass: ActionSettings },
  ];
  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const filenames = Array.from(e.dataTransfer.files).map(file => file.path);
    try {
      const groups = HostsFileManager.readGroupsFromFiles(filenames);
      const groupLength = groups.length;
      const hostLength = Group.getHostLength(groups);
      this.props.actions.addGroups(groups);
      this.props.actions.createMessage(
        { text: `Added ${groupLength} group(s), ${hostLength} host(s)` },
      );
    } catch (error) {
      this.props.actions.createMessage(
        { text: 'Invalid Hosty file' },
      );
    }
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

    let titleBar = null;
    if (process.platform !== 'win32') {
      titleBar = <TitleContainer />;
      styles.content = { ...styles.content, height: 'calc(100% - 24px)' };
      styles.drawer = { ...styles.drawer, height: 'calc(100% - 24px)', top: '24px' };
    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
        <div
          style={{
            ...styles.app,
            backgroundColor: theme.palette.canvasColor,
          }}
        >
          {titleBar}
          <div
            style={styles.content}
            onDragOver={e => this.constructor.handleDragOver(e)}
            onDrop={e => this.handleDrop(e)}
          >
            <Drawer
              width={48}
              className="drawer"
              containerStyle={{
                ...styles.drawer,
                borderRightColor: theme.palette.borderColor,
              }}
            >
              {this.renderMenu(theme)}
            </Drawer>
            <div style={styles.container}>
              {children}
            </div>
            {this.renderSnackbar()}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
