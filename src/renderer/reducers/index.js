import * as ActionTypes from '../actions'

function groups(state = [], action) {
  switch (action.type) {
    case ActionTypes.INITIALIZE_GROUPS: {
      const { groups: newGroups } = action
      return newGroups
    }
    case ActionTypes.CREATE_GROUP: {
      const { group } = action
      const maxId = state.reduce((previous, currentGroup) => (
        currentGroup.id > previous ? currentGroup.id : previous
      ), 0)
      group.id = maxId + 1
      return [...state, group]
    }
    case ActionTypes.UPDATE_GROUP: {
      const { id, group } = action
      return state.map(currentGroup => (
        currentGroup.id !== id ? currentGroup : group
      ))
    }
    case ActionTypes.DELETE_GROUPS: {
      const { ids } = action
      return state.filter(currentGroup => (
        !ids.includes(currentGroup.id)
      ))
    }
    case ActionTypes.CREATE_HOST: {
      const { groupId, host } = action
      return state.map(currentGroup => {
        if (currentGroup.id !== groupId) {
          return currentGroup
        }
        const newGroup = Object.assign({}, currentGroup)
        if (!newGroup.hosts) {
          newGroup.hosts = []
        }
        const maxId = newGroup.hosts.reduce((previous, currentHost) => (
          currentHost.id > previous ? currentHost.id : previous
        ), 0)
        host.id = maxId + 1
        newGroup.hosts = [...newGroup.hosts, host]
        return newGroup
      })
    }
    case ActionTypes.UPDATE_HOST: {
      const { groupId, id, host } = action
      return state.map(currentGroup => {
        if (currentGroup.id !== groupId) {
          return currentGroup
        }
        const newGroup = Object.assign({}, currentGroup)
        if (!newGroup.hosts) {
          newGroup.hosts = []
        }
        newGroup.hosts = newGroup.hosts.map(currentHost => (
          currentHost.id !== id ? currentHost : host
        ))
        return newGroup
      })
    }
    case ActionTypes.DELETE_HOSTS: {
      const { groupId, ids } = action
      return state.map(currentGroup => {
        if (currentGroup.id !== groupId) {
          return currentGroup
        }
        const newGroup = Object.assign({}, currentGroup)
        if (!newGroup.hosts) {
          newGroup.hosts = []
        }
        newGroup.hosts = newGroup.hosts.filter(currentHost => (
          !ids.includes(currentHost.id)
        ))
        return newGroup
      })
    }
    default:
      return state
  }
}

function messages(state = [], action) {
  switch (action.type) {
    case ActionTypes.CREATE_MESSAGE: {
      const { message } = action
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
  messages,
}
