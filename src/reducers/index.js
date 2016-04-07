import * as ActionTypes from '../actions'

function hosts(state = [], action) {
  switch (action.type) {
  case ActionTypes.READED_HOSTS:
    return action.hosts
  default:
    return state
  }
}

export default {
  hosts
}
