import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TextField, IconButton } from 'material-ui';
import { AvExplicit } from 'material-ui/svg-icons';
import * as ActionCreators from '../actions';
import ResultList from '../components/result-list';

const styles = {
  container: {
    height: '100%',
  },
  textFieldWrapper: {
    display: 'flex',
    paddingLeft: '16px',
    paddingRight: '4px',
  },
  textField: {
    fontSize: '13px',
    flex: '1',
  },
  textFieldUnderline: {
    bottom: '12px',
  },
  resultWrapper: {
    fontSize: '13px',
    padding: '0 16px 8px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  listWrapper: {
    position: 'relative',
    overflowY: 'auto',
    height: 'calc(100% - 71px)',
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
    fontSize: '13px',
    position: 'relative',
    textAlign: 'center',
    userSelect: 'none',
    verticalAlign: 'middle',
  },
};

function mapStateToProps(state) {
  return { ...state.findContainer };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class FindContainer extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    results: PropTypes.arrayOf(PropTypes.object).isRequired,
    query: PropTypes.string.isRequired,
    regExpEnabled: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.props.actions.findHosts(this.textInput.getValue());
    }
  }
  handleClickRegExp() {
    this.textInput.focus();
    this.props.actions.setRegExpEnabled(!this.props.regExpEnabled);
  }
  handleClickResult(groupId, hostId) {
    this.props.actions.selectGroup(groupId);
    this.props.actions.selectHost(hostId);
  }
  renderFindField() {
    const { query, regExpEnabled } = this.props;

    const color = regExpEnabled
      ? this.context.muiTheme.palette.primary1Color
      : this.context.muiTheme.palette.primary3Color;

    return (
      <div style={styles.textFieldWrapper}>
        <TextField
          style={styles.textField}
          underlineStyle={styles.textFieldUnderline}
          name="query"
          defaultValue={query}
          hintText="Find"
          ref={(input) => { this.textInput = input; }}
          autoFocus
          fullWidth
          onKeyDown={e => this.handleKeyDown(e)}
        />
        <IconButton
          tooltip="Use RegExp"
          tooltipPosition="bottom-left"
          style={styles.button}
          onClick={e => this.handleClickRegExp(e)}
        >
          <AvExplicit color={color} />
        </IconButton>
      </div>
    );
  }
  renderResultLabel() {
    const { results, query } = this.props;

    if (!query) {
      return null;
    }

    const groupCount = results.length;
    const hostCount = results.reduce((p, c) => p + (c.hosts || []).length, 0);

    return (
      <div style={{
        ...styles.resultWrapper,
        color: this.context.muiTheme.palette.primary3Color,
      }}
      >
        {hostCount} host{ hostCount > 1 ? 's' : '' } found
        in {groupCount} group{ groupCount > 1 ? 's' : '' } for {query}
      </div>
    );
  }
  renderResultList() {
    const { query, results } = this.props;

    let emptyView = null;
    if (query && !results.length) {
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
      <div style={styles.listWrapper}>
        <ResultList
          results={results}
          onClickResult={(...args) => this.handleClickResult(...args)}
        />
        {emptyView}
      </div>
    );
  }
  render() {
    return (
      <div style={styles.container}>
        {this.renderFindField()}
        {this.renderResultLabel()}
        {this.renderResultList()}
      </div>
    );
  }
}
