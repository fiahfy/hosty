const reversed = {
  disabled: false,
  name: false,
  ip: false
}

export default {
  namespaced: true,
  state: {
    groups: []
  },
  actions: {
    createGroup ({ dispatch, state }, { group }) {
      const id = Math.max.apply(null, [0, ...state.groups.map((group) => group.id)]) + 1
      const groups = [
        ...state.groups,
        {
          disabled: false,
          name: '',
          hosts: [],
          ...group,
          id
        }
      ]
      dispatch('setGroups', { groups, save: true })
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
      dispatch('setGroups', { groups, save: true })
    },
    deleteGroup ({ dispatch, state }, { id }) {
      const groups = state.groups.filter((group) => group.id !== id)
      dispatch('setGroups', { groups, save: true })
    },
    sortGroups ({ dispatch, getters, state }, { order }) {
      const { by, descending } = order
      const groups = state.groups.sort((a, b) => {
        let result = 0
        if (a[by] > b[by]) {
          result = 1
        } else if (a[by] < b[by]) {
          result = -1
        }
        if (result === 0) {
          if (a.name > b.name) {
            result = 1
          } else if (a.name < b.name) {
            result = -1
          }
        }
        result = reversed[by] ? -1 * result : result
        return descending ? -1 * result : result
      })
      dispatch('setGroups', { groups })
    },
    createHost ({ dispatch, getters }, { groupId, host }) {
      const currentHosts = getters.getHosts({ groupId })
      const id = Math.max.apply(null, [0, ...currentHosts.map((host) => host.id)]) + 1
      const hosts = [
        ...currentHosts,
        {
          disabled: false,
          name: '',
          ip: '',
          ...host,
          id
        }
      ]
      dispatch('setHosts', { groupId, hosts, save: true })
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
      dispatch('setHosts', { groupId, hosts, save: true })
    },
    deleteHost ({ dispatch, getters }, { groupId, id }) {
      const hosts = getters.getHosts({ groupId }).filter((host) => host.id !== id)
      dispatch('setHosts', { groupId, hosts, save: true })
    },
    sortHosts ({ dispatch, getters, state }, { groupId, order }) {
      const { by, descending } = order
      const hosts = getters.getHosts({ groupId }).sort((a, b) => {
        let result = 0
        if (a[by] > b[by]) {
          result = 1
        } else if (a[by] < b[by]) {
          result = -1
        }
        if (result === 0) {
          if (a.name > b.name) {
            result = 1
          } else if (a.name < b.name) {
            result = -1
          }
        }
        result = reversed[by] ? -1 * result : result
        return descending ? -1 * result : result
      })
      dispatch('setHosts', { groupId, hosts, save: true })
    },
    setGroups ({ commit, dispatch }, { groups, save = true }) {
      commit('setGroups', { groups })
      if (save) {
        // dispatch('saveHosts', null, { root: true })
      }
    },
    setHosts ({ dispatch, state }, { groupId, hosts, save = true }) {
      const groups = state.groups.map((group) => {
        if (group.id !== groupId) {
          return group
        }
        return {
          ...group,
          hosts
        }
      })
      dispatch('setGroups', { groups, save })
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
    hosts (state) {
      return state.groups
        .filter((group) => !group.disabled)
        .map((group) => {
          return (group.hosts || []).map((host) => {
            return {
              ...host,
              groupId: group.id,
              hostId: host.id,
              id: `${group.id}-${host.id}`
            }
          })
        })
        .reduce((carry, hosts) => carry.concat(hosts), [])
        .filter((host) => !host.disabled && host.name && host.ip)
        .sort((a, b) => {
          let result = 0
          if (a.ip > b.ip) {
            result = 1
          } else if (a.ip < b.ip) {
            result = -1
          }
          if (result !== 0) {
            return result
          }
          if (a.disabled > b.disabled) {
            result = 1
          } else if (a.disabled < b.disabled) {
            result = -1
          }
          if (result !== 0) {
            return result
          }
          if (a.name > b.name) {
            result = 1
          } else if (a.name < b.name) {
            result = -1
          }
        })
    }
  }
}
