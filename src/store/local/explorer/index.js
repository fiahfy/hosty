import { Selector } from '~/store'
import child from './child'

const reversed = {
  disabled: false,
  name: false
}

export default {
  namespaced: true,
  state: {
    groups: [],
    selectedGroupId: 0,
    scrollTop: 0,
    order: {
      by: 'name',
      descending: false
    },
    filtered: false,
    clippedGroup: null
  },
  getters: {
    selectedGroupIndex (state, getters) {
      return state.groups.findIndex((group) => getters.isSelectedGroup({ id: group.id }))
    },
    selectedGroup (state, getters) {
      return state.groups[getters.selectedGroupIndex]
    },
    canCreateGroup () {
      return true
    },
    canDeleteGroup (state) {
      return !!state.selectedGroupId
    },
    canPasteGroup (state) {
      return !!state.clippedGroup
    },
    isSelectedGroup (state) {
      return ({ id }) => state.selectedGroupId === id
    },
    getGroups (state, getters, rootState) {
      return () => JSON.parse(JSON.stringify(rootState.group.groups))
    }
  },
  actions: {
    loadGroups ({ commit, dispatch, getters, state }) {
      const groups = getters.getGroups().filter((group) => {
        return !state.filtered || !group.disabled
      })
      commit('setGroups', { groups })
      commit('setScrollTop', { scrollTop: 0 })
      dispatch('sortGroups')
      dispatch('unselectGroup')
    },
    loadGroup ({ commit, getters, state }) {
      const group = getters.getGroups().find((group) => {
        return group.id === state.selectedGroupId
      })
      commit('updateGroup', { id: state.selectedGroupId, group })
    },
    async createGroup ({ commit, dispatch, state }, { group } = {}) {
      const newGroup = await dispatch('group/createGroup', { group }, { root: true })
      commit('addGroup', { group: newGroup })
      const index = state.groups.length - 1
      dispatch('selectGroupIndex', { index })
      dispatch('focusTable')
    },
    deleteGroup ({ commit, dispatch, state }, { id }) {
      const oldIndex = state.groups.findIndex((group) => group.id === id)
      dispatch('group/deleteGroup', { id }, { root: true })
      commit('removeGroup', { id })
      const index = oldIndex < state.groups.length ? oldIndex : state.groups.length - 1
      dispatch('selectGroupIndex', { index })
      dispatch('focusTable')
    },
    updateGroup ({ commit, dispatch }, { id, group }) {
      dispatch('group/updateGroup', { id, group }, { root: true })
      commit('updateGroup', { id, group })
    },
    sortGroups ({ commit, state }) {
      const { by, descending } = state.order
      const groups = state.groups.sort((a, b) => {
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
      commit('setGroups', { groups })
    },
    copyGroup ({ commit, state }, { id }) {
      const clippedGroup = state.groups.find((group) => group.id === id)
      commit('setClippedGroup', { clippedGroup })
    },
    pasteGroup ({ dispatch, state }) {
      const group = state.clippedGroup
      if (!group) {
        return
      }
      dispatch('createGroup', { group })
    },
    selectGroup ({ commit, dispatch, getters }, { id }) {
      commit('setSelectedGroupId', { selectedGroupId: id })
      const title = getters.selectedGroup ? getters.selectedGroup.name || '(Untitled)' : undefined
      dispatch('changeTitle', { title }, { root: true })
      dispatch('child/loadHosts')
      dispatch('child/unselectHost')
    },
    unselectGroup ({ dispatch }) {
      dispatch('selectGroup', { id: 0 })
    },
    selectGroupIndex ({ dispatch, state }, { index }) {
      const group = state.groups[index]
      if (group) {
        dispatch('selectGroup', { id: group.id })
      } else {
        dispatch('unselectGroup')
      }
    },
    selectFirstGroup ({ dispatch, state }) {
      const index = 0
      if (index > -1 && index < state.groups.length) {
        dispatch('selectGroupIndex', { index })
      }
    },
    selectLastGroup ({ dispatch, state }) {
      const index = state.groups.length - 1
      if (index > -1 && index < state.groups.length) {
        dispatch('selectGroupIndex', { index })
      }
    },
    selectPreviousGroup ({ dispatch, getters, state }) {
      const index = getters.selectedGroupIndex - 1
      if (index > -1 && index < state.groups.length) {
        dispatch('selectGroupIndex', { index })
      }
    },
    selectNextGroup ({ dispatch, getters, state }) {
      const index = getters.selectedGroupIndex + 1
      if (index > -1 && index < state.groups.length) {
        dispatch('selectGroupIndex', { index })
      }
    },
    changeOrderBy ({ commit, dispatch, state }, { orderBy }) {
      const descending = state.order.by === orderBy ? !state.order.descending : false
      const order = { by: orderBy, descending }
      commit('setOrder', { order })
      dispatch('sortGroups')
    },
    toggleFiltered ({ dispatch, state }) {
      dispatch('setFiltered', { filtered: !state.filtered })
    },
    setFiltered ({ commit, dispatch }, { filtered }) {
      commit('setFiltered', { filtered })
      dispatch('loadGroups')
    },
    focusTable ({ dispatch }) {
      dispatch('focus', { selector: Selector.explorerTable }, { root: true })
    }
  },
  mutations: {
    setGroups (state, { groups }) {
      state.groups = groups
    },
    addGroup (state, { group }) {
      state.groups = [...state.groups, group]
    },
    updateGroup (state, { id, group }) {
      state.groups = state.groups.map((current) => current.id !== id ? current : { ...current, ...group })
    },
    removeGroup (state, { id }) {
      state.groups = state.groups.filter((group) => group.id !== id)
    },
    setSelectedGroupId (state, { selectedGroupId }) {
      state.selectedGroupId = selectedGroupId
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
    setClippedGroup (state, { clippedGroup }) {
      state.clippedGroup = clippedGroup
    }
  },
  modules: {
    child
  }
}
