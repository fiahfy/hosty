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
      return getters.filteredGroups.findIndex((group) => getters.isSelectedGroup({ id: group.id }))
    },
    selectedGroup (state, getters) {
      return getters.filteredGroups[getters.selectedGroupIndex]
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
    filteredGroups (state) {
      return state.groups.filter((group) => {
        return !state.filtered || !group.disabled
      })
    },
    isSelectedGroup (state) {
      return ({ id }) => state.selectedGroupId === id
    }
  },
  actions: {
    loadGroups ({ commit, dispatch, rootState }) {
      const groups = JSON.parse(JSON.stringify(rootState.group.groups))
      commit('setGroups', { groups })
      commit('setScrollTop', { scrollTop: 0 })
      dispatch('sortGroups')
      dispatch('unselectGroup')
    },
    async createGroup ({ commit, dispatch, getters, state }, { group } = {}) {
      const newGroup = await dispatch('group/createGroup', { group }, { root: true })
      commit('addGroup', { group: newGroup })
      const index = getters.filteredGroups.length - 1
      dispatch('selectGroupIndex', { index })
      dispatch('focusTable')
    },
    deleteGroup ({ commit, dispatch, getters, state }) {
      const oldIndex = getters.selectedGroupIndex
      dispatch('group/deleteGroup', { id: state.selectedGroupId }, { root: true })
      commit('removeGroup', { id: state.selectedGroupId })
      const index = oldIndex > 0 && oldIndex > getters.filteredGroups.length - 1 ? oldIndex - 1 : oldIndex
      dispatch('selectGroupIndex', { index })
      dispatch('focusTable')
    },
    updateGroup ({ commit, dispatch, state }, { group }) {
      dispatch('group/updateGroup', { id: state.selectedGroupId, group }, { root: true })
      commit('setGroup', { id: state.selectedGroupId, group })
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
    copyGroup ({ commit, getters }) {
      const clippedGroup = getters.selectedGroup
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
    selectGroupIndex ({ dispatch, getters }, { index }) {
      const group = getters.filteredGroups[index]
      if (group) {
        dispatch('selectGroup', { id: group.id })
      }
    },
    selectFirstGroup ({ dispatch }) {
      dispatch('selectGroupIndex', { index: 0 })
    },
    selectLastGroup ({ dispatch, getters }) {
      dispatch('selectGroupIndex', { index: getters.filteredGroups.length - 1 })
    },
    selectPreviousGroup ({ dispatch, getters }) {
      dispatch('selectGroupIndex', { index: getters.selectedGroupIndex - 1 })
    },
    selectNextGroup ({ dispatch, getters }) {
      dispatch('selectGroupIndex', { index: getters.selectedGroupIndex + 1 })
    },
    changeOrderBy ({ commit, dispatch, state }, { orderBy }) {
      const descending = state.order.by === orderBy ? !state.order.descending : false
      const order = { by: orderBy, descending }
      commit('setOrder', { order })
      dispatch('sortGroups')
    },
    toggleFilter ({ commit, state }) {
      commit('setFiltered', { filtered: !state.filtered })
    },
    focusTable ({ dispatch }) {
      dispatch('focus', { selector: Selector.explorerTable }, { root: true })
    }
  },
  mutations: {
    setGroups (state, { groups }) {
      state.groups = groups
    },
    setGroup (state, { id, group }) {
      state.groups = state.groups.map((current) => current.id !== id ? current : { ...current, ...group })
    },
    addGroup (state, { group }) {
      state.groups = [...state.groups, group]
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
