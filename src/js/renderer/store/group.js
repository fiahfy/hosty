export default {
  namespaced: true,
  state: {
    groups: []
  },
  actions: {
    createGroup ({ dispatch, state }, { group = { disabled: false, name: '', hosts: [] } }) {
      const id = Math.max.apply(null, [0, ...state.groups.map((group) => group.id)]) + 1
      const groups = [
        ...state.groups,
        {
          ...group,
          id
        }
      ]
      dispatch('setGroups', { groups, save: true })
    },
    updateGroup ({ dispatch, state }, { id, group = { disabled: false, name: '', hosts: [] } }) {
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
    sortGroups ({ dispatch, getters, state }, { key, order }) {
      const groups = state.groups.sort((a, b) => {
        let result = 0
        if (a[key] > b[key]) {
          result = 1
        } else if (a[key] < b[key]) {
          result = -1
        }
        if (result === 0) {
          if (a.name > b.name) {
            result = 1
          } else if (a.name < b.name) {
            result = -1
          }
        }
        return order === 'asc' ? result : -1 * result
      })
      dispatch('setGroups', { groups })
    },
    createHost ({ dispatch, state }, { groupId, host = { disabled: false, name: '', ip: '' } }) {
      const groups = state.groups.map((group) => {
        if (group.id !== groupId) {
          return group
        }
        const currentHosts = group.hosts || []
        const id = Math.max.apply(null, [0, ...currentHosts.map((host) => host.id)]) + 1
        return {
          ...group,
          hosts: [
            ...currentHosts,
            {
              ...host,
              id
            }
          ]
        }
      })
      dispatch('setGroups', { groups, save: true })
    },
    updateHost ({ dispatch, state }, { groupId, id, host = { disabled: false, name: '', ip: '' } }) {
      const groups = state.groups.map((group) => {
        if (group.id !== groupId) {
          return group
        }
        return {
          ...group,
          hosts: group.hosts.map((currentHost) => {
            if (currentHost.id !== id) {
              return currentHost
            }
            return {
              ...currentHost,
              ...host
            }
          })
        }
      })
      dispatch('setGroups', { groups, save: true })
    },
    deleteHost ({ dispatch, state }, { groupId, id }) {
      const groups = state.groups.map((group) => {
        if (group.id !== groupId) {
          return group
        }
        return {
          ...group,
          hosts: group.hosts.filter((host) => host.id !== id)
        }
      })
      dispatch('setGroups', { groups, save: true })
    },
    sortHosts ({ dispatch, getters, state }, { groupId, key, order }) {
      const groups = state.groups.map((group) => {
        if (group.id !== groupId) {
          return group
        }
        return {
          ...group,
          hosts: (group.hosts || []).sort((a, b) => {
            let result = 0
            if (a[key] > b[key]) {
              result = 1
            } else if (a[key] < b[key]) {
              result = -1
            }
            if (result === 0) {
              if (a.name > b.name) {
                result = 1
              } else if (a.name < b.name) {
                result = -1
              }
            }
            return order === 'asc' ? result : -1 * result
          })
        }
      })
      dispatch('setGroups', { groups })
    },
    setGroups ({ commit, dispatch }, { groups, save = true }) {
      commit('setGroups', { groups })
      if (save) {
        dispatch('saveHosts', null, { root: true })
      }
    }
  },
  mutations: {
    setGroups (state, { groups }) {
      state.groups = groups
    }
  },
  getters: {
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
