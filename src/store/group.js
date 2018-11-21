export default {
  namespaced: true,
  state: {
    groups: []
  },
  getters: {
    getHosts(state) {
      return ({ groupId }) => {
        const group = state.groups.find((group) => group.id === groupId)
        return group ? group.hosts : []
      }
    },
    actualHosts(state) {
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
    },
    findHostErrors(state, getters) {
      return ({ group, host }) => {
        return [
          ...getters.findHostIPErrors({ group, host }),
          ...getters.findHostNameErrors({ group, host })
        ]
      }
    },
    findHostIPErrors() {
      return ({ host }) => {
        const errors = []
        if (!host.ip) {
          errors.push('Missing ip address.')
        }
        return errors
      }
    },
    findHostNameErrors(state) {
      return ({ group, host }) => {
        const errors = []
        if (!host.name) {
          errors.push('Missing hostname.')
          return errors
        }
        if (group.disabled || host.disabled) {
          return errors
        }
        if (
          state.groups
            .filter((group) => !group.disabled)
            .map((group) =>
              (group.hosts || []).map((host) => ({
                groupId: group.id,
                ...host
              }))
            )
            .reduce((carry, hosts) => carry.concat(hosts), [])
            .filter(
              (currentHost) =>
                !currentHost.disabled &&
                (currentHost.groupId !== group.id || currentHost.id !== host.id)
            )
            .some((currentHost) => currentHost.name === host.name)
        ) {
          errors.push(`'${host.name}' is duplicate entry.`)
        }
        return errors
      }
    }
  },
  actions: {
    createGroup({ commit, state }, { group }) {
      const id =
        Math.max.apply(null, [0, ...state.groups.map((group) => group.id)]) + 1
      const newGroup = {
        disabled: false,
        name: '',
        hosts: [],
        ...group,
        id
      }
      const groups = [...state.groups, newGroup]
      commit('setGroups', { groups })
      return newGroup
    },
    updateGroup({ commit, state }, { id, group }) {
      const groups = state.groups.map((currentGroup) => {
        if (currentGroup.id !== id) {
          return currentGroup
        }
        return {
          ...currentGroup,
          ...group
        }
      })
      commit('setGroups', { groups })
    },
    deleteGroup({ commit, state }, { id }) {
      const groups = state.groups.filter((group) => group.id !== id)
      commit('setGroups', { groups })
    },
    createHost({ dispatch, getters }, { groupId, host }) {
      const currentHosts = getters.getHosts({ groupId })
      const id =
        Math.max.apply(null, [0, ...currentHosts.map((host) => host.id)]) + 1
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
    updateHost({ dispatch, getters }, { groupId, id, host }) {
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
    deleteHost({ dispatch, getters }, { groupId, id }) {
      const hosts = getters
        .getHosts({ groupId })
        .filter((host) => host.id !== id)
      dispatch('setHosts', { groupId, hosts })
    },
    setHosts({ commit, state }, { groupId, hosts }) {
      const groups = state.groups.map((group) => {
        if (group.id !== groupId) {
          return group
        }
        return {
          ...group,
          hosts
        }
      })
      commit('setGroups', { groups })
    }
  },
  mutations: {
    setGroups(state, { groups }) {
      state.groups = groups
    }
  }
}
