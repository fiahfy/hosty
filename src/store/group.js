export default {
  namespaced: true,
  state: {
    groups: []
  },
  actions: {
    createGroup ({ dispatch, state }, { group }) {
      const id = Math.max.apply(null, [0, ...state.groups.map((group) => group.id)]) + 1
      const newGroup = {
        disabled: false,
        name: '',
        hosts: [],
        ...group,
        id
      }
      const groups = [...state.groups, newGroup]
      dispatch('setGroups', { groups })
      return newGroup
    },
    updateGroup ({ dispatch, state }, { id, group }) {
      const groups = state.groups.map((currentGroup) => {
        if (currentGroup.id !== id) {
          return currentGroup
        }
        return {
          ...currentGroup,
          ...group
        }
      })
      dispatch('setGroups', { groups })
    },
    deleteGroup ({ dispatch, state }, { id }) {
      const groups = state.groups.filter((group) => group.id !== id)
      dispatch('setGroups', { groups })
    },
    setGroups ({ commit, dispatch }, { groups }) {
      commit('setGroups', { groups })
      dispatch('app/sync', null, { root: true })
    },
    createHost ({ dispatch, getters }, { groupId, host }) {
      const currentHosts = getters.getHosts({ groupId })
      const id = Math.max.apply(null, [0, ...currentHosts.map((host) => host.id)]) + 1
      const newHost = {
        disabled: false,
        name: '',
        ip: '',
        ...host,
        id
      }
      const hosts = [...currentHosts, newHost]
      dispatch('setHosts', { groupId, hosts })
      return newHost
    },
    updateHost ({ dispatch, getters }, { groupId, id, host }) {
      const hosts = getters.getHosts({ groupId }).map((currentHost) => {
        if (currentHost.id !== id) {
          return currentHost
        }
        return {
          ...currentHost,
          ...host
        }
      })
      dispatch('setHosts', { groupId, hosts })
    },
    deleteHost ({ dispatch, getters }, { groupId, id }) {
      const hosts = getters.getHosts({ groupId }).filter((host) => host.id !== id)
      dispatch('setHosts', { groupId, hosts })
    },
    setHosts ({ dispatch, state }, { groupId, hosts }) {
      const groups = state.groups.map((group) => {
        if (group.id !== groupId) {
          return group
        }
        return {
          ...group,
          hosts
        }
      })
      dispatch('setGroups', { groups })
    }
  },
  mutations: {
    setGroups (state, { groups }) {
      state.groups = groups
    }
  },
  getters: {
    getHosts (state) {
      return ({ groupId }) => {
        const group = state.groups.find((group) => group.id === groupId)
        return group ? group.hosts : []
      }
    },
    validHosts (state) {
      return state.groups
        .filter((group) => !group.disabled)
        .map((group) => group.hosts || [])
        .reduce((carry, hosts) => carry.concat(hosts), [])
        .filter((host) => !host.disabled && host.name && host.ip)
        .sort((a, b) => {
          let result = 0
          if (a.ip > b.ip) {
            result = 1
          } else if (a.ip < b.ip) {
            result = -1
          }
          if (result === 0) {
            if (a.name > b.name) {
              result = 1
            } else if (a.name < b.name) {
              result = -1
            }
          }
          return result
        })
    }
  }
}
