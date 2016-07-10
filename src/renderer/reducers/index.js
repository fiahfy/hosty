import * as ActionTypes from '../actions'

function groups(state = [], action) {
  switch (action.type) {
  case ActionTypes.INITIALIZE_GROUPS: {
    const {groups} = action
    return groups
  }
  case ActionTypes.CREATE_GROUP: {
    const {group} = action
    const maxId = state.reduce((previous, currentGroup) => {
      return currentGroup.id > previous ? currentGroup.id : previous
    }, 0)
    group.id = maxId + 1
    return [...state, group]
  }
  case ActionTypes.UPDATE_GROUP: {
    const {id, group} = action
    return state.map(currentGroup => {
      return currentGroup.id !== id ? currentGroup : group
    })
  }
  case ActionTypes.DELETE_GROUPS: {
    const {ids} = action
    return state.filter(currentGroup => {
      return !ids.includes(currentGroup.id)
    })
  }
  case ActionTypes.CREATE_HOST: {
    const {groupId, host} = action
    return state.map(currentGroup => {
      if (currentGroup.id !== groupId) {
        return currentGroup
      }
      if (!currentGroup.hosts) {
        currentGroup.hosts = []
      }
      const maxId = currentGroup.hosts.reduce((previous, currentHost) => {
        return currentHost.id > previous ? currentHost.id : previous
      }, 0)
      host.id = maxId + 1
      currentGroup.hosts = [...currentGroup.hosts, host]
      return currentGroup
    })
  }
  case ActionTypes.UPDATE_HOST: {
    const {groupId, id, host} = action
    return state.map(currentGroup => {
      if (currentGroup.id !== groupId) {
        return currentGroup
      }
      if (!currentGroup.hosts) {
        currentGroup.hosts = []
      }
      currentGroup.hosts = currentGroup.hosts.map(currentHost => {
        return currentHost.id !== id ? currentHost : host
      })
      return currentGroup
    })
  }
  case ActionTypes.DELETE_HOSTS: {
    const {groupId, ids} = action
    return state.map(currentGroup => {
      if (currentGroup.id !== groupId) {
        return currentGroup
      }
      if (!currentGroup.hosts) {
        currentGroup.hosts = []
      }
      currentGroup.hosts = currentGroup.hosts.filter(currentHost => {
        return !ids.includes(currentHost.id)
      })
      return currentGroup
    })
  }
  default:
    return state
  }
}

function messages(state = [], action) {
  switch (action.type) {
  case ActionTypes.CREATE_MESSAGE: {
    const {message} = action
    message.id = (new Date).getTime()
    return [...state, message]
  }
  case ActionTypes.CLEAR_MESSAGES: {
    return []
  }
  default:
    return state
  }
}

export default {
  groups,
  messages
}
