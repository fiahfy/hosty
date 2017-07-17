import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ActionCreators from '../actions';
import { TextField, IconButton, Subheader } from 'material-ui';
import { NavigationClose } from 'material-ui/svg-icons';
import ResultList from '../components/result-list';

const styles = {
  container: {
    boxSizing: 'border-box',
    height: '100%',
    overflow: 'hidden',
  },
  subheader: {
    lineHeight: '38px',
  },
  closeButton: {
    float: 'right',
    height: '38px',
    marginRight: '16px',
    padding: '0px',
    width: 'auto',
  },
  icon: {
    height: '20px',
    width: '20px',
  },
  textFieldWrapper: {
    clear: 'both',
    content: '',
    display: 'block',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  textField: {
    fontSize: '13px',
    height: '32px',
  },
  textFieldUnderline: {
    bottom: '2px',
  },
  listWrapper: {
    position: 'relative',
    overflowY: 'auto',
    height: 'calc(100% - 76px)',
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
  return { ...state.panelContainer };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PanelContainer extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    results: PropTypes.arrayOf(PropTypes.object).isRequired,
    query: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
  };
  handleClick() {
    this.props.actions.hidePanel();
  }
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.props.actions.search(this.textInput.getValue());
    }
  }
  handleClickResult(groupId, hostId) {
    this.props.actions.selectGroup(groupId);
    this.props.actions.selectHost(hostId);
  }
  render() {
    const { results, query } = this.props;

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
        <Subheader style={styles.subheader}>
          Search
          <IconButton
            style={styles.closeButton}
            iconStyle={styles.icon}
            onClick={e => this.handleClick(e)}
          >
            <NavigationClose />
          </IconButton>
        </Subheader>
        <div style={styles.textFieldWrapper}>
          <TextField
            style={styles.textField}
            underlineStyle={styles.textFieldUnderline}
            name="query"
            defaultValue={query}
            ref={(input) => { this.textInput = input; }}
            autoFocus
            fullWidth
            onKeyDown={e => this.handleKeyDown(e)}
          />
        </div>
        <div style={styles.listWrapper}>
          <ResultList
            results={results}
            onClickResult={(...args) => this.handleClickResult(...args)}
          />
          {emptyView}
        </div>
      </div>
    );
  }
}
