import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { routerReducer as router } from 'react-router-redux';
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
    return state.concat().sort((a, b) => Group.compare(a, b, options));
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
      newGroup.hosts = newGroup.hosts.concat().sort((a, b) => Host.compare(a, b, options));
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

const selectedGroupIds = handleActions({
  [ActionTypes.SELECT_GROUPS]: (state, action) => {
    const { ids } = action.payload;
    return ids;
  },
}, []);

const selectedHostIds = handleActions({
  [ActionTypes.SELECT_HOSTS]: (state, action) => {
    const { ids } = action.payload;
    return ids;
  },
}, []);

const query = handleActions({
  [ActionTypes.SEARCH_ITEMS]: (state, action) => {
    const { query: newQuery } = action.payload;
    return newQuery;
  },
}, '');

export default combineReducers({
  groups,
  settings,
  messages,
  selectedGroupIds,
  selectedHostIds,
  query,
  router,
});
