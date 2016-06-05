export const READED_HOSTS = 'READED_HOSTS'
export const WRITED_HOSTS = 'WRITED_HOSTS'
export const CREATE_HOST  = 'CREATE_HOST'
export const UPDATE_HOST  = 'UPDATE_HOST'
export const DELETE_HOSTS = 'DELETE_HOSTS'

export function createHost(host) {
  return {
    type: CREATE_HOST,
    host
  }
}

export function updateHost(index, host) {
  return {
    type: UPDATE_HOST,
    index,
    host
  }
}

export function deleteHosts(indexes) {
  return {
    type: DELETE_HOSTS,
    indexes
  }
}
