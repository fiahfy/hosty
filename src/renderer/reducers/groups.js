import { handleActions } from 'redux-actions';
import * as ActionTypes from '../actions';
import * as Group from '../utils/group';

export default handleActions({
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
      name: '',
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
