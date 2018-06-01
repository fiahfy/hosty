import { Selector } from '~/store'

const reversed = {
  disabled: false,
  name: false,
  ip: false
}

export default {
  namespaced: true,
  state: {
    hosts: [],
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
    selectedGroupId (state, getters, rootState) {
      return rootState.explorer.selectedGroupId
    },
    selectedHostIndex (state, getters) {
      return getters.filteredHosts.findIndex((host) => getters.isSelectedHost({ id: host.id }))
    },
    selectedHost (state, getters) {
      return getters.filteredHosts[getters.selectedHostIndex]
    },
    canCreateHost (state, getters) {
      return !!getters.selectedGroupId
    },
    canDeleteHost (state, getters) {
      return !!getters.selectedGroupId && !!state.selectedHostId
    },
    canPasteHost (state) {
      return !!state.clippedHost
    },
    filteredHosts (state) {
      return state.hosts.filter((host) => {
        return !state.filtered || !host.disabled
      })
    },
    isSelectedHost (state) {
      return ({ id }) => state.selectedHostId === id
    }
  },
  actions: {
    loadHosts ({ commit, dispatch, getters, rootGetters }) {
      const hosts = JSON.parse(JSON.stringify(rootGetters['group/getHosts']({ groupId: getters.selectedGroupId })))
      commit('setHosts', { hosts })
      commit('setScrollTop', { scrollTop: 0 })
      dispatch('sortHosts')
      dispatch('unselectHost')
    },
    async createHost ({ commit, dispatch, getters }, { host } = {}) {
      const newHost = await dispatch('group/createHost', { groupId: getters.selectedGroupId, host }, { root: true })
      commit('addHost', { host: newHost })
      const index = getters.filteredHosts.length - 1
      dispatch('selectHostIndex', { index })
      dispatch('focusTable')
    },
    deleteHost ({ commit, dispatch, getters, state }) {
      const oldIndex = getters.selectedHostIndex
      dispatch('group/deleteHost', { groupId: getters.selectedGroupId, id: state.selectedHostId }, { root: true })
      commit('removeHost', { id: state.selectedHostId })
      const index = oldIndex > 0 && oldIndex > getters.filteredHosts.length - 1 ? oldIndex - 1 : oldIndex
      dispatch('selectHostIndex', { index })
      dispatch('focusTable')
    },
    updateHost ({ commit, dispatch, getters, state }, { host }) {
      dispatch('group/updateHost', { groupId: getters.selectedGroupId, id: state.selectedHostId, host }, { root: true })
      commit('setHost', { id: state.selectedHostId, host })
    },
    sortHosts ({ commit, state }) {
      const { by, descending } = state.order
      const hosts = state.hosts.sort((a, b) => {
        let result = 0
        if (a[by] > b[by]) {
          result = 1
        } else if (a[by] < b[by]) {
          result = -1
        }
        if (result === 0) {
          if (a.name > b.name) {
            result = 1
          } else if (a.name < b.name) {
            result = -1
          }
        }
        result = reversed[by] ? -1 * result : result
        return descending ? -1 * result : result
      })
      commit('setHosts', { hosts })
    },
    copyHost ({ commit, getters }) {
      const clippedHost = getters.selectedHost
      commit('setClippedHost', { clippedHost })
    },
    pasteHost ({ dispatch, state }) {
      const host = state.clippedHost
      if (!host) {
        return
      }
      dispatch('createHost', { host })
    },
    selectHost ({ commit }, { id }) {
      commit('setSelectedHostId', { selectedHostId: id })
    },
    unselectHost ({ dispatch }) {
      dispatch('selectHost', { id: 0 })
    },
    selectHostIndex ({ dispatch, getters }, { index }) {
      const host = getters.filteredHosts[index]
      if (host) {
        dispatch('selectHost', { id: host.id })
      }
    },
    selectFirstHost ({ dispatch }) {
      dispatch('selectHostIndex', { index: 0 })
    },
    selectLastHost ({ dispatch, getters }) {
      dispatch('selectHostIndex', { index: getters.filteredHosts.length - 1 })
    },
    selectPreviousHost ({ dispatch, getters }) {
      dispatch('selectHostIndex', { index: getters.selectedHostIndex - 1 })
    },
    selectNextHost ({ dispatch, getters }) {
      dispatch('selectHostIndex', { index: getters.selectedHostIndex + 1 })
    },
    changeOrderBy ({ commit, dispatch, state }, { orderBy }) {
      const descending = state.order.by === orderBy ? !state.order.descending : false
      const order = { by: orderBy, descending }
      commit('setOrder', { order })
      dispatch('sortHosts')
    },
    toggleFilter ({ commit, state }) {
      commit('setFiltered', { filtered: !state.filtered })
    },
    focusTable ({ dispatch }) {
      dispatch('focus', { selector: Selector.explorerChildTable }, { root: true })
    }
  },
  mutations: {
    setHosts (state, { hosts }) {
      state.hosts = hosts
    },
    setHost (state, { id, host }) {
      state.hosts = state.hosts.map((current) => current.id !== id ? current : { ...current, ...host })
    },
    addHost (state, { host }) {
      state.hosts = [...state.hosts, host]
    },
    removeHost (state, { id }) {
      state.hosts = state.hosts.filter((host) => host.id !== id)
    },
    setSelectedHostId (state, { selectedHostId }) {
      state.selectedHostId = selectedHostId
    },
    setScrollTop (state, { scrollTop }) {
      state.scrollTop = scrollTop
    },
    setOrder (state, { order }) {
      state.order = order
    },
    setFiltered (state, { filtered }) {
      state.filtered = filtered
    },
    setClippedHost (state, { clippedHost }) {
      state.clippedHost = clippedHost
    }
  }
}
