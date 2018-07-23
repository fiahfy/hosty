const reversed = {
  disabled: false,
  group: false,
  host: false,
  ip: false
}

export default {
  namespaced: true,
  state: {
    items: [],
    selectedItemId: 0,
    scrollTop: 0,
    order: {
      by: 'group',
      descending: false
    },
    filtered: false,
    regExp: false,
    query: ''
  },
  getters: {
    filteredItems (state) {
      const query = state.query || ''
      const pattern = state.regExp ? query : RegExp.escape(query)
      const regexp = new RegExp(pattern, 'i')
      return state.items.filter((item) => {
        return !state.filtered || !item.disabled
      }).filter((item) => {
        return !query ||
          regexp.test(item.group || '') ||
          regexp.test(item.ip || '') ||
          regexp.test(item.host || '')
      })
    },
    selectedItemIndex (state, getters) {
      return getters.filteredItems.findIndex((item) => getters.isSelectedItem({ id: item.id }))
    },
    selectedItem (state, getters) {
      return getters.filteredItems[getters.selectedItemIndex]
    },
    isSelectedItem (state) {
      return ({ id }) => state.selectedItemId === id
    },
    getGroups (state, getters, rootState) {
      return () => JSON.parse(JSON.stringify(rootState.group.groups))
    }
  },
  actions: {
    loadItems ({ commit, dispatch, getters }) {
      const items = getters.getGroups().reduce((carry, group) => {
        return [...carry, ...(group.hosts || []).map((host) => {
          return {
            id: `${group.id}-${host.id}`,
            disabled: group.disabled || host.disabled,
            group: group.name,
            ip: host.ip,
            host: host.name
          }
        })]
      }, [])
      commit('setItems', { items })
      dispatch('sortItems')
    },
    sortItems ({ commit, state }) {
      const { by, descending } = state.order
      const items = state.items.sort((a, b) => {
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
      commit('setItems', { items })
    },
    selectItem ({ commit, dispatch, getters }, { id }) {
      commit('setSelectedItemId', { selectedItemId: id })
      const title = getters.selectedItem ? getters.selectedItem.name || '(Untitled)' : undefined
      dispatch('changeTitle', { title }, { root: true })
    },
    unselectItem ({ dispatch }) {
      dispatch('selectItem', { id: 0 })
    },
    selectItemIndex ({ dispatch, getters }, { index }) {
      const item = getters.filteredItems[index]
      if (item) {
        dispatch('selectItem', { id: item.id })
      } else {
        dispatch('unselectItem')
      }
    },
    selectFirstItem ({ dispatch, getters }) {
      const index = 0
      if (index > -1 && index < getters.filteredItems.length) {
        dispatch('selectItemIndex', { index })
      }
    },
    selectLastItem ({ dispatch, getters }) {
      const index = getters.filteredItems.length - 1
      if (index > -1 && index < getters.filteredItems.length) {
        dispatch('selectItemIndex', { index })
      }
    },
    selectPreviousItem ({ dispatch, getters }) {
      const index = getters.selectedItemIndex - 1
      if (index > -1 && index < getters.filteredItems.length) {
        dispatch('selectItemIndex', { index })
      }
    },
    selectNextItem ({ dispatch, getters }) {
      const index = getters.selectedItemIndex + 1
      if (index > -1 && index < getters.filteredItems.length) {
        dispatch('selectItemIndex', { index })
      }
    },
    changeOrderBy ({ commit, dispatch, state }, { orderBy }) {
      const descending = state.order.by === orderBy ? !state.order.descending : false
      const order = { by: orderBy, descending }
      commit('setOrder', { order })
      dispatch('sortItems')
    },
    toggleFilter ({ commit, dispatch, state }) {
      commit('setFiltered', { filtered: !state.filtered })
      dispatch('loadItems')
    },
    toggleRegExp ({ commit, dispatch, state }) {
      commit('setRegExp', { regExp: !state.regExp })
      dispatch('loadItems')
    },
    viewItem ({ dispatch, state }) {
      const [groupId, hostId] = state.selectedItemId.split('-').map(Number)
      dispatch('changeRoute', { name: 'explorer' }, { root: true })
      // wait dom updated
      setTimeout(() => {
        dispatch('local/explorer/selectGroup', { id: groupId }, { root: true })
        dispatch('local/explorer/child/selectHost', { id: hostId }, { root: true })
      })
    }
  },
  mutations: {
    setItems (state, { items }) {
      state.items = items
    },
    setSelectedItemId (state, { selectedItemId }) {
      state.selectedItemId = selectedItemId
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
    setRegExp (state, { regExp }) {
      state.regExp = regExp
    },
    setQuery (state, { query }) {
      state.query = query
    }
  }
}
