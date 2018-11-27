import { Selector } from '~/store'

export default {
  namespaced: true,
  state: {
    selectedHostId: 0,
    scrollTop: 0,
    order: {
      by: 'name',
      descending: false
    },
    filtered: false,
    clippedHost: null
  },
  getters: {
    hosts(state, getters, rootState) {
      if (!getters.selectedGroupId) {
        return []
      }
      return rootState.group.groups
        .find((group) => group.id === getters.selectedGroupId)
        .hosts.filter((host) => {
          return !state.filtered || !host.disabled
        })
    },
    selectedGroupId(state, getters, rootState) {
      return rootState.local.explorer.selectedGroupId
    },
    selectedGroup(state, getters, rootState, rootGetters) {
      return rootGetters['local/explorer/selectedGroup']
    },
    selectedHostIndex(state, getters) {
      return getters.getHostIndex({ id: state.selectedHostId })
    },
    selectedHost(state, getters) {
      return getters.getHost({ id: state.selectedHostId })
    },
    canCreateHost(state, getters) {
      return !!getters.selectedGroupId
    },
    canDeleteHost(state, getters) {
      return !!getters.selectedGroupId && !!state.selectedHostId
    },
    canPasteHost(state) {
      return !!state.clippedHost
    },
    getHostIndex(state, getters) {
      return ({ id }) => getters.hosts.findIndex((host) => host.id === id)
    },
    getHost(state, getters) {
      return ({ id }) => getters.hosts[getters.getHostIndex({ id })]
    },
    isSelectedHost(state) {
      return ({ id }) => state.selectedHostId === id
    }
  },
  actions: {
    loadHosts({ commit, dispatch }) {
      commit('setScrollTop', { scrollTop: 0 })
      dispatch('unselectHost')
      dispatch('sortHosts')
    },
    createHost({ commit, dispatch, getters }, { host } = {}) {
      commit(
        'group/addHost',
        { groupId: getters.selectedGroupId, host },
        { root: true }
      )
      const index = getters.hosts.length - 1
      dispatch('selectHostIndex', { index })
      dispatch('focusTable')
    },
    deleteHost({ commit, dispatch, getters }, { id }) {
      const oldIndex = getters.getHostIndex({ id })
      commit(
        'group/removeHost',
        { groupId: getters.selectedGroupId, id },
        { root: true }
      )
      const index =
        oldIndex < getters.hosts.length ? oldIndex : getters.hosts.length - 1
      dispatch('selectHostIndex', { index })
      dispatch('focusTable')
    },
    updateHost({ commit, getters }, { id, host }) {
      commit(
        'group/updateHost',
        { groupId: getters.selectedGroupId, id, host },
        { root: true }
      )
    },
    sortHosts({ commit, getters, state }) {
      commit(
        'group/sortHosts',
        { groupId: getters.selectedGroupId, ...state.order },
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
    toggleFiltered({ commit, dispatch, state }) {
      dispatch('unselectHost')
      commit('setFiltered', { filtered: !state.filtered })
    },
    focusTable({ dispatch }) {
      dispatch(
        'focus',
        { selector: Selector.explorerChildTable },
        { root: true }
      )
    }
  },
  mutations: {
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
}
