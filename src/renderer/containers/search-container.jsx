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

function getResultReducer() {
  return (previous, current) => (
    previous.concat((current.hosts || []).map(host => (
      { group: current, host }
    )))
  );
}

function getResultFilter(query) {
  return (result) => {
    if (query === '') {
      return false;
    }
    if ((result.host.host || '').indexOf(query) > -1) {
      return true;
    }
    if ((result.host.ip || '').indexOf(query) > -1) {
      return true;
    }
    return false;
  };
}

function mapStateToProps(state) {
  return {
    results: state.groups
      .reduce(getResultReducer(), [])
      .filter(getResultFilter(state.searchContainer.query)),
    ...state.searchContainer,
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
    results: PropTypes.arrayOf(PropTypes.object).isRequired,
    query: PropTypes.string.isRequired,
    sortOptions: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };
  handleSelectResult([groupId, hostId]) {
    this.props.actions.selectGroup(groupId);
    this.props.actions.selectHost(hostId);
    this.props.history.push('/');
  }
  handleSortResult(options) { // eslint-disable-line
    // TODO:
  }
  handleSearch(query) {
    this.props.actions.search(query);
  }
  render() {
    const { query, results, sortOptions } = this.props;

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
        <div className="list">
          <ResultList
            results={results}
            query={query}
            sortOptions={sortOptions}
            onSelectResult={(...args) => this.handleSelectResult(...args)}
            onSortResult={(...args) => this.handleSortResult(...args)}
            onSearch={(...args) => this.handleSearch(...args)}
          />
          {emptyView}
        </div>
      </div>
    );
  }
}
