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
    query: ''
  },
  getters: {
    selectedItemIndex (state, getters) {
      return state.items.findIndex((item) => getters.isSelectedItem({ id: item.id }))
    },
    selectedItem (state, getters) {
      return state.items[getters.selectedItemIndex]
    },
    isSelectedItem (state) {
      return ({ id }) => state.selectedItemId === id
    }
  },
  actions: {
    loadItems ({ commit, dispatch, rootState, state }) {
      const items = JSON.parse(JSON.stringify(rootState.group.groups))
        .reduce((carry, group) => {
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
        .filter((item) => {
          return !state.filtered || !item.disabled
        })
      commit('setItems', { items })
      // commit('setScrollTop', { scrollTop: 0 })
      dispatch('sortItems')
      dispatch('unselectItem')
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
    selectItemIndex ({ dispatch, state }, { index }) {
      const item = state.items[index]
      if (item) {
        dispatch('selectItem', { id: item.id })
      } else {
        dispatch('unselectItem')
      }
    },
    selectFirstItem ({ dispatch, state }) {
      const index = 0
      if (index > -1 && index < state.items.length) {
        dispatch('selectItemIndex', { index })
      }
    },
    selectLastItem ({ dispatch, state }) {
      const index = state.items.length - 1
      if (index > -1 && index < state.items.length) {
        dispatch('selectItemIndex', { index })
      }
    },
    selectPreviousItem ({ dispatch, getters, state }) {
      const index = getters.selectedItemIndex - 1
      if (index > -1 && index < state.items.length) {
        dispatch('selectItemIndex', { index })
      }
    },
    selectNextItem ({ dispatch, getters, state }) {
      const index = getters.selectedItemIndex + 1
      if (index > -1 && index < state.items.length) {
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
    setQuery (state, { query }) {
      state.query = query
    }
  }
}
