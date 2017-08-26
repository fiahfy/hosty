import { handleActions } from 'redux-actions';
import * as ActionTypes from '../../actions';

export default handleActions({
  [ActionTypes.CREATE_MESSAGE]: (state, action) => {
    const { message } = action.payload;
    const maxId = state.messages.reduce((p, c) => (c.id > p ? c.id : p), 0);
    message.id = maxId + 1;
    return Object.assign({}, state, { messages: [...state.messages, message] });
  },
  [ActionTypes.CLEAR_MESSAGES]: state => (
    Object.assign({}, state, { messages: [] })
  ),
}, {
  messages: [],
});
