export const READED_HOSTS = 'READED_HOSTS'
export const WRITED_HOSTS = 'WRITED_HOSTS'
export const CREATE_HOST  = 'CREATE_HOST'
export const UPDATE_HOST  = 'UPDATE_HOST'
export const DELETE_HOSTS = 'DELETE_HOSTS'
export const CREATE_GROUP  = 'CREATE_GROUP'
export const UPDATE_GROUP  = 'UPDATE_GROUP'
export const DELETE_GROUPS = 'DELETE_GROUPS'

export function createGroup(group) {
  return {
    type: CREATE_GROUP,
    group
  }
}

export function updateGroup(id, group) {
  return {
    type: UPDATE_GROUP,
    id,
    group
  }
}

export function deleteGroups(ids) {
  return {
    type: DELETE_GROUPS,
    ids
  }
}

export function createHost(groupId, host) {
  return {
    type: CREATE_HOST,
    groupId,
    host
  }
}

export function updateHost(groupId, id, host) {
  return {
    type: UPDATE_HOST,
    groupId,
    id,
    host
  }
}

export function deleteHosts(groupId, ids) {
  return {
    type: DELETE_HOSTS,
    groupId,
    ids
  }
}
