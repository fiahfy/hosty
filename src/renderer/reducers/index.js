import * as ActionTypes from '../actions'

function hosts(state = [], action) {
  switch (action.type) {
  // case ActionTypes.READED_HOSTS:
  //   return action.hosts
  // case ActionTypes.WRITED_HOSTS:
  //   return action.hosts
  case ActionTypes.CREATE_HOST: {
    const {host} = action
    return [...state, host]
  }
  case ActionTypes.UPDATE_HOST: {
    const {index, host} = action
    return [
      ...state.slice(0, index),
      host,
      ...state.slice(index + 1)
    ]
  }
  default:
    return state
  }
}

export default {
  hosts
}
