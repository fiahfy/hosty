export default {
  namespaced: true,
  state: {
    groups: []
  },
  actions: {
    syncGroups ({ commit, dispatch }, { groups }) {
      commit('setGroups', { groups })
      dispatch('syncHosts', null, { root: true })
    },
    createGroup ({ dispatch, state }, { group = { disabled: false, name: '', hosts: [] } }) {
      const id = Math.max.apply(null, [0, ...state.groups.map((group) => group.id)]) + 1
      const groups = [
        ...state.groups,
        {
          ...group,
          id
        }
      ]
      dispatch('syncGroups', { groups })
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
      dispatch('syncGroups', { groups })
    },
    deleteGroup ({ dispatch, state }, { id }) {
      const groups = state.groups.filter((group) => group.id !== id)
      dispatch('syncGroups', { groups })
    },
    sortGroups ({ commit, getters, state }, { key, order }) {
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
      commit('setGroups', { groups })
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
      dispatch('syncGroups', { groups })
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
      dispatch('syncGroups', { groups })
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
      dispatch('syncGroups', { groups })
    },
    sortHosts ({ commit, getters, state }, { groupId, key, order }) {
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
      commit('setGroups', { groups })
    }
  },
  mutations: {
    setGroups (state, { groups }) {
      state.groups = groups
    }
  }
}
