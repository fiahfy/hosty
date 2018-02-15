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
          name: ''
        }
      ]
      commit('setGroups', { groups })
    },
    sortGroups ({ commit, getters, state }, { key, order }) {
      const groups = state.groups.sort((a, b) => {
        let result = 0
        switch (key) {
          case 'status':
            if (a.status > b.status) {
              result = 1
            } else if (a.status < b.status) {
              result = -1
            }
            break
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
              name: ''
            }
          ]
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
