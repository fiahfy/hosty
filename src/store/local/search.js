export default {
  namespaced: true,
  state: {
    scrollTop: 0,
    filtered: false,
    regExp: false,
    query: ''
  },
  getters: {
    results(state, getters) {
      const query = state.query || ''
      const pattern = state.regExp
        ? query
        : query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
      try {
        const regexp = new RegExp(pattern, 'i')
        return getters
          .getGroups()
          .filter((group) => {
            return !state.filtered || !group.disabled
          })
          .map((group) => {
            return {
              ...group,
              key: group.id,
              text: group.name,
              hosts: group.hosts
                .filter((host) => {
                  return !state.filtered || !host.disabled
                })
                .filter((host) => {
                  return (
                    query && (regexp.test(host.ip) || regexp.test(host.name))
                  )
                })
                .map((host) => {
                  return {
                    ...host,
                    key: `${group.id}-${host.id}`,
                    text: `${host.ip} ${host.name}`
                  }
                })
                .sort((a, b) => {
                  return a.ip > b.ip ? 1 : -1
                })
            }
          })
          .filter((group) => !!group.hosts.length)
          .sort((a, b) => {
            return a.name > b.name ? 1 : -1
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
    toggleFiltered({ commit, state }) {
      commit('setFiltered', { filtered: !state.filtered })
    },
    toggleRegExp({ commit, state }) {
      commit('setRegExp', { regExp: !state.regExp })
    },
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
    setFiltered(state, { filtered }) {
      state.filtered = filtered
    },
    setRegExp(state, { regExp }) {
      state.regExp = regExp
    },
    setQuery(state, { query }) {
      state.query = query
    }
  }
}
