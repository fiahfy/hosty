import { remote } from 'electron'
import selector from '~/consts/selector'

export const state = () => ({
  scrollTop: 0,
  order: {
    by: 'name',
    descending: false
  },
  filtered: false,
  clippedGroup: null
})

export const getters = {
  groups(state, getters, rootState) {
    return rootState.group.groups.filter((group) => {
      return !state.filtered || !group.disabled
    })
  },
  selectedGroup(state, getters, rootState) {
    return getters.groups.find(
      (group) => group.id === rootState.local.selectedGroupId
    )
  },
  selectedGroupIndex(state, getters, rootState) {
    return getters.groups.findIndex(
      (group) => group.id === rootState.local.selectedGroupId
    )
  },
  canCreateGroup() {
    return true
  },
  canDeleteGroup(state, getters, rootState) {
    return !!rootState.local.selectedGroupId
  },
  canPasteGroup(state) {
    return !!state.clippedGroup
  },
  getGroup(state, getters) {
    return ({ id }) => getters.groups.find((group) => group.id === id)
  },
  getGroupIndex(state, getters) {
    return ({ id }) => getters.groups.findIndex((group) => group.id === id)
  },
  isSelectedGroup(state, getters, rootState) {
    return ({ id }) => rootState.local.selectedGroupId === id
  }
}

export const actions = {
  loadGroups({ commit, dispatch }) {
    commit('setScrollTop', { scrollTop: 0 })
    dispatch('unselectGroup')
    dispatch('sortGroups')
  },
  createGroup({ commit, dispatch, getters }, { group } = {}) {
    commit('group/addGroup', { group }, { root: true })
    const index = getters.groups.length - 1
    dispatch('selectGroupIndex', { index })
    dispatch('focusTable')
  },
  deleteGroup({ commit, dispatch, getters, rootState }, { id }) {
    if (!rootState.settings.deleteConfirmation) {
      dispatch('execDeleteGroup', { id })
      return
    }
    const groupName = getters.selectedGroup.name || 'Untitled'
    remote.dialog.showMessageBox(
      remote.getCurrentWindow(),
      {
        type: 'question',
        message: `Are you sure you want to delete '${groupName}'?`,
        buttons: ['OK', 'Cancel'],
        checkboxLabel: 'Do not ask me again'
      },
      (response, checkboxChecked) => {
        if (response === 0) {
          dispatch('execDeleteGroup', { id })
          commit(
            'settings/setDeleteConfirmation',
            { deleteConfirmation: !checkboxChecked },
            { root: true }
          )
        }
      }
    )
  },
  execDeleteGroup({ commit, dispatch, getters }, { id }) {
    const oldIndex = getters.getGroupIndex({ id })
    commit('group/removeGroup', { id }, { root: true })
    const index =
      oldIndex < getters.groups.length ? oldIndex : getters.groups.length - 1
    dispatch('selectGroupIndex', { index })
    dispatch('focusTable')
  },
  updateGroup({ commit }, { id, group }) {
    commit('group/updateGroup', { id, group }, { root: true })
  },
  sortGroups({ commit, state }) {
    commit('group/sortGroups', state.order, { root: true })
  },
  copyGroup({ commit, getters }, { id }) {
    const clippedGroup = getters.getGroup({ id })
    commit('setClippedGroup', { clippedGroup })
  },
  pasteGroup({ dispatch, state }) {
    const group = state.clippedGroup
    if (!group) {
      return
    }
    dispatch('createGroup', { group })
  },
  selectGroup({ commit, dispatch }, { id }) {
    commit('local/setSelectedGroupId', { selectedGroupId: id }, { root: true })
    dispatch('local/loadHosts', null, { root: true })
  },
  unselectGroup({ dispatch }) {
    dispatch('selectGroup', { id: 0 })
  },
  selectGroupIndex({ dispatch, getters }, { index }) {
    const group = getters.groups[index]
    if (group) {
      dispatch('selectGroup', { id: group.id })
    } else {
      dispatch('unselectGroup')
    }
  },
  selectFirstGroup({ dispatch, getters }) {
    const index = 0
    if (index > -1 && index < getters.groups.length) {
      dispatch('selectGroupIndex', { index })
    }
  },
  selectLastGroup({ dispatch, getters }) {
    const index = getters.groups.length - 1
    if (index > -1 && index < getters.groups.length) {
      dispatch('selectGroupIndex', { index })
    }
  },
  selectPreviousGroup({ dispatch, getters }) {
    const index = getters.selectedGroupIndex - 1
    if (index > -1 && index < getters.groups.length) {
      dispatch('selectGroupIndex', { index })
    }
  },
  selectNextGroup({ dispatch, getters }) {
    const index = getters.selectedGroupIndex + 1
    if (index > -1 && index < getters.groups.length) {
      dispatch('selectGroupIndex', { index })
    }
  },
  changeOrderBy({ commit, dispatch, state }, { orderBy }) {
    const descending =
      state.order.by === orderBy ? !state.order.descending : false
    const order = { by: orderBy, descending }
    commit('setOrder', { order })
    dispatch('sortGroups')
  },
  focusTable({ dispatch }) {
    dispatch('focus', { selector: selector.EXPLORER_TABLE }, { root: true })
  }
}

export const mutations = {
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
  setClippedGroup(state, { clippedGroup }) {
    state.clippedGroup = clippedGroup
  }
}
