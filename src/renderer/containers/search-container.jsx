import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ActionCreators from '../actions';
import ResultList from '../components/result-list';

const styles = {
  container: {
    boxSizing: 'border-box',
    height: '100%',
    overflow: 'hidden',
  },
  content: {
    height: '100%',
    overflow: 'auto',
  },
  emptyWrapper: {
    display: 'table',
    height: '100%',
    position: 'absolute',
    top: '0',
    width: '100%',
  },
  emptyMessage: {
    display: 'table-cell',
    fontSize: '14px',
    position: 'relative',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
};

function getResults(groups, query) {
  return groups.reduce((previous, current) => (
      previous.concat((current.hosts || []).map(host => (
        { group: current, host }
      )))
    ), [])
    .filter((item) => {
      if (query === '') {
        return false;
      }
      if ((item.host.host || '').indexOf(query) > -1) {
        return true;
      }
      if ((item.host.ip || '').indexOf(query) > -1) {
        return true;
      }
      return false;
    });
}

function mapStateToProps(state) {
  return {
    query: state.query,
    results: getResults(state.groups, state.query),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SearchContainers extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    query: PropTypes.string.isRequired,
    results: PropTypes.arrayOf(PropTypes.object).isRequired,
    actions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };
  handleSelectResult([groupId, hostId]) {
    this.props.actions.selectGroup(groupId);
    this.props.actions.selectHost(hostId);
    this.props.history.push('/');
  }
  handleSearch(query) {
    this.props.actions.searchItems(query);
  }
  render() {
    const { query, results } = this.props;

    let emptyView = null;
    if (!results.length) {
      emptyView = (
        <div style={styles.emptyWrapper}>
          <div style={{
            ...styles.emptyMessage,
            color: this.context.muiTheme.palette.primary3Color,
          }}
          >No results</div>
        </div>
      );
    }

    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div className="list">
            <ResultList
              results={results}
              query={query}
              onSelectResult={(...args) => this.handleSelectResult(...args)}
              onSearch={(...args) => this.handleSearch(...args)}
            />
            {emptyView}
          </div>
        </div>
      </div>
    );
  }
}
