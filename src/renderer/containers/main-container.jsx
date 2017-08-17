import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GroupContainer from './group-container';
import HostContainer from './host-container';
import PanelContainer from './panel-container';

const styles = {
  container: {
    height: '100%',
  },
  contentWrapper: {
    display: 'flex',
  },
  content: {
    flex: '1',
  },
  nav: {
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    width: '256px',
  },
  panelWrapper: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    boxSizing: 'border-box',
    height: '100%',
  },
  draggableBar: {
    height: '5px',
    cursor: 'row-resize',
  },
  panelContentWrapper: {
    height: 'calc(100% - 5px)',
  },
};

function mapStateToProps(state) {
  return { ...state.mainContainer };
}

function mapDispatchToProps() {
  return {};
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MainContainer extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    panelOpen: PropTypes.bool.isRequired,
  };
  state = {
    dragging: false,
    panelY: 0,
    panelHeight: document.body.offsetHeight / 3, // eslint-disable-line no-undef
  };
  handleWrapper(e) {
    const { dragging } = this.state;
    if (dragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
  handleDragStart(e) {
    const img = document.createElement('img'); // eslint-disable-line no-undef
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
    e.dataTransfer.effectAllowed = 'move';
    this.setState({ dragging: true, panelY: e.clientY });
  }
  handleDrag(e) {
    const { panelY, panelHeight } = this.state;
    const newHeight = panelHeight - (e.clientY - panelY);
    const maxHeight = document.body.offsetHeight - 100; // eslint-disable-line no-undef
    if (newHeight < 100 || maxHeight < newHeight) {
      return;
    }
    this.setState({ panelY: e.clientY, panelHeight: newHeight });
  }
  handleDragEnd() {
    this.setState({ dragging: false });
  }
  // render
  renderPanel() {
    const { panelOpen } = this.props;
    const { panelHeight } = this.state;

    if (!panelOpen) {
      return null;
    }

    return (
      <div
        style={{
          ...styles.panelWrapper,
          height: `${panelHeight}px`,
          borderTopColor: this.context.muiTheme.palette.borderColor,
        }}
      >
        <div
          draggable
          style={styles.draggableBar}
          onDrag={e => this.handleDrag(e)}
          onDragStart={e => this.handleDragStart(e)}
          onDragEnd={e => this.handleDragEnd(e)}
        />
        <div style={styles.panelContentWrapper}>
          <PanelContainer />
        </div>
      </div>
    );
  }
  render() {
    const { panelOpen } = this.props;
    let { panelHeight } = this.state;

    panelHeight = panelOpen ? panelHeight : 0;

    return (
      <div
        style={styles.container}
        onDragOver={e => this.handleWrapper(e)}
        onDrop={e => this.handleWrapper(e)}
      >
        <div
          style={{
            ...styles.contentWrapper,
            height: `calc(100% - ${panelHeight}px)`,
          }}
        >
          <div
            className="nav"
            style={{
              ...styles.nav,
              borderRightColor: this.context.muiTheme.palette.borderColor,
            }}
          >
            <GroupContainer />
          </div>
          <div style={styles.content}>
            <HostContainer />
          </div>
        </div>
        {this.renderPanel()}
      </div>
    );
  }
}
