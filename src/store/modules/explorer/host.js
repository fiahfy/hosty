import { Selector } from '../index'

const reversed = {
  disabled: false,
  name: false,
  ip: false
}

export default {
  namespaced: true,
  state: {
    hosts: [],
    selectedId: 0,
    scrollTop: 0,
    order: {
      by: 'name',
      descending: false
    },
    filtered: false,
    clip: null
  },
  actions: {
    load ({ commit, dispatch, getters, rootGetters }) {
      const hosts = JSON.parse(JSON.stringify(rootGetters['group/getHosts']({ groupId: getters.selectedGroupId })))
      commit('setHosts', { hosts })
      dispatch('sort')
    },
    async create ({ commit, dispatch, getters }, { host } = {}) {
      const newHost = await dispatch('group/createHost', { groupId: getters.selectedGroupId, host }, { root: true })
      commit('addHost', { host: newHost })
      const index = getters.filteredHosts.length - 1
      dispatch('selectIndex', { index })
      dispatch('focusTable')
    },
    delete ({ commit, dispatch, getters, state }) {
      const oldSelectedIndex = getters.selectedIndex
      dispatch('group/deleteHost', { groupId: getters.selectedGroupId, id: state.selectedId }, { root: true })
      commit('removeHost', { id: state.selectedId })
      const index = oldSelectedIndex > 0 && oldSelectedIndex > getters.filteredHosts.length - 1 ? oldSelectedIndex - 1 : oldSelectedIndex
      dispatch('selectIndex', { index })
      dispatch('focusTable')
    },
    update ({ commit, dispatch, getters, state }, { host }) {
      dispatch('group/updateHost', { groupId: getters.selectedGroupId, id: state.selectedId, host }, { root: true })
      commit('setHost', { id: state.selectedId, host })
    },
    sort ({ commit, state }) {
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
    copy ({ commit, getters }) {
      const clip = getters.selectedHost
      commit('setClip', { clip })
    },
    paste ({ dispatch, state }) {
      const host = state.clip
      if (!host) {
        return
      }
      dispatch('create', { host })
    },
    select ({ commit }, { id }) {
      commit('setSelectedId', { selectedId: id })
    },
    unselect ({ dispatch }) {
      dispatch('select', { id: 0 })
    },
    selectIndex ({ dispatch, getters }, { index }) {
      const host = getters.filteredHosts[index]
      if (host) {
        dispatch('select', { id: host.id })
      }
    },
    selectFirst ({ dispatch }) {
      dispatch('selectIndex', { index: 0 })
    },
    selectLast ({ dispatch, getters }) {
      dispatch('selectIndex', { index: getters.filteredHosts.length - 1 })
    },
    selectPrevious ({ dispatch, getters }) {
      dispatch('selectIndex', { index: getters.selectedIndex - 1 })
    },
    selectNext ({ dispatch, getters }) {
      dispatch('selectIndex', { index: getters.selectedIndex + 1 })
    },
    changeOrderBy ({ commit, dispatch, state }, { orderBy }) {
      const descending = state.order.by === orderBy ? !state.order.descending : false
      const order = { by: orderBy, descending }
      commit('setOrder', { order })
      dispatch('sort')
    },
    toggleFilter ({ commit, state }) {
      commit('setFiltered', { filtered: !state.filtered })
    },
    focusTable ({ dispatch }) {
      dispatch('app/focus', { selector: Selector.explorerHostTable }, { root: true })
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
    setSelectedId (state, { selectedId }) {
      state.selectedId = selectedId
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
    setClip (state, { clip }) {
      state.clip = clip
    }
  },
  getters: {
    filteredHosts (state) {
      return state.hosts.filter((host) => {
        return !state.filtered || !host.disabled
      })
    },
    isSelected (state) {
      return ({ id }) => state.selectedId === id
    },
    selectedIndex (state, getters) {
      return getters.filteredHosts.findIndex((host) => getters.isSelected({ id: host.id }))
    },
    selectedHost (state, getters) {
      return getters.filteredHosts.find((host) => getters.isSelected({ id: host.id }))
    },
    selectedGroup (state, getters, rootState, rootGetters) {
      return rootGetters['app/explorer/group/selectedGroup']
    },
    selectedGroupId (state, getters) {
      return getters.selectedGroup ? getters.selectedGroup.id : 0
    },
    canCreate (state, getters) {
      return !!getters.selectedGroupId
    },
    canDelete (state, getters) {
      return !!getters.selectedGroupId && !!state.selectedId
    },
    canPaste (state) {
      return !!state.clip
    }
  }
}
