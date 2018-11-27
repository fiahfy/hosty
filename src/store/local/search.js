export default {
  namespaced: true,
  state: {
    scrollTop: 0,
    query: '',
    regExp: false,
    filtered: false
  },
  getters: {
    results(state, getters, rootState) {
      const query = state.query
      if (!query) {
        return []
      }

      try {
        const pattern = state.regExp
          ? query
          : query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
        const regexp = new RegExp(pattern, 'i')

        return rootState.group.groups
          .filter((group) => {
            return !state.filtered || !group.disabled
          })
          .map((group) => {
            return {
              key: group.id,
              text: group.name || '(Untitled)',
              type: 'group',
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
                    type: 'host',
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
    }
  },
  actions: {
    viewResult({ commit, dispatch }, { key }) {
      const [groupId, hostId] = key.split('-').map(Number)
      dispatch('changeRoute', { name: 'explorer' }, { root: true })
      // wait dom updated
      setTimeout(() => {
        commit(
          'local/explorer/setFiltered',
          { filtered: false },
          { root: true }
        )
        dispatch('local/explorer/selectGroup', { id: groupId }, { root: true })
        commit(
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
