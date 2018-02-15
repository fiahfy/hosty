export default {
  namespaced: true,
  state: {
    groups: []
  },
  actions: {
    createGroup ({ commit, state }) {
      const id = Math.max.apply(null, [0, ...state.groups.map((group) => group.id)]) + 1
      const groups = [
        ...state.groups,
        {
          id,
          disabled: false,
          name: ''
        }
      ]
      commit('setGroups', { groups })
    },
    updateGroup ({ commit, state }, { id, params }) {
      const groups = state.groups.map((group) => {
        if (group.id !== id) {
          return group
        }
        return {
          ...group,
          ...params
        }
      })
      commit('setGroups', { groups })
    },
    deleteGroup ({ commit, state }, { id }) {
      const groups = state.groups.filter((group) => group.id !== id)
      commit('setGroups', { groups })
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
    createHost ({ commit, state }, { groupId }) {
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
      commit('setGroups', { groups })
    },
    updateHost ({ commit, state }, { groupId, id, params }) {
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
      commit('setGroups', { groups })
    },
    deleteHost ({ commit, state }, { groupId, id }) {
      const groups = state.groups.map((group) => {
        if (group.id !== groupId) {
          return group
        }
        return {
          ...group,
          hosts: group.hosts.filter((host) => host.id !== id)
        }
      })
      commit('setGroups', { groups })
    },
    sortHosts ({ commit, getters, state }, { groupId, key, order }) {
      const groups = state.groups.map((group) => {
        if (group.id !== groupId) {
          return group
        }
        return {
          ...group,
          hosts: group.hosts.sort((a, b) => {
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
  },
  getters: {
  }
}
