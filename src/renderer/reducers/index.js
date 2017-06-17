import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import * as ActionTypes from '../actions';
import * as Group from '../utils/group';
import * as Host from '../utils/host';

function groups(state = [], action) {
  switch (action.type) {
    case ActionTypes.INITIALIZE_GROUPS: {
      const { groups: newGroups } = action.payload;
      return newGroups;
    }
    case ActionTypes.CREATE_GROUP: {
      const { group } = action.payload;
      const maxId = state.reduce((previousGroup, currentGroup) => (
        currentGroup.id > previousGroup ? currentGroup.id : previousGroup
      ), 0);
      group.id = maxId + 1;
      return [...state, group];
    }
    case ActionTypes.UPDATE_GROUP: {
      const { id, group } = action.payload;
      return state.map(currentGroup => (
        currentGroup.id !== id ? currentGroup : group
      ));
    }
    case ActionTypes.DELETE_GROUPS: {
      const { ids } = action.payload;
      return state.filter(currentGroup => (
        !ids.includes(currentGroup.id)
      ));
    }
    case ActionTypes.SELECT_GROUP: {
      const { id } = action.payload;
      return state.map((currentGroup) => {
        const newGroup = Object.assign({}, currentGroup);
        newGroup.selected = id === currentGroup.id;
        return newGroup;
      });
    }
    case ActionTypes.SELECT_GROUPS: {
      const { ids } = action.payload;
      return state.map((currentGroup) => {
        const newGroup = Object.assign({}, currentGroup);
        newGroup.selected = ids.includes(currentGroup.id);
        return newGroup;
      });
    }
    case ActionTypes.SORT_GROUPS: {
      const { key, order } = action.payload;
      return state.concat().sort((a, b) => Group.compare(a, b, key, order));
    }
    case ActionTypes.CREATE_HOST: {
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
    }
    case ActionTypes.UPDATE_HOST: {
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
    }
    case ActionTypes.DELETE_HOSTS: {
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
    }
    case ActionTypes.SELECT_HOST: {
      const { groupId, id } = action.payload;
      return state.map((currentGroup) => {
        const newGroup = Object.assign({}, currentGroup);
        if (!newGroup.hosts) {
          newGroup.hosts = [];
        }
        newGroup.hosts = newGroup.hosts.map((currentHost) => {
          const newHost = Object.assign({}, currentHost);
          newHost.selected = groupId === newGroup.id && id === newHost.id;
          return newHost;
        });
        return newGroup;
      });
    }
    case ActionTypes.SELECT_HOSTS: {
      const { groupId, ids } = action.payload;
      return state.map((currentGroup) => {
        const newGroup = Object.assign({}, currentGroup);
        if (!newGroup.hosts) {
          newGroup.hosts = [];
        }
        newGroup.hosts = newGroup.hosts.map((currentHost) => {
          const newHost = Object.assign({}, currentHost);
          newHost.selected = groupId === newGroup.id && ids.includes(newHost.id);
          return newHost;
        });
        return newGroup;
      });
    }
    case ActionTypes.SORT_HOSTS: {
      const { groupId, key, order } = action.payload;
      return state.map((currentGroup) => {
        if (currentGroup.id !== groupId) {
          return currentGroup;
        }
        const newGroup = Object.assign({}, currentGroup);
        if (!newGroup.hosts) {
          newGroup.hosts = [];
        }
        newGroup.hosts = newGroup.hosts.concat().sort((a, b) => Host.compare(a, b, key, order));
        return newGroup;
      });
    }
    default:
      return state;
  }
}

function messages(state = [], action) {
  switch (action.type) {
    case ActionTypes.CREATE_MESSAGE: {
      const { message } = action.payload;
      const maxId = state.reduce((previous, currentMessage) => (
        currentMessage.id > previous ? currentMessage.id : previous
      ), 0);
      message.id = maxId + 1;
      return [...state, message];
    }
    case ActionTypes.CLEAR_MESSAGES: {
      return [];
    }
    default:
      return state;
  }
}

export default combineReducers({
  groups,
  messages,
  router,
});
