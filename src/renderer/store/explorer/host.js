const sortOrderDefaults = {
  disabled: 'asc',
  name: 'asc',
  ip: 'asc'
}

export default {
  namespaced: true,
  state: {
    selectedId: 0,
    scrollTop: 0,
    sortOption: {
      key: 'name',
      order: 'asc'
    }
  },
  actions: {
    create ({ dispatch, rootState }) {
      dispatch('group/createHost', { groupId: rootState.explorer.group.selectedId }, { root: true })
    },
    delete ({ dispatch, rootState, state }) {
      dispatch('group/deleteHost', { groupId: rootState.explorer.group.selectedId, id: state.selectedId }, { root: true })
    },
    select ({ commit }, { id }) {
      commit('setSelectedId', { selectedId: id })
    },
    selectPrevious ({ commit, getters }) {
      const index = getters.selectedIndex - 1
      if (index < 0) {
        return
      }
      const selectedId = getters.hosts[index].id
      commit('setSelectedId', { selectedId })
    },
    selectNext ({ commit, getters }) {
      const index = getters.selectedIndex + 1
      if (index > getters.hosts.length - 1) {
        return
      }
      const selectedId = getters.hosts[index].id
      commit('setSelectedId', { selectedId })
    },
    changeSortKey ({ commit, dispatch, rootState, state }, { sortKey }) {
      let sortOrder = sortOrderDefaults[sortKey]
      if (state.sortOption.key === sortKey) {
        sortOrder = state.sortOption.order === 'asc' ? 'desc' : 'asc'
      }
      const sortOption = { key: sortKey, order: sortOrder }
      commit('setSortOption', { sortOption })
      dispatch('group/sortHosts', { groupId: rootState.explorer.group.selectedId, ...sortOption }, { root: true })
    }
  },
  mutations: {
    setSelectedId (state, { selectedId }) {
      state.selectedId = selectedId
    },
    setScrollTop (state, { scrollTop }) {
      state.scrollTop = scrollTop
    },
    setSortOption (state, { sortOption }) {
      state.sortOption = sortOption
    }
  },
  getters: {
    hosts (state, getters, rootState, rootGetters) {
      const selectedGroup = rootGetters['explorer/group/selectedGroup']
      if (!selectedGroup) {
        return []
      }
      return selectedGroup.hosts || []
    },
    selectedGroup (state, getters) {
      return getters.hosts.find((host) => getters.isSelected({ id: host.id }))
    },
    selectedIndex (state, getters) {
      return getters.hosts.findIndex((host) => getters.isSelected({ id: host.id }))
    },
    isSelected (state) {
      return ({ id }) => state.selectedId === id
    }
  }
}
