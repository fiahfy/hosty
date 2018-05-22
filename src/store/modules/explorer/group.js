const reversed = {
  disabled: false,
  name: false
}

export default {
  namespaced: true,
  state: {
    id: 0,
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
      const index = getters.items.length - 1
      dispatch('selectIndex', { index })
      // dispatch('focusList')
    },
    delete ({ dispatch, getters, state }) {
      const oldSelectedIndex = getters.selectedIndex
      dispatch('group/deleteGroup', { id: state.selectedId }, { root: true })
      const index = oldSelectedIndex > 0 && oldSelectedIndex > getters.items.length - 1 ? oldSelectedIndex - 1 : oldSelectedIndex
      dispatch('selectIndex', { index })
      // dispatch('focusList')
    },
    update ({ dispatch }, { id, group }) {
      dispatch('group/updateGroup', { id, group }, { root: true })
    },
    sort ({ dispatch, state }) {
      dispatch('group/sortGroups', { ...state.sortOption }, { root: true })
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
    unselect ({ commit }) {
      commit('setSelectedId', { selectedId: 0 })
    },
    toggleFilter ({ commit, state }) {
      commit('setFiltered', { filtered: !state.filtered })
    },
    changeOrderBy ({ commit, dispatch, state }, { orderBy }) {
      const descending = state.order.by === orderBy ? !state.order.descending : false
      const order = { by: orderBy, descending }
      commit('setOrder', { order })
      dispatch('sort')
    }
    // focusList ({ dispatch }) {
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
    items (state, getters, rootState) {
      return rootState.group.groups.filter((group) => {
        return !state.filtered || !group.disabled
      })
    },
    isSelected (state) {
      return ({ id }) => state.id === id
    },
    selectedIndex (state, getters) {
      return getters.items.findIndex((group) => getters.isSelected({ id: group.id }))
    },
    selectedGroup (state, getters) {
      return getters.items.find((group) => getters.isSelected({ id: group.id }))
    },
    // canCreate () {
    //   return true
    // },
    // canDelete (state) {
    //   return !!state.selectedId
    // }
  }
}
