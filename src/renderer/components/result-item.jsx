import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem } from 'material-ui';
import { NavigationCheck } from 'material-ui/svg-icons';
import { muiThemeable, colors } from 'material-ui/styles';
import isUpdateNeeded from '../utils/is-update-needed';

const styles = {
  listItem: {
    fontSize: '13px',
    padding: '7px 52px 7px 16px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  nestedListItem: {
    padding: '0',
  },
  icon: {
    marginRight: '8px',
    verticalAlign: 'middle',
  },
  label: {
    display: 'inline-block',
    height: '24px',
    lineHeight: '24px',
    verticalAlign: 'middle',
  },
  subLabel: {
    paddingLeft: '8px',
  },
};

@muiThemeable()
export default class ResultItem extends Component {
  static propTypes = {
    result: PropTypes.object,
    onClickResult: PropTypes.func,
    muiTheme: PropTypes.object.isRequired,
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
    const { result, muiTheme } = this.props;

    return (
      <ListItem
        className="result-list"
        primaryText={
          <span>
            <span style={styles.label}>{result.name}</span>
            <span style={{
              ...styles.label,
              ...styles.subLabel,
              color: muiTheme.palette.primary3Color,
            }}
            >
              {(result.hosts || []).length}
            </span>
          </span>
        }
        innerDivStyle={styles.listItem}
        nestedListStyle={styles.nestedListItem}
        initiallyOpen
        primaryTogglesNestedList
        nestedItems={
          result.hosts.map((host) => {
            const visibility = result.enable && host.enable ? 'visible' : 'hidden';
            return (
              <ListItem
                key={host.id}
                primaryText={
                  <span>
                    <NavigationCheck
                      color={colors.green400}
                      style={{
                        ...styles.icon,
                        visibility,
                      }}
                    />
                    <span style={styles.label}>{host.host}</span>
                    <span style={{
                      ...styles.label,
                      ...styles.subLabel,
                      color: muiTheme.palette.primary3Color,
                    }}
                    >
                      ({host.ip})
                    </span>
                  </span>
                }
                innerDivStyle={styles.listItem}
                onClick={() => this.handleClickResult(host)}
              />
            );
          })
        }
      />
    );
  }
}
