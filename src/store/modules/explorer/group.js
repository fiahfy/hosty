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
    create ({ dispatch, getters }, { group } = {}) {
      dispatch('group/createGroup', { group }, { root: true })
      const index = getters.groups.length - 1
      dispatch('selectIndex', { index })
      dispatch('focusTable')
    },
    delete ({ dispatch, getters, state }) {
      const oldSelectedIndex = getters.selectedIndex
      dispatch('group/deleteGroup', { id: state.selectedId }, { root: true })
      const index = oldSelectedIndex > 0 && oldSelectedIndex > getters.groups.length - 1 ? oldSelectedIndex - 1 : oldSelectedIndex
      dispatch('selectIndex', { index })
      dispatch('focusTable')
    },
    update ({ dispatch }, { id, group }) {
      dispatch('group/updateGroup', { id, group }, { root: true })
    },
    sort ({ dispatch, state }) {
      dispatch('group/sortGroups', { order: state.order }, { root: true })
    },
    copy ({ commit, getters }) {
      const copiedObject = getters.selectedGroup
      commit('setCopiedObject', { copiedObject })
    },
    paste ({ dispatch, state }) {
      const group = state.copiedObject
      if (!group) {
        return
      }
      dispatch('create', { group })
    },
    select ({ commit, dispatch, getters }, { id }) {
      commit('setSelectedId', { selectedId: id })
      // dispatch('explorer/host/sort', null, { root: true })
      // dispatch('explorer/host/unselect', null, { root: true })
    },
    selectIndex ({ dispatch, getters }, { index }) {
      const id = getters.groups[index] ? getters.groups[index].id : 0
      dispatch('select', { id })
    },
    unselect ({ commit }) {
      commit('setSelectedId', { selectedId: 0 })
    },
    selectFirst ({ dispatch }) {
      dispatch('selectIndex', { index: 0 })
    },
    selectLast ({ dispatch, getters }) {
      dispatch('selectIndex', { index: getters.groups.length - 1 })
    },
    selectPrevious ({ dispatch, getters }) {
      dispatch('selectIndex', { index: getters.selectedIndex - 1 })
    },
    selectNext ({ dispatch, getters, state }) {
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
      dispatch('app/focus', { selector: Selector.explorerGroupTable }, { root: true })
    }
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
    groups (state, getters, rootState) {
      return rootState.group.groups.filter((group) => {
        return !state.filtered || !group.disabled
      })
    },
    isSelected (state) {
      return ({ id }) => state.selectedId === id
    },
    selectedIndex (state, getters) {
      return getters.groups.findIndex((group) => getters.isSelected({ id: group.id }))
    },
    selectedGroup (state, getters) {
      return getters.groups.find((group) => getters.isSelected({ id: group.id }))
    },
    canCreate () {
      return true
    },
    canDelete (state) {
      return !!state.selectedId
    },
    canPaste (state) {
      return !!state.copiedObject
    }
  }
}
