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
    createGroup ({ dispatch, state }) {
      const id = Math.max.apply(null, [0, ...state.groups.map((group) => group.id)]) + 1
      const groups = [
        ...state.groups,
        {
          id,
          disabled: false,
          name: ''
        }
      ]
      dispatch('syncGroups', { groups })
    },
    updateGroup ({ dispatch, state }, { id, params }) {
      const groups = state.groups.map((group) => {
        if (group.id !== id) {
          return group
        }
        return {
          ...group,
          ...params
        }
      })
      dispatch('syncGroups', { groups })
    },
    deleteGroup ({ dispatch, state }, { id }) {
      const groups = state.groups.filter((group) => group.id !== id)
      dispatch('syncGroups', { groups })
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
      dispatch('syncGroups', { groups })
    },
    createHost ({ dispatch, state }, { groupId }) {
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
              id,
              disabled: false,
              name: '',
              ip: ''
            }
          ]
        }
      })
      dispatch('syncGroups', { groups })
    },
    updateHost ({ dispatch, state }, { groupId, id, params }) {
      const groups = state.groups.map((group) => {
        if (group.id !== groupId) {
          return group
        }
        return {
          ...group,
          hosts: group.hosts.map((host) => {
            if (host.id !== id) {
              return host
            }
            return {
              ...host,
              ...params
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
      dispatch('syncGroups', { groups })
    }
  },
  mutations: {
    setGroups (state, { groups }) {
      state.groups = groups
    }
  },
  getters: {
  }
}
