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
    selectedId: 0,
    scrollTop: 0,
    order: {
      by: 'name',
      descending: false
    },
    filtered: false,
    clip: null
  },
  getters: {
    selectedIndex (state, getters) {
      return getters.filteredGroups.findIndex((group) => getters.isSelected({ id: group.id }))
    },
    selectedGroup (state, getters) {
      return getters.filteredGroups[getters.selectedIndex]
    },
    canCreate () {
      return true
    },
    canDelete (state) {
      return !!state.selectedId
    },
    canPaste (state) {
      return !!state.clip
    },
    filteredGroups (state) {
      return state.groups.filter((group) => {
        return !state.filtered || !group.disabled
      })
    },
    isSelected (state) {
      return ({ id }) => state.selectedId === id
    }
  },
  actions: {
    load ({ commit, dispatch, rootState }) {
      const groups = JSON.parse(JSON.stringify(rootState.group.groups))
      commit('setGroups', { groups })
      commit('setScrollTop', { scrollTop: 0 })
      dispatch('sort')
      dispatch('unselect')
    },
    async create ({ commit, dispatch, getters, state }, { group } = {}) {
      const newGroup = await dispatch('group/createGroup', { group }, { root: true })
      commit('addGroup', { group: newGroup })
      const index = getters.filteredGroups.length - 1
      dispatch('selectIndex', { index })
      dispatch('focusTable')
    },
    delete ({ commit, dispatch, getters, state }) {
      const oldSelectedIndex = getters.selectedIndex
      dispatch('group/deleteGroup', { id: state.selectedId }, { root: true })
      commit('removeGroup', { id: state.selectedId })
      const index = oldSelectedIndex > 0 && oldSelectedIndex > getters.filteredGroups.length - 1 ? oldSelectedIndex - 1 : oldSelectedIndex
      dispatch('selectIndex', { index })
      dispatch('focusTable')
    },
    update ({ commit, dispatch, state }, { group }) {
      dispatch('group/updateGroup', { id: state.selectedId, group }, { root: true })
      commit('setGroup', { id: state.selectedId, group })
    },
    sort ({ commit, state }) {
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
    copy ({ commit, getters }) {
      const clip = getters.selectedGroup
      commit('setClip', { clip })
    },
    paste ({ dispatch, state }) {
      const group = state.clip
      if (!group) {
        return
      }
      dispatch('create', { group })
    },
    select ({ commit, dispatch, getters }, { id }) {
      commit('setSelectedId', { selectedId: id })
      const title = getters.selectedGroup ? getters.selectedGroup.name || '(Untitled)' : undefined
      dispatch('changeTitle', { title }, { root: true })
      dispatch('child/load')
      dispatch('child/unselect')
    },
    unselect ({ dispatch }) {
      dispatch('select', { id: 0 })
    },
    selectIndex ({ dispatch, getters }, { index }) {
      const group = getters.filteredGroups[index]
      if (group) {
        dispatch('select', { id: group.id })
      }
    },
    selectFirst ({ dispatch }) {
      dispatch('selectIndex', { index: 0 })
    },
    selectLast ({ dispatch, getters }) {
      dispatch('selectIndex', { index: getters.filteredGroups.length - 1 })
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
  modules: {
    child
  }
}
