import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem } from 'material-ui';
import isUpdateNeeded from '../utils/is-update-needed';

const styles = {
  listItem: {
    fontSize: '13px',
    padding: '8px 16px',
  },
  nestedListItem: {
    padding: '0',
  },
};

export default class ResultItem extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    result: PropTypes.object,
    onClickResult: PropTypes.func,
  };
  static defaultProps = {
    result: {},
    onClickResult: () => {},
  };
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return isUpdateNeeded(this, nextProps, nextState, nextContext);
  }
  handleClickResult(host) {
    const { result, onClickResult } = this.props;
    onClickResult(result.id, host.id);
  }
  render() {
    const { result } = this.props;

    return (
      <ListItem
        className="result-list"
        primaryText={result.name}
        innerDivStyle={styles.listItem}
        nestedListStyle={styles.nestedListItem}
        initiallyOpen
        primaryTogglesNestedList
        nestedItems={
          result.hosts.map(host => (
            <ListItem
              key={host.id}
              primaryText={
                <span>
                  {host.host}
                  <span style={{ color: this.context.muiTheme.palette.primary3Color }}>
                    &nbsp;- {host.ip}
                  </span>
                </span>
              }
              innerDivStyle={styles.listItem}
              onClick={() => this.handleClickResult(host)}
            />
          ))
        }
      />
    );
  }
}
