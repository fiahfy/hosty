import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'material-ui';
import ResultItem from './result-item';

const styles = {
  list: {
    padding: '0',
  },
};

export default class ResultList extends Component {
  static propTypes = {
    results: PropTypes.arrayOf(PropTypes.object),
    onClickResult: PropTypes.func,
  };
  static defaultProps = {
    results: [],
    onClickResult: () => {},
  };
  render() {
    const { results, onClickResult } = this.props;

    return (
      <List style={styles.list}>
        {results.map(result => (
          <ResultItem
            key={result.id}
            result={result}
            onClickResult={onClickResult}
          />
        ))}
      </List>
    );
  }
}
