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
    return newGroups.map((group, i) => (
      Object.assign({}, group, {
        id: i + 1,
        hosts: (group.hosts || []).map((host, j) => (
          Object.assign({}, host, {
            id: j + 1,
          })
        )),
      })
    ));
  },
  [ActionTypes.ADD_GROUPS]: (state, action) => {
    let { groups: newGroups } = action.payload;
    const maxId = state.reduce((p, c) => (c.id > p ? c.id : p), 0);
    newGroups = newGroups.map((group, i) => (
      Object.assign({}, group, {
        id: maxId + i + 1,
        hosts: (group.hosts || []).map((host, j) => (
          Object.assign({}, host, {
            id: j + 1,
          })
        )),
      })
    ));
    return [...state, ...newGroups];
  },
  [ActionTypes.CREATE_GROUP]: (state) => {
    const maxId = state.reduce((p, c) => (c.id > p ? c.id : p), 0);
    const group = {
      id: maxId + 1,
      enable: true,
      hosts: [],
    };
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
    const maxId = state.reduce((p, c) => (c.id > p ? c.id : p), 0);
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
  copiedGroups: [],
  copiedHosts: [],
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
      const lastIndex = state.groups.reduce((p, c, i) => (
        selectedGroupIds.includes(c.id) ? i : p
      ), null);
      const selectedIndex = lastIndex < state.groups.length - 1 ? lastIndex + 1 : lastIndex - 1;
      const newGroup = state.groups[selectedIndex];
      const newSelectedGroupIds = newGroup ? [newGroup.id] : [];
      return Object.assign({}, state, {
        groups: state.groups.filter(group => !selectedGroupIds.includes(group.id)),
        mainContainer: {
          ...state.mainContainer,
          selectedGroupIds: newSelectedGroupIds,
          selectedHostIds: [],
          hostSortOptions: {},
        },
      });
    },
    [ActionTypes.CUT_GROUPS]: (state) => {
      const { selectedGroupIds } = state.mainContainer;
      const lastIndex = state.groups.reduce((p, c, i) => (
        selectedGroupIds.includes(c.id) ? i : p
      ), null);
      const selectedIndex = lastIndex < state.groups.length - 1 ? lastIndex + 1 : lastIndex - 1;
      const newGroup = state.groups[selectedIndex];
      const newSelectedGroupIds = newGroup ? [newGroup.id] : [];
      return Object.assign({}, state, {
        groups: state.groups.filter(group => !selectedGroupIds.includes(group.id)),
        mainContainer: {
          ...state.mainContainer,
          selectedGroupIds: newSelectedGroupIds,
          copiedGroups: state.groups.filter(group => selectedGroupIds.includes(group.id)),
          copiedHosts: [],
        },
      });
    },
    [ActionTypes.COPY_GROUPS]: (state) => {
      const { selectedGroupIds } = state.mainContainer;
      return Object.assign({}, state, {
        mainContainer: {
          ...state.mainContainer,
          copiedGroups: state.groups.filter(group => selectedGroupIds.includes(group.id)),
          copiedHosts: [],
        },
      });
    },
    [ActionTypes.PASTE_GROUPS]: (state) => {
      const { copiedGroups } = state.mainContainer;
      const maxId = state.groups.reduce((p, c) => (c.id > p ? c.id : p), 0);
      const newGroups = copiedGroups.map((group, i) => (
        Object.assign({}, group, { id: maxId + i + 1 })
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
    [ActionTypes.SELECT_GROUP]: (state, action) => {
      const { id, option } = action.payload;
      const { selectedGroupIds } = state.mainContainer;
      return Object.assign({}, state, {
        mainContainer: {
          ...state.mainContainer,
          selectedHostIds: [],
          hostSortOptions: {},
          selectedGroupIds: (() => {
            switch (option) {
              case 'shift': {
                const lastId = selectedGroupIds.length
                  ? selectedGroupIds[selectedGroupIds.length - 1] : 0;
                let lastIndex = state.groups.findIndex(group => group.id === lastId);
                let firstIndex = state.groups.findIndex(group => group.id === id);
                if (firstIndex > lastIndex) {
                  [firstIndex, lastIndex] = [lastIndex, firstIndex];
                }
                const groupIds = state.groups.filter((group, i) => firstIndex <= i && i <= lastIndex)
                  .map(group => group.id)
                  .filter(currentId => !selectedGroupIds.includes(currentId));
                return [...selectedGroupIds, ...groupIds];
              }
              case 'ctrl': {
                if (selectedGroupIds.includes(id)) {
                  return selectedGroupIds.filter(currentId => (
                    currentId !== id
                  ));
                }
                return [...selectedGroupIds, id];
              }
              case 'rightClick': {
                if (selectedGroupIds.includes(id)) {
                  return selectedGroupIds;
                }
                return [id];
              }
              case 'leftClick':
                return [id];
              default:
                return selectedGroupIds;
            }
          })(),
        },
      });
    },
    [ActionTypes.CREATE_HOST]: (state) => {
      const { selectedGroupIds } = state.mainContainer;
      const selectedGroupId = selectedGroupIds[0];
      if (!selectedGroupId) {
        return state;
      }
      return Object.assign({}, state, {
        groups: state.groups.map((group) => {
          if (group.id !== selectedGroupId) {
            return group;
          }
          const newGroup = Object.assign({}, group);
          if (!newGroup.hosts) {
            newGroup.hosts = [];
          }
          const maxId = newGroup.hosts.reduce((p, c) => (c.id > p ? c.id : p), 0);
          const host = {
            id: maxId + 1,
            enable: true,
          };
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
        groups: state.groups.map((group) => {
          if (group.id !== selectedGroupId) {
            return group;
          }
          const newGroup = Object.assign({}, group);
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
      const lastIndex = hosts.reduce((p, c, i) => (
        selectedHostIds.includes(c.id) ? i : p
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
            hosts: (currentGroup.hosts || []).filter(host => (
              !selectedHostIds.includes(host.id)
            )),
          });
        }),
        mainContainer: {
          ...state.mainContainer,
          selectedHostIds: newSelectedHostsIds,
        },
      });
    },
    [ActionTypes.CUT_HOSTS]: (state) => {
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
      const lastIndex = hosts.reduce((p, c, i) => (
        selectedHostIds.includes(c.id) ? i : p
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
            hosts: (currentGroup.hosts || []).filter(host => (
              !selectedHostIds.includes(host.id)
            )),
          });
        }),
        mainContainer: {
          ...state.mainContainer,
          selectedHostIds: newSelectedHostsIds,
          copiedHosts: hosts.filter(host => selectedHostIds.includes(host.id)),
          copiedGroups: [],
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
          copiedGroups: [],
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
        groups: state.groups.map((group) => {
          if (group.id !== selectedGroupId) {
            return group;
          }
          const newGroup = Object.assign({}, group);
          if (!newGroup.hosts) {
            newGroup.hosts = [];
          }
          const maxId = newGroup.hosts.reduce((p, c) => (c.id > p ? c.id : p), 0);
          const newHosts = copiedHosts.map((host, i) => (
            Object.assign({}, host, { id: maxId + i + 1 })
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
        groups: state.groups.map((group) => {
          if (group.id !== selectedGroupId) {
            return group;
          }
          const newGroup = Object.assign({}, group);
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
    [ActionTypes.SELECT_HOST]: (state, action) => {
      const { id, option } = action.payload;
      const { selectedGroupIds, selectedHostIds } = state.mainContainer;
      const group = state.groups.find(currentGroup => (
        currentGroup.id === selectedGroupIds[0]
      ));
      const hosts = (group ? group.hosts : []) || [];
      return Object.assign({}, state, {
        mainContainer: {
          ...state.mainContainer,
          selectedHostIds: (() => {
            switch (option) {
              case 'shift': {
                const lastId = selectedHostIds.length
                  ? selectedHostIds[selectedHostIds.length - 1] : 0;
                let lastIndex = hosts.findIndex(host => host.id === lastId);
                let firstIndex = hosts.findIndex(host => host.id === id);
                if (firstIndex > lastIndex) {
                  [firstIndex, lastIndex] = [lastIndex, firstIndex];
                }
                const hostIds = hosts.filter((host, i) => firstIndex <= i && i <= lastIndex)
                  .map(host => host.id)
                  .filter(currentId => !selectedHostIds.includes(currentId));
                return [...selectedHostIds, ...hostIds];
              }
              case 'ctrl': {
                if (selectedHostIds.includes(id)) {
                  return selectedHostIds.filter(currentId => (
                    currentId !== id
                  ));
                }
                return [...selectedHostIds, id];
              }
              case 'rightClick': {
                if (selectedHostIds.includes(id)) {
                  return selectedHostIds;
                }
                return [id];
              }
              case 'leftClick':
                return [id];
              default:
                return selectedHostIds;
            }
          })(),
        },
      });
    },
    [ActionTypes.SEARCH]: (state) => {
      const { query, sortOptions } = state.searchContainer;
      return Object.assign({}, state, {
        searchContainer: {
          ...state.searchContainer,
          results: state.groups.reduce((p, c) => (
              p.concat((c.hosts || []).map(host => ({
                id: `${c.id}-${host.id}`,
                group: c,
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
