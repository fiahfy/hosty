const sortOrderDefaults = {
  status: 'asc',
  name: 'asc'
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
    create ({ dispatch, state }) {
      dispatch('group/createGroup', null, { root: true })
    },
    select ({ commit }, { id }) {
      commit('setSelectedId', { selectedId: id })
    },
    selectPrevious ({ commit, getters }) {
      const index = getters.selectedIndex - 1
      if (index < 0) {
        return
      }
      const selectedId = getters.groups[index].id
      commit('setSelectedId', { selectedId })
    },
    selectNext ({ commit, getters }) {
      const index = getters.selectedIndex + 1
      if (index > getters.groups.length - 1) {
        return
      }
      const selectedId = getters.groups[index].id
      commit('setSelectedId', { selectedId })
    },
    changeSortKey ({ commit, dispatch, state }, { sortKey }) {
      let sortOrder = sortOrderDefaults[sortKey]
      if (state.sortOption.key === sortKey) {
        sortOrder = state.sortOption.order === 'asc' ? 'desc' : 'asc'
      }
      const sortOption = { key: sortKey, order: sortOrder }
      commit('setSortOption', { sortOption })
      dispatch('group/sortGroups', sortOption, { root: true })
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
    groups (state, getters, rootState) {
      return rootState.group.groups
    },
    selectedGroup (state, getters) {
      return getters.groups.find((group) => getters.isSelected({ id: group.id }))
    },
    selectedIndex (state, getters) {
      return getters.groups.findIndex((group) => getters.isSelected({ id: group.id }))
    },
    isSelected (state) {
      return ({ id }) => state.selectedId === id
    }
  }
}
