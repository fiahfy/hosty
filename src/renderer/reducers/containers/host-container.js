import { handleActions } from 'redux-actions';
import * as ActionTypes from '../../actions';

export default handleActions({
  [ActionTypes.INITIALIZE_GROUPS]: state => (
    Object.assign({}, state, {
      selectedIds: [],
      sortOptions: {},
      copiedHosts: [],
    })
  ),
  [ActionTypes.SORT_HOSTS]: (state, action) => {
    const { options } = action.payload;
    return Object.assign({}, state, { sortOptions: options });
  },
}, {
  focusedId: 0,
  selectedIds: [],
  sortOptions: {},
  copiedHosts: [],
});
