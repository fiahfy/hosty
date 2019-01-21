export const state = () => ({
  scrollTop: 0,
  query: '',
  regExpEnabled: false
})

export const getters = {
  regExp(state) {
    const query = state.query
    if (!query) {
      return null
    }

    try {
      const pattern = state.regExpEnabled
        ? query
        : query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

      return new RegExp(`(${pattern})`, 'i')
    } catch (e) {
      return null
    }
  },
  results(state, getters, rootState) {
    const regExp = getters.regExp
    if (!regExp) {
      return []
    }

    return rootState.group.groups
      .map((group) => {
        return {
          key: group.id,
          text: group.name,
          type: 'group',
          children: group.hosts
            .filter((host) => {
              return (
                regExp.test(group.name) ||
                regExp.test(host.ip) ||
                regExp.test(host.name)
              )
            })
            .map((host) => {
              return {
                key: `${group.id}-${host.id}`,
                subtext: host.ip,
                text: host.name,
                type: 'host',
                disabled: group.disabled || host.disabled
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
  }
}

export const actions = {
  viewResult({ commit }, { key }) {
    const [selectedGroupId, selectedHostId] = key.split('-').map(Number)
    commit('local/setFiltered', { filtered: false }, { root: true })
    commit('local/setSelectedGroupId', { selectedGroupId }, { root: true })
    commit('local/setSelectedHostId', { selectedHostId }, { root: true })
  }
}

export const mutations = {
  setScrollTop(state, { scrollTop }) {
    state.scrollTop = scrollTop
  },
  setQuery(state, { query }) {
    state.query = query
  },
  toggleRegExpEnabled(state) {
    state.regExpEnabled = !state.regExpEnabled
  }
}
