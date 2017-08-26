import { handleActions } from 'redux-actions';
import * as ActionTypes from '../../actions';

export default handleActions({
  [ActionTypes.FIND_HOSTS]: (state, action) => {
    const { query } = action.payload;
    return Object.assign({}, state, { query });
  },
  [ActionTypes.SET_REGEXP_ENABLED]: (state, action) => {
    const { enabled: regExpEnabled } = action.payload;
    return Object.assign({}, state, { regExpEnabled });
  },
}, {
  results: [],
  query: '',
  regExpEnabled: false,
});
