const sortOrderDefaults = {
  status: 'asc',
  name: 'asc'
}

export default {
  namespaced: true,
  state: {
    groups: [],
    selectedGroupId: 0,
    groupScrollTop: 0,
    groupSortOption: {
      key: 'name',
      order: 'asc'
    }
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
    selectGroup ({ commit }, { id }) {
      commit('setSelectedGroupId', { selectedGroupId: id })
    },
    selectPreviousGroup ({ commit, getters, state }) {
      const index = getters.selectedIndex - 1
      if (index < 0) {
        return
      }
      const selectedGroupId = state.groups[index].id
      commit('setSelectedGroupId', { selectedGroupId })
    },
    selectNextGroup ({ commit, getters, state }) {
      const index = getters.selectedIndex + 1
      if (index > state.groups.length - 1) {
        return
      }
      const selectedGroupId = state.groups[index].id
      commit('setSelectedGroupId', { selectedGroupId })
    },
    changeGroupSortKey ({ commit, dispatch, state }, { sortKey }) {
      let sortOrder = sortOrderDefaults[sortKey]
      if (state.groupSortOption.key === sortKey) {
        sortOrder = state.groupSortOption.order === 'asc' ? 'desc' : 'asc'
      }
      const groupSortOption = { key: sortKey, order: sortOrder }
      commit('setGroupSortOption', { groupSortOption })
      dispatch('sortGroups')
    },
    sortGroups ({ commit, getters, state }) {
      const groups = state.groups.sort((a, b) => {
        let result = 0
        switch (state.groupSortOption.key) {
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
        return state.groupSortOption.order === 'asc' ? result : -1 * result
      })
      commit('setGroups', { groups })
    }
  },
  mutations: {
    setGroups (state, { groups }) {
      state.groups = groups
    },
    setSelectedGroupId (state, { selectedGroupId }) {
      state.selectedGroupId = selectedGroupId
    },
    setGroupScrollTop (state, { groupScrollTop }) {
      state.groupScrollTop = groupScrollTop
    },
    setGroupSortOption (state, { groupSortOption }) {
      state.groupSortOption = groupSortOption
    }
  },
  getters: {
    selectedIndex (state, getters) {
      return state.groups.findIndex((group) => {
        return getters.isSelectedGroup({ id: group.id })
      })
    },
    isSelectedGroup (state) {
      return ({ id }) => {
        return state.selectedGroupId === id
      }
    }
  }
}
