import { handleActions } from 'redux-actions';
import * as ActionTypes from '../actions';

export default handleActions({
  [ActionTypes.UPDATE_SETTINGS]: (state, action) => {
    const { settings: newSettings } = action.payload;
    return newSettings;
  },
}, {});
