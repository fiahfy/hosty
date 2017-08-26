import { handleActions } from 'redux-actions';
import * as ActionTypes from '../../actions';

export default handleActions({
  [ActionTypes.SHOW_PANEL]: state => (
    Object.assign({}, state, { panelOpen: true })
  ),
  [ActionTypes.HIDE_PANEL]: state => (
    Object.assign({}, state, { panelOpen: false })
  ),
}, {
  panelOpen: false,
});
