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
    create ({ dispatch, getters }) {
      dispatch('group/createHost', { groupId: getters.selectedGroupId }, { root: true })
      const index = getters.hosts.length - 1
      dispatch('selectIndex', { index })
      dispatch('focusList')
    },
    delete ({ dispatch, getters, state }) {
      const oldSelectedIndex = getters.selectedIndex
      dispatch('group/deleteHost', { groupId: getters.selectedGroupId, id: state.selectedId }, { root: true })
      const index = oldSelectedIndex > 0 && oldSelectedIndex > getters.hosts.length - 1 ? oldSelectedIndex - 1 : oldSelectedIndex
      dispatch('selectIndex', { index })
      dispatch('focusList')
    },
    select ({ commit }, { id }) {
      commit('setSelectedId', { selectedId: id })
    },
    unselect ({ commit }) {
      commit('setSelectedId', { selectedId: 0 })
    },
    selectIndex ({ dispatch, getters }, { index }) {
      const id = getters.hosts[index] ? getters.hosts[index].id : 0
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
      if (index > getters.hosts.length - 1) {
        return
      }
      dispatch('selectIndex', { index })
    },
    changeSortKey ({ commit, dispatch, getters, state }, { sortKey }) {
      let sortOrder = sortOrderDefaults[sortKey]
      if (state.sortOption.key === sortKey) {
        sortOrder = state.sortOption.order === 'asc' ? 'desc' : 'asc'
      }
      const sortOption = { key: sortKey, order: sortOrder }
      commit('setSortOption', { sortOption })
      dispatch('group/sortHosts', { groupId: getters.selectedGroupId, ...sortOption }, { root: true })
    },
    focusList ({ dispatch }) {
      dispatch('focusHostList', null, { root: true })
    },
    enterHostList ({ dispatch, state }) {
      if (!state.selectedId) {
        dispatch('selectIndex', { index: 0 })
      }
      dispatch('focusHostList', null, { root: true })
    },
    leaveHostList ({ dispatch }) {
      dispatch('focusGroupList', null, { root: true })
    },
    sort ({ dispatch, getters, state }) {
      dispatch('group/sortHosts', { groupId: getters.selectedGroupId, ...state.sortOption }, { root: true })
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
    isSelected (state) {
      return ({ id }) => state.selectedId === id
    },
    selectedIndex (state, getters) {
      return getters.hosts.findIndex((host) => getters.isSelected({ id: host.id }))
    },
    selectedGroupId (state, getters, rootState, rootGetters) {
      const selectedGroup = rootGetters['explorer/group/selectedGroup']
      return selectedGroup ? selectedGroup.id : 0
    }
  }
}
