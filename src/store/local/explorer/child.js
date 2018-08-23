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
      return rootState.local.explorer.selectedGroupId
    },
    selectedHostIndex (state, getters) {
      return state.hosts.findIndex((host) => getters.isSelectedHost({ id: host.id }))
    },
    selectedHost (state, getters) {
      return state.hosts[getters.selectedHostIndex]
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
    isSelectedHost (state) {
      return ({ id }) => state.selectedHostId === id
    },
    getHosts (state, getters, rootState, rootGetters) {
      return () => JSON.parse(JSON.stringify(rootGetters['group/getHosts']({ groupId: getters.selectedGroupId })))
    }
  },
  actions: {
    loadHosts ({ commit, dispatch, getters, state }) {
      const hosts = getters.getHosts().filter((host) => {
        return !state.filtered || !host.disabled
      })
      commit('setHosts', { hosts })
      commit('setScrollTop', { scrollTop: 0 })
      dispatch('sortHosts')
      dispatch('unselectHost')
    },
    async createHost ({ commit, dispatch, getters, state }, { host } = {}) {
      const newHost = await dispatch('group/createHost', { groupId: getters.selectedGroupId, host }, { root: true })
      commit('addHost', { host: newHost })
      dispatch('local/explorer/loadGroup', null, { root: true })
      const index = state.hosts.length - 1
      dispatch('selectHostIndex', { index })
      dispatch('focusTable')
    },
    deleteHost ({ commit, dispatch, getters, state }, { id }) {
      const oldIndex = state.hosts.findIndex((host) => host.id === id)
      dispatch('group/deleteHost', { groupId: getters.selectedGroupId, id }, { root: true })
      commit('removeHost', { id })
      dispatch('local/explorer/loadGroup', null, { root: true })
      const index = oldIndex < state.hosts.length ? oldIndex : state.hosts.length - 1
      dispatch('selectHostIndex', { index })
      dispatch('focusTable')
    },
    updateHost ({ commit, dispatch, getters }, { id, host }) {
      dispatch('group/updateHost', { groupId: getters.selectedGroupId, id, host }, { root: true })
      commit('updateHost', { id, host })
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
    copyHost ({ commit, state }, { id }) {
      const clippedHost = state.hosts.find((host) => host.id === id)
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
    selectHostIndex ({ dispatch, state }, { index }) {
      const host = state.hosts[index]
      if (host) {
        dispatch('selectHost', { id: host.id })
      } else {
        dispatch('unselectHost')
      }
    },
    selectFirstHost ({ dispatch, state }) {
      const index = 0
      if (index > -1 && index < state.hosts.length) {
        dispatch('selectHostIndex', { index })
      }
    },
    selectLastHost ({ dispatch, state }) {
      const index = state.hosts.length - 1
      if (index > -1 && index < state.hosts.length) {
        dispatch('selectHostIndex', { index })
      }
    },
    selectPreviousHost ({ dispatch, getters, state }) {
      const index = getters.selectedHostIndex - 1
      if (index > -1 && index < state.hosts.length) {
        dispatch('selectHostIndex', { index })
      }
    },
    selectNextHost ({ dispatch, getters, state }) {
      const index = getters.selectedHostIndex + 1
      if (index > -1 && index < state.hosts.length) {
        dispatch('selectHostIndex', { index })
      }
    },
    changeOrderBy ({ commit, dispatch, state }, { orderBy }) {
      const descending = state.order.by === orderBy ? !state.order.descending : false
      const order = { by: orderBy, descending }
      commit('setOrder', { order })
      dispatch('sortHosts')
    },
    toggleFiltered ({ dispatch, state }) {
      dispatch('setFiltered', { filtered: !state.filtered })
    },
    setFiltered ({ commit, dispatch }, { filtered }) {
      commit('setFiltered', { filtered })
      dispatch('loadHosts')
    },
    focusTable ({ dispatch }) {
      dispatch('focus', { selector: Selector.explorerChildTable }, { root: true })
    }
  },
  mutations: {
    setHosts (state, { hosts }) {
      state.hosts = hosts
    },
    addHost (state, { host }) {
      state.hosts = [...state.hosts, host]
    },
    updateHost (state, { id, host }) {
      state.hosts = state.hosts.map((current) => current.id !== id ? current : { ...current, ...host })
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
