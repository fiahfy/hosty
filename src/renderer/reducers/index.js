import * as ActionTypes from '../actions'

function hosts(state = [], action) {
  switch (action.type) {
  case ActionTypes.READED_HOSTS:
    return action.hosts
  case ActionTypes.WRITED_HOSTS:
    return action.hosts
  case ActionTypes.ADD_HOST:
    return state.concat(action.host)
  default:
    return state
  }
}

export default {
  hosts
}
