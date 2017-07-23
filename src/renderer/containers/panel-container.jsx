import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TextField, IconButton, Subheader, Checkbox } from 'material-ui';
import { NavigationClose, AvExplicit } from 'material-ui/svg-icons';
import * as ActionCreators from '../actions';
import ResultList from '../components/result-list';

const styles = {
  container: {
    boxSizing: 'border-box',
    height: '100%',
    overflow: 'hidden',
  },
  subheader: {
    display: 'flex',
    lineHeight: '38px',
  },
  subheaderText: {
    flex: '1',
  },
  closeButton: {
    height: '38px',
    marginRight: '9px',
    padding: '0',
    width: '38px',
  },
  closeButtonIcon: {
  },
  textFieldWrapper: {
    display: 'flex',
    padding: '0 16px',
  },
  textField: {
    fontSize: '13px',
    flex: '1',
  },
  textFieldUnderline: {
    bottom: '12px',
  },
  checkbox: {
    padding: '12px 0 12px 8px',
    width: 'auto',
  },
  checkboxIcon: {
    marginRight: '0',
  },
  listWrapper: {
    position: 'relative',
    overflowY: 'auto',
    height: 'calc(100% - 86px)',
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
    regExpEnabled: PropTypes.bool.isRequired,
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
  handleClickRegExp(e, isInputChecked) {
    this.props.actions.setRegExpEnabled(isInputChecked);
  }
  handleClickResult(groupId, hostId) {
    this.props.actions.selectGroup(groupId);
    this.props.actions.selectHost(hostId);
  }
  render() {
    const { results, query, regExpEnabled } = this.props;

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
          <span style={styles.subheaderText}>Search</span>
          <IconButton
            style={styles.closeButton}
            iconStyle={styles.closeButtonIcon}
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
          <Checkbox
            checked={regExpEnabled}
            checkedIcon={<AvExplicit />}
            uncheckedIcon={<AvExplicit />}
            style={styles.checkbox}
            iconStyle={styles.checkboxIcon}
            onCheck={(...args) => this.handleClickRegExp(...args)}
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
