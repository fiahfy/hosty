import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { routerReducer as router } from 'react-router-redux';
import reduceReducers from 'reduce-reducers';
import * as ActionTypes from '../actions';
import * as Group from '../utils/group';
import * as Host from '../utils/host';
import * as Result from '../utils/result';

const groups = handleActions({
  [ActionTypes.INITIALIZE_GROUPS]: (state, action) => {
    const { groups: newGroups } = action.payload;
    return newGroups;
  },
  [ActionTypes.CREATE_GROUP]: (state, action) => {
    const { group } = action.payload;
    const maxId = state.reduce((previousGroup, currentGroup) => (
      currentGroup.id > previousGroup ? currentGroup.id : previousGroup
    ), 0);
    group.id = maxId + 1;
    return [...state, group];
  },
  [ActionTypes.UPDATE_GROUP]: (state, action) => {
    const { id, group } = action.payload;
    return state.map(currentGroup => (
      currentGroup.id !== id ? currentGroup : group
    ));
  },
  [ActionTypes.SORT_GROUPS]: (state, action) => {
    const { options } = action.payload;
    return state.concat().sort((a, b) => {
      if (!a[Group.KEY_NAME]) {
        return 1;
      }
      if (!b[Group.KEY_NAME]) {
        return -1;
      }
      const result = Group.compare(a, b, options);
      if (result !== 0) {
        return result;
      }
      return Group.compare(a, b, { key: Group.KEY_ID, order: Group.SORT_ASC });
    });
  },
}, []);

const settings = handleActions({
  [ActionTypes.UPDATE_SETTINGS]: (state, action) => {
    const { settings: newSettings } = action.payload;
    return newSettings;
  },
}, {});

const messages = handleActions({
  [ActionTypes.CREATE_MESSAGE]: (state, action) => {
    const { message } = action.payload;
    const maxId = state.reduce((previous, currentMessage) => (
      currentMessage.id > previous ? currentMessage.id : previous
    ), 0);
    message.id = maxId + 1;
    return [...state, message];
  },
  [ActionTypes.CLEAR_MESSAGES]: () => [],
}, []);

const mainContainer = handleActions({
  [ActionTypes.SORT_GROUPS]: (state, action) => {
    const { options } = action.payload;
    return Object.assign({}, state, { groupSortOptions: options });
  },
  [ActionTypes.SELECT_GROUP]: (state, action) => {
    const { id, mode } = action.payload;
    return Object.assign({}, state, {
      selectedGroupIds: (() => {
        switch (mode) {
          case 'append': {
            const { selectedGroupIds } = state;
            if (selectedGroupIds.includes(id)) {
              return selectedGroupIds.filter(currentId => (
                currentId !== id
              ));
            }
            return [...selectedGroupIds, id];
          }
          case 'shift': {
            const { selectedGroupIds } = state;
            if (selectedGroupIds.includes(id)) {
              return selectedGroupIds;
            }
            return [id];
          }
          default:
            return [id];
        }
      })(),
      selectedHostIds: [],
      hostSortOptions: {},
    });
  },
  [ActionTypes.UNSELECT_GROUP_ALL]: state => (
    Object.assign({}, state, { selectedGroupIds: [] })
  ),
  [ActionTypes.SORT_HOSTS]: (state, action) => {
    const { options } = action.payload;
    return Object.assign({}, state, { hostSortOptions: options });
  },
  [ActionTypes.SELECT_HOST]: (state, action) => {
    const { id, mode } = action.payload;
    return Object.assign({}, state, {
      selectedHostIds: (() => {
        switch (mode) {
          case 'append': {
            const { selectedHostIds } = state;
            if (selectedHostIds.includes(id)) {
              return selectedHostIds.filter(currentId => (
                currentId !== id
              ));
            }
            return [...selectedHostIds, id];
          }
          case 'shift': {
            const { selectedHostIds } = state;
            if (selectedHostIds.includes(id)) {
              return selectedHostIds;
            }
            return [id];
          }
          default:
            return [id];
        }
      })(),
    });
  },
  [ActionTypes.UNSELECT_HOST_ALL]: state => (
    Object.assign({}, state, { selectedHostIds: [] })
  ),
}, {
  focusedGroupId: 0,
  focusedHostId: 0,
  selectedGroupIds: [],
  selectedHostIds: [],
  copiedGroups: [],
  copiedHosts: [],
  groupSortOptions: {},
  hostSortOptions: {},
});

const searchContainer = handleActions({
  [ActionTypes.SEARCH]: (state, action) => {
    const { query } = action.payload;
    return Object.assign({}, state, { query });
  },
  [ActionTypes.SORT_RESULTS]: (state, action) => {
    const { options } = action.payload;
    const results = state.results.concat()
      .sort((a, b) => Result.compare(a, b, options));
    return Object.assign({}, state, {
      results,
      sortOptions: options,
    });
  },
  [ActionTypes.SELECT_RESULT]: (state, action) => {
    const { id, mode } = action.payload;
    return Object.assign({}, state, {
      selectedIds: (() => {
        switch (mode) {
          case 'append': {
            const { selectedIds } = state;
            if (selectedIds.includes(id)) {
              return selectedIds.filter(currentId => (
                currentId !== id
              ));
            }
            return [...selectedIds, id];
          }
          case 'shift': {
            const { selectedIds } = state;
            if (selectedIds.includes(id)) {
              return selectedIds;
            }
            return [id];
          }
          default:
            return [id];
        }
      })(),
    });
  },
}, {
  results: [],
  query: '',
  selectedIds: [],
  sortOptions: {},
});

export default reduceReducers(
  combineReducers({
    groups,
    settings,
    messages,
    mainContainer,
    searchContainer,
    router,
  }),
  handleActions({
    [ActionTypes.DELETE_GROUPS]: (state) => {
      const { selectedGroupIds } = state.mainContainer;

      const lastIndex = state.groups.reduce((previousValue, currentValue, index) => (
          selectedGroupIds.includes(currentValue.id) ? index : previousValue
        ), null);
      const selectedIndex = lastIndex < state.groups.length - 1 ? lastIndex + 1 : lastIndex - 1;
      const newGroup = state.groups[selectedIndex];
      const newSelectedGroupIds = newGroup ? [newGroup.id] : [];

      return Object.assign({}, state, {
        groups: state.groups.filter(currentGroup => (
          !selectedGroupIds.includes(currentGroup.id)
        )),
        mainContainer: {
          ...state.mainContainer,
          selectedGroupIds: newSelectedGroupIds,
          selectedHostIds: [],
          hostSortOptions: {},
        },
      });
    },
    [ActionTypes.COPY_GROUPS]: (state) => {
      const { selectedGroupIds } = state.mainContainer;

      return Object.assign({}, state, {
        mainContainer: {
          ...state.mainContainer,
          copiedGroups: state.groups.filter(group => selectedGroupIds.includes(group.id)),
        },
      });
    },
    [ActionTypes.PASTE_GROUPS]: (state) => {
      const { copiedGroups } = state.mainContainer;

      const maxId = state.groups.reduce((previous, currentHost) => (
        currentHost.id > previous ? currentHost.id : previous
      ), 0);
      const newGroups = copiedGroups.map((group, index) => (
        Object.assign({}, group, { id: maxId + index + 1 })
      ));

      return Object.assign({}, state, {
        groups: [...state.groups, ...newGroups],
      });
    },
    [ActionTypes.FOCUS_GROUP]: (state) => {
      const { groups: newGroups } = state;

      const group = newGroups[newGroups.length - 1];
      if (!group) {
        return state;
      }

      return Object.assign({}, state, {
        mainContainer: {
          ...state.mainContainer,
          focusedGroupId: group.id,
          selectedGroupIds: [group.id],
        },
      });
    },
    [ActionTypes.CREATE_HOST]: (state, action) => {
      const { selectedGroupIds } = state.mainContainer;
      const { host } = action.payload;

      const selectedGroupId = selectedGroupIds[0];
      if (!selectedGroupId) {
        return state;
      }

      return Object.assign({}, state, {
        groups: state.groups.map((currentGroup) => {
          if (currentGroup.id !== selectedGroupId) {
            return currentGroup;
          }
          const newGroup = Object.assign({}, currentGroup);
          if (!newGroup.hosts) {
            newGroup.hosts = [];
          }
          const maxId = newGroup.hosts.reduce((previous, currentHost) => (
            currentHost.id > previous ? currentHost.id : previous
          ), 0);
          host.id = maxId + 1;
          newGroup.hosts = [...newGroup.hosts, host];
          return newGroup;
        }),
      });
    },
    [ActionTypes.UPDATE_HOST]: (state, action) => {
      const { selectedGroupIds } = state.mainContainer;
      const { id, host } = action.payload;

      const selectedGroupId = selectedGroupIds[0];
      if (!selectedGroupId) {
        return state;
      }

      return Object.assign({}, state, {
        groups: state.groups.map((currentGroup) => {
          if (currentGroup.id !== selectedGroupId) {
            return currentGroup;
          }
          const newGroup = Object.assign({}, currentGroup);
          if (!newGroup.hosts) {
            newGroup.hosts = [];
          }
          newGroup.hosts = newGroup.hosts.map(currentHost => (
            currentHost.id !== id ? currentHost : host
          ));
          return newGroup;
        }),
      });
    },
    [ActionTypes.DELETE_HOSTS]: (state) => {
      const { selectedGroupIds, selectedHostIds } = state.mainContainer;

      const selectedGroupId = selectedGroupIds[0];
      if (!selectedGroupId) {
        return state;
      }
      const group = state.groups.find(currentGroup => currentGroup.id === selectedGroupId);
      if (!group) {
        return state;
      }
      const hosts = group.hosts || [];
      const lastIndex = hosts.reduce((previousValue, currentValue, index) => (
          selectedHostIds.includes(currentValue.id) ? index : previousValue
        ), null);
      const selectedIndex = lastIndex < hosts.length - 1 ? lastIndex + 1 : lastIndex - 1;
      const newHost = hosts[selectedIndex];
      const newSelectedHostsIds = newHost ? [newHost.id] : [];

      return Object.assign({}, state, {
        groups: state.groups.map((currentGroup) => {
          if (currentGroup.id !== selectedGroupId) {
            return currentGroup;
          }
          return Object.assign({}, currentGroup, {
            hosts: (currentGroup.hosts || []).filter(currentHost => (
              !selectedHostIds.includes(currentHost.id)
            )),
          });
        }),
        mainContainer: {
          ...state.mainContainer,
          selectedHostIds: newSelectedHostsIds,
        },
      });
    },
    [ActionTypes.COPY_HOSTS]: (state) => {
      const { selectedGroupIds, selectedHostIds } = state.mainContainer;

      const selectedGroupId = selectedGroupIds[0];
      if (!selectedGroupId) {
        return state;
      }
      const group = state.groups.find(currentGroup => currentGroup.id === selectedGroupId);
      if (!group) {
        return state;
      }
      const hosts = group.hosts || [];

      return Object.assign({}, state, {
        mainContainer: {
          ...state.mainContainer,
          copiedHosts: hosts.filter(host => selectedHostIds.includes(host.id)),
        },
      });
    },
    [ActionTypes.PASTE_HOSTS]: (state) => {
      const { selectedGroupIds, copiedHosts } = state.mainContainer;

      const selectedGroupId = selectedGroupIds[0];
      if (!selectedGroupId) {
        return state;
      }

      return Object.assign({}, state, {
        groups: state.groups.map((currentGroup) => {
          if (currentGroup.id !== selectedGroupId) {
            return currentGroup;
          }
          const newGroup = Object.assign({}, currentGroup);
          if (!newGroup.hosts) {
            newGroup.hosts = [];
          }
          const maxId = newGroup.hosts.reduce((previous, currentHost) => (
            currentHost.id > previous ? currentHost.id : previous
          ), 0);
          const newHosts = copiedHosts.map((host, index) => (
            Object.assign({}, host, { id: maxId + index + 1 })
          ));
          newGroup.hosts = [...newGroup.hosts, ...newHosts];
          return newGroup;
        }),
      });
    },
    [ActionTypes.SORT_HOSTS]: (state, action) => {
      const { selectedGroupIds } = state.mainContainer;
      const { options } = action.payload;

      const selectedGroupId = selectedGroupIds[0];
      if (!selectedGroupId) {
        return state;
      }

      return Object.assign({}, state, {
        groups: state.groups.map((currentGroup) => {
          if (currentGroup.id !== selectedGroupId) {
            return currentGroup;
          }
          const newGroup = Object.assign({}, currentGroup);
          if (!newGroup.hosts) {
            newGroup.hosts = [];
          }
          newGroup.hosts = newGroup.hosts.concat().sort((a, b) => {
            if (!a[Host.KEY_HOST]) {
              return 1;
            }
            if (!b[Host.KEY_HOST]) {
              return -1;
            }
            const result = Host.compare(a, b, options);
            if (result !== 0) {
              return result;
            }
            return Host.compare(a, b, { key: Host.KEY_ID, order: Host.SORT_ASC });
          });
          return newGroup;
        }),
      });
    },
    [ActionTypes.FOCUS_HOST]: (state) => {
      const { selectedGroupIds } = state.mainContainer;

      const group = state.groups.find(currentGroup => (
        currentGroup.id === selectedGroupIds[0]
      ));
      if (!group) {
        return state;
      }
      const host = group.hosts[group.hosts.length - 1];
      if (!host) {
        return state;
      }

      return Object.assign({}, state, {
        mainContainer: {
          ...state.mainContainer,
          focusedHostId: host.id,
          selectedHostIds: [host.id],
        },
      });
    },
    [ActionTypes.SEARCH]: (state) => {
      const { query, sortOptions } = state.searchContainer;

      return Object.assign({}, state, {
        searchContainer: {
          ...state.searchContainer,
          results: state.groups.reduce((previous, current) => (
              previous.concat((current.hosts || []).map(host => ({
                id: `${current.id}-${host.id}`,
                group: current,
                host,
              })))
            ), [])
            .filter((result) => {
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
            })
            .sort((a, b) => Result.compare(a, b, sortOptions)),
        },
      });
    },
  }, {}),
);
