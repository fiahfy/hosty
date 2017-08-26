import { handleActions } from 'redux-actions';
import * as ActionTypes from '../../actions';

export default handleActions({
  [ActionTypes.INITIALIZE_GROUPS]: state => (
    Object.assign({}, state, { title: '' })
  ),
}, {
  title: '',
});
