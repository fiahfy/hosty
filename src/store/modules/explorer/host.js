import { Selector } from '../index'

export default {
  namespaced: true,
  state: {
    selectedId: 0,
    scrollTop: 0,
    order: {
      by: 'name',
      descending: false
    },
    filtered: false,
    copiedObject: null
  },
  actions: {
    create ({ dispatch, getters }, { host } = {}) {
      dispatch('group/createHost', { groupId: getters.selectedGroupId, host }, { root: true })
      const index = getters.hosts.length - 1
      dispatch('selectIndex', { index })
      dispatch('focusTable')
    },
    delete ({ dispatch, getters, state }) {
      const oldSelectedIndex = getters.selectedIndex
      dispatch('group/deleteHost', { groupId: getters.selectedGroupId, id: state.selectedId }, { root: true })
      const index = oldSelectedIndex > 0 && oldSelectedIndex > getters.hosts.length - 1 ? oldSelectedIndex - 1 : oldSelectedIndex
      dispatch('selectIndex', { index })
      dispatch('focusTable')
    },
    update ({ dispatch, getters }, { id, host }) {
      dispatch('group/updateHost', { groupId: getters.selectedGroupId, id, host }, { root: true })
    },
    sort ({ dispatch, getters, state }) {
      dispatch('group/sortHosts', { groupId: getters.selectedGroupId, order: state.order }, { root: true })
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
      dispatch('selectIndex', { index: getters.selectedIndex - 1 })
    },
    selectNext ({ dispatch, getters }) {
      dispatch('selectIndex', { index: getters.selectedIndex + 1 })
    },
    // toggleFilter ({ commit, state }) {
    //   commit('setFiltered', { filtered: !state.filtered })
    // },
    changeOrderBy ({ commit, dispatch, state }, { orderBy }) {
      const descending = state.order.by === orderBy ? !state.order.descending : false
      const order = { by: orderBy, descending }
      commit('setOrder', { order })
      dispatch('sort')
    },
    focusTable ({ dispatch }) {
      dispatch('app/focus', { selector: Selector.explorerHostTable }, { root: true })
    }
    // enterList ({ dispatch, state }) {
    //   if (!state.selectedId) {
    //     dispatch('selectFirst')
    //   }
    //   dispatch('focusHostList', null, { root: true })
    // },
    // leaveList ({ dispatch }) {
    //   dispatch('focusGroupList', null, { root: true })
    // }
  },
  mutations: {
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
    setCopiedObject (state, { copiedObject }) {
      state.copiedObject = copiedObject
    }
  },
  getters: {
    hosts (state, getters) {
      if (!getters.selectedGroup) {
        return []
      }
      return (getters.selectedGroup.hosts || []).filter((host) => {
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
    selectedGroup (state, getters, rootState, rootGetters) {
      return rootGetters['app/explorer/group/selectedGroup']
    },
    selectedGroupId (state, getters, rootState) {
      return getters.selectedGroup ? getters.selectedGroup.id : 0
    },
    canCreate (state, getters) {
      return !!getters.selectedGroupId
    },
    canDelete (state, getters) {
      return !!getters.selectedGroupId && !!state.selectedId
    },
    canPaste (state) {
      return !!state.copiedObject
    }
  }
}
