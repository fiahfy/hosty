export default {
  namespaced: true,
  state: {
    scrollTop: 0
  },
  getters: {
    results(state, getters, rootState, rootGetters) {
      return getters
        .getGroups()
        .map((group) => {
          return {
            key: group.id,
            text: group.name || '(Untitled)',
            type: 'group',
            children: group.hosts
              .reduce((carry, host) => {
                return [
                  ...carry,
                  ...rootGetters['group/findHostErrors']({
                    group: group,
                    host
                  }).map((problem, i) => {
                    return {
                      key: `${group.id}-${host.id}-${i}`,
                      text: problem,
                      type: 'problem'
                    }
                  })
                ]
              }, [])
              .sort((a, b) => {
                return a.text > b.text ? 1 : -1
              })
          }
        })
        .filter((group) => !!group.children.length)
        .sort((a, b) => {
          return a.text > b.text ? 1 : -1
        })
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
    }
  }
}
