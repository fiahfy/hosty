import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { routerReducer as router } from 'react-router-redux';
import reduceReducers from 'reduce-reducers';
import * as ActionTypes from '../actions';
import * as Group from '../utils/group';
import * as Host from '../utils/host';

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
  [ActionTypes.DELETE_GROUPS]: (state, action) => {
    const { ids } = action.payload;
    return state.filter(currentGroup => (
      !ids.includes(currentGroup.id)
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
  [ActionTypes.CREATE_HOST]: (state, action) => {
    const { groupId, host } = action.payload;
    return state.map((currentGroup) => {
      if (currentGroup.id !== groupId) {
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
    });
  },
  [ActionTypes.UPDATE_HOST]: (state, action) => {
    const { groupId, id, host } = action.payload;
    return state.map((currentGroup) => {
      if (currentGroup.id !== groupId) {
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
    });
  },
  [ActionTypes.DELETE_HOSTS]: (state, action) => {
    const { groupId, ids } = action.payload;
    return state.map((currentGroup) => {
      if (currentGroup.id !== groupId) {
        return currentGroup;
      }
      const newGroup = Object.assign({}, currentGroup);
      if (!newGroup.hosts) {
        newGroup.hosts = [];
      }
      newGroup.hosts = newGroup.hosts.filter(currentHost => (
        !ids.includes(currentHost.id)
      ));
      return newGroup;
    });
  },
  [ActionTypes.SORT_HOSTS]: (state, action) => {
    const { groupId, options } = action.payload;
    return state.map((currentGroup) => {
      if (currentGroup.id !== groupId) {
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
  [ActionTypes.SORT_GROUPS]: (state, action) => {
    const { options } = action.payload;
    return Object.assign({}, state, { groupSortOptions: options });
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
  [ActionTypes.SORT_HOSTS]: (state, action) => {
    const { options } = action.payload;
    return Object.assign({}, state, { hostSortOptions: options });
  },
}, {
  focusedGroupId: 0,
  focusedHostId: 0,
  selectedGroupIds: [],
  selectedHostIds: [],
  groupSortOptions: {},
  hostSortOptions: {},
});

const searchContainer = handleActions({
  [ActionTypes.SEARCH]: (state, action) => {
    const { query } = action.payload;
    return Object.assign({}, state, { query });
  },
}, {
  query: '',
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
    [ActionTypes.FOCUS_HOST]: (state) => {
      const group = state.groups.find(currentGroup => (
        currentGroup.id === state.mainContainer.selectedGroupIds[0]
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
  }, {}),
);
