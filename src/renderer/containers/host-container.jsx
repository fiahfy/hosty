import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ActionCreators from '../actions';
import HostList from '../components/host-list';

function mapStateToProps(state) {
  return { groups: state.groups };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HostContainer extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  static propTypes = {
    location: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    groups: PropTypes.arrayOf(PropTypes.object),
  };
  static defaultProps = {
    groups: [],
  };
  handleEditHost(id, host) {
    this.props.actions.updateHost(Number(this.props.location.query.id), id, host);
  }
  handleAddHost() {
    this.props.actions.createHost(Number(this.props.location.query.id), { enable: true });
    window.setTimeout(() => {
      this.refs.hostList.focusLastHost();
    }, 0);
  }
  handleDeleteHosts() {
    const ids = this.refs.hostList.getSortedHosts().map(host => host.id);
    const selectedIds = this.refs.hostList.getSelectedHosts().map(host => host.id);
    this.refs.hostList.deselectAll();
    this.props.actions.deleteHosts(Number(this.props.location.query.id), selectedIds);
    window.setTimeout(() => {
      if (selectedIds.length !== 1) {
        return;
      }
      const currentId = selectedIds[0];
      let [previous, next, isFound] = [0, 0, false];
      ids.forEach((id) => {
        if (isFound && !next) {
          next = id;
        }
        if (id === currentId) {
          isFound = true;
        }
        if (!isFound) {
          previous = id;
        }
      });
      const targetId = next || previous;
      if (!targetId) {
        return;
      }
      this.refs.hostList.select([targetId]);
    }, 0);
  }
  renderHostList() {
    const { groups, location } = this.props;
    const groupId = Number(location.query.id);

    const group = groups.filter(currentGroup => currentGroup.id === groupId)[0];
    const hosts = group ? group.hosts : [];

    return (
      <HostList
        ref="hostList"
        groupId={groupId}
        hosts={hosts}
        onEditHost={::this.handleEditHost}
        onAddHost={::this.handleAddHost}
        onDeleteHosts={::this.handleDeleteHosts}
      />
    );
  }
  render() {
    const groupId = Number(this.props.location.query.id);

    if (!groupId) {
      return (
        <div style={styles.messageContainer}>
          <div style={styles.message}>Select Group</div>
        </div>
      );
    }

    return (
      <div>
        {this.renderHostList()}
      </div>
    );
  }
}

const styles = {
  messageContainer: {
    width: '100%',
    height: '100%',
    display: 'table',
  },
  message: {
    display: 'table-cell',
    textAlign: 'center',
    verticalAlign: 'middle',
    position: 'relative',
    color: 'grey',
  },
};
