export default {
  namespaced: true,
  state: {
    scrollTop: 0,
    query: '',
    regExp: false,
    filtered: false
  },
  getters: {
    results(state, getters) {
      const query = state.query
      if (!query) {
        return []
      }

      try {
        const pattern = state.regExp
          ? query
          : query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
        const regexp = new RegExp(pattern, 'i')

        return getters
          .getGroups()
          .filter((group) => {
            return !state.filtered || !group.disabled
          })
          .map((group) => {
            return {
              key: group.id,
              text: group.name,
              disabled: group.disabled,
              children: group.hosts
                .filter((host) => {
                  return (
                    (!state.filtered || !host.disabled) &&
                    (regexp.test(host.ip) || regexp.test(host.name))
                  )
                })
                .map((host) => {
                  return {
                    key: `${group.id}-${host.id}`,
                    text: `${host.ip} ${host.name}`,
                    disabled: host.disabled
                  }
                })
                .sort((a, b) => {
                  return a.text > b.text ? 1 : -1
                })
            }
          })
          .filter((group) => !!group.children.length)
          .sort((a, b) => {
            return a.text > b.text ? 1 : -1
          })
      } catch (e) {
        return []
      }
    },
    getGroups(state, getters, rootState) {
      return () => JSON.parse(JSON.stringify(rootState.group.groups))
    }
  },
  actions: {
    viewResult({ dispatch }, { key }) {
      const [groupId, hostId] = key.split('-').map(Number)
      dispatch('changeRoute', { name: 'explorer' }, { root: true })
      // wait dom updated
      setTimeout(() => {
        dispatch(
          'local/explorer/setFiltered',
          { filtered: false },
          { root: true }
        )
        dispatch('local/explorer/selectGroup', { id: groupId }, { root: true })
        dispatch(
          'local/explorer/child/setFiltered',
          { filtered: false },
          { root: true }
        )
        dispatch(
          'local/explorer/child/selectHost',
          { id: hostId },
          { root: true }
        )
      })
    }
  },
  mutations: {
    setScrollTop(state, { scrollTop }) {
      state.scrollTop = scrollTop
    },
    setQuery(state, { query }) {
      state.query = query
    },
    toggleRegExp(state) {
      state.regExp = !state.regExp
    },
    toggleFiltered(state) {
      state.filtered = !state.filtered
    }
  }
}
