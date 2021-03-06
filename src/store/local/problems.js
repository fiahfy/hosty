export const state = () => ({
  scrollTop: 0
})

export const getters = {
  results(state, getters, rootState, rootGetters) {
    return rootState.group.groups
      .map((group) => {
        return {
          key: group.id,
          text: group.name,
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
  }
}
