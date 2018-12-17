import selector from '~/consts/selector'

export const state = () => ({
  selectedGroupId: 0,
  selectedHostId: 0,
  scrollTop: 0,
  order: {
    by: 'name',
    descending: false
  },
  filtered: false,
  clippedHost: null
})

export const getters = {
  selectedGroup(state, getters, rootState) {
    return rootState.group.groups.find(
      (group) => group.id === state.selectedGroupId
    )
  },
  hosts(state, getters) {
    if (!getters.selectedGroup) {
      return []
    }
    return getters.selectedGroup.hosts.filter((host) => {
      return !state.filtered || !host.disabled
    })
  },
  selectedHost(state, getters) {
    return getters.hosts.find((host) => host.id === state.selectedHostId)
  },
  selectedHostIndex(state, getters) {
    return getters.hosts.findIndex((host) => host.id === state.selectedHostId)
  },
  canCreateHost(state) {
    return !!state.selectedGroupId
  },
  canDeleteHost(state) {
    return !!state.selectedGroupId && !!state.selectedHostId
  },
  canPasteHost(state) {
    return !!state.clippedHost
  },
  getHost(state, getters) {
    return ({ id }) => getters.hosts.find((host) => host.id === id)
  },
  getHostIndex(state, getters) {
    return ({ id }) => getters.hosts.findIndex((host) => host.id === id)
  },
  isSelectedHost(state) {
    return ({ id }) => state.selectedHostId === id
  }
}

export const actions = {
  loadHosts({ commit, dispatch }) {
    commit('setScrollTop', { scrollTop: 0 })
    dispatch('unselectHost')
    dispatch('sortHosts')
  },
  createHost({ commit, dispatch, getters, state }, { host } = {}) {
    commit(
      'group/addHost',
      { groupId: state.selectedGroupId, host },
      { root: true }
    )
    const index = getters.hosts.length - 1
    dispatch('selectHostIndex', { index })
    dispatch('focusTable')
  },
  deleteHost({ commit, dispatch, getters, state }, { id }) {
    const oldIndex = getters.getHostIndex({ id })
    commit(
      'group/removeHost',
      { groupId: state.selectedGroupId, id },
      { root: true }
    )
    const index =
      oldIndex < getters.hosts.length ? oldIndex : getters.hosts.length - 1
    dispatch('selectHostIndex', { index })
    dispatch('focusTable')
  },
  updateHost({ commit, state }, { id, host }) {
    commit(
      'group/updateHost',
      { groupId: state.selectedGroupId, id, host },
      { root: true }
    )
  },
  sortHosts({ commit, state }) {
    commit(
      'group/sortHosts',
      { groupId: state.selectedGroupId, ...state.order },
      { root: true }
    )
  },
  copyHost({ commit, getters }, { id }) {
    const clippedHost = getters.getHost({ id })
    commit('setClippedHost', { clippedHost })
  },
  pasteHost({ dispatch, state }) {
    const host = state.clippedHost
    if (!host) {
      return
    }
    dispatch('createHost', { host })
  },
  selectHost({ commit }, { id }) {
    commit('setSelectedHostId', { selectedHostId: id })
  },
  unselectHost({ dispatch }) {
    dispatch('selectHost', { id: 0 })
  },
  selectHostIndex({ dispatch, getters }, { index }) {
    const host = getters.hosts[index]
    if (host) {
      dispatch('selectHost', { id: host.id })
    } else {
      dispatch('unselectHost')
    }
  },
  selectFirstHost({ dispatch, getters }) {
    const index = 0
    if (index > -1 && index < getters.hosts.length) {
      dispatch('selectHostIndex', { index })
    }
  },
  selectLastHost({ dispatch, getters }) {
    const index = getters.hosts.length - 1
    if (index > -1 && index < getters.hosts.length) {
      dispatch('selectHostIndex', { index })
    }
  },
  selectPreviousHost({ dispatch, getters }) {
    const index = getters.selectedHostIndex - 1
    if (index > -1 && index < getters.hosts.length) {
      dispatch('selectHostIndex', { index })
    }
  },
  selectNextHost({ dispatch, getters }) {
    const index = getters.selectedHostIndex + 1
    if (index > -1 && index < getters.hosts.length) {
      dispatch('selectHostIndex', { index })
    }
  },
  changeOrderBy({ commit, dispatch, state }, { orderBy }) {
    const descending =
      state.order.by === orderBy ? !state.order.descending : false
    const order = { by: orderBy, descending }
    commit('setOrder', { order })
    dispatch('sortHosts')
  },
  focusTable({ dispatch }) {
    dispatch('focus', { selector: selector.HOST_TABLE }, { root: true })
  }
}

export const mutations = {
  setSelectedGroupId(state, { selectedGroupId }) {
    state.selectedGroupId = selectedGroupId
  },
  setSelectedHostId(state, { selectedHostId }) {
    state.selectedHostId = selectedHostId
  },
  setScrollTop(state, { scrollTop }) {
    state.scrollTop = scrollTop
  },
  setOrder(state, { order }) {
    state.order = order
  },
  setFiltered(state, { filtered }) {
    state.filtered = filtered
  },
  toggleFiltered(state) {
    state.filtered = !state.filtered
  },
  setClippedHost(state, { clippedHost }) {
    state.clippedHost = clippedHost
  }
}
