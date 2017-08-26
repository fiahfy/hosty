import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'material-ui';
import { muiThemeable } from 'material-ui/styles';
import ResultItem from './result-item';
import isUpdateNeeded from '../utils/is-update-needed';

const styles = {
  list: {
    padding: '0',
  },
};

@muiThemeable()
export default class ResultList extends Component {
  static propTypes = {
    results: PropTypes.arrayOf(PropTypes.object),
    onClickResult: PropTypes.func,
  };
  static defaultProps = {
    results: [],
    onClickResult: () => {},
  };
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return isUpdateNeeded(this, nextProps, nextState, nextContext);
  }
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
