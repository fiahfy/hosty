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

function mapStateToProps(state) {
  return {
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
  handleSortResults(options) {
    this.props.actions.sortResults(options);
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
            onSortResults={(...args) => this.handleSortResults(...args)}
            onSearch={(...args) => this.handleSearch(...args)}
          />
          {emptyView}
        </div>
      </div>
    );
  }
}
