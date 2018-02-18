const sortOrderDefaults = {
  disabled: 'asc',
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
    create ({ dispatch, getters }) {
      dispatch('group/createGroup', null, { root: true })
      const index = getters.groups.length - 1
      dispatch('selectIndex', { index })
    },
    delete ({ dispatch, getters, state }) {
      const oldSelectedIndex = getters.selectedIndex
      dispatch('group/deleteGroup', { id: state.selectedId }, { root: true })
      const index = oldSelectedIndex > 0 && oldSelectedIndex > getters.groups.length - 1 ? oldSelectedIndex - 1 : oldSelectedIndex
      dispatch('selectIndex', { index })
    },
    select ({ commit, dispatch }, { id }) {
      commit('setSelectedId', { selectedId: id })
      dispatch('explorer/host/sort', null, { root: true })
      dispatch('explorer/host/unselect', null, { root: true })
    },
    unselect ({ commit }) {
      commit('setSelectedId', { selectedId: 0 })
    },
    selectIndex ({ dispatch, getters }, { index }) {
      const id = getters.groups[index] ? getters.groups[index].id : 0
      dispatch('select', { id })
    },
    selectPrevious ({ dispatch, getters }) {
      const index = getters.selectedIndex - 1
      if (index < 0) {
        return
      }
      dispatch('selectIndex', { index })
    },
    selectNext ({ dispatch, getters }) {
      const index = getters.selectedIndex + 1
      if (index > getters.groups.length - 1) {
        return
      }
      dispatch('selectIndex', { index })
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
    isSelected (state) {
      return ({ id }) => state.selectedId === id
    },
    selectedIndex (state, getters) {
      return getters.groups.findIndex((group) => getters.isSelected({ id: group.id }))
    },
    selectedGroup (state, getters) {
      return getters.groups.find((group) => getters.isSelected({ id: group.id }))
    }
  }
}
