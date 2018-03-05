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
      key: 'ip',
      order: 'asc'
    },
    filtered: false,
    copiedObject: null
  },
  actions: {
    create ({ dispatch, getters }, { host } = {}) {
      dispatch('group/createHost', { groupId: getters.selectedGroupId, host }, { root: true })
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
    sort ({ dispatch, getters, state }) {
      dispatch('group/sortHosts', { groupId: getters.selectedGroupId, ...state.sortOption }, { root: true })
    },
    copy ({ commit, getters }) {
      const copiedObject = getters.selectedHost
      commit('setCopiedObject', { copiedObject })
    },
    paste ({ dispatch, state }) {
      const host = state.copiedObject
      if (!host) {
        return
      }
      dispatch('create', { host })
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
    selectFirst ({ dispatch }) {
      dispatch('selectIndex', { index: 0 })
    },
    selectLast ({ dispatch, getters }) {
      dispatch('selectIndex', { index: getters.hosts.length - 1 })
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
    toggleFilter ({ commit, state }) {
      commit('setFiltered', { filtered: !state.filtered })
    },
    changeSortKey ({ commit, dispatch, getters, state }, { sortKey }) {
      let sortOrder = sortOrderDefaults[sortKey]
      if (state.sortOption.key === sortKey) {
        sortOrder = state.sortOption.order === 'asc' ? 'desc' : 'asc'
      }
      const sortOption = { key: sortKey, order: sortOrder }
      commit('setSortOption', { sortOption })
      dispatch('sort')
    },
    focusList ({ dispatch }) {
      dispatch('focusHostList', null, { root: true })
    },
    enterList ({ dispatch, state }) {
      if (!state.selectedId) {
        dispatch('selectFirst')
      }
      dispatch('focusHostList', null, { root: true })
    },
    leaveList ({ dispatch }) {
      dispatch('focusGroupList', null, { root: true })
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
    },
    setFiltered (state, { filtered }) {
      state.filtered = filtered
    },
    setCopiedObject (state, { copiedObject }) {
      state.copiedObject = copiedObject
    }
  },
  getters: {
    hosts (state, getters, rootState, rootGetters) {
      const selectedGroup = rootGetters['explorer/group/selectedGroup']
      if (!selectedGroup) {
        return []
      }
      return (selectedGroup.hosts || []).filter((host) => {
        return !state.filtered || !host.disabled
      })
    },
    isSelected (state) {
      return ({ id }) => state.selectedId === id
    },
    selectedIndex (state, getters) {
      return getters.hosts.findIndex((host) => getters.isSelected({ id: host.id }))
    },
    selectedHost (state, getters) {
      return getters.hosts.find((host) => getters.isSelected({ id: host.id }))
    },
    selectedGroupId (state, getters, rootState, rootGetters) {
      const selectedGroup = rootGetters['explorer/group/selectedGroup']
      return selectedGroup ? selectedGroup.id : 0
    },
    canCreate (state, getters) {
      return !!getters.selectedGroupId
    },
    canDelete (state, getters) {
      return !!getters.selectedGroupId && !!state.selectedId
    }
  }
}
