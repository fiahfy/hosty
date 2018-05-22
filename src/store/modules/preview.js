export default {
  namespaced: true,
  state: {
    scrollTop: 0
  },
  actions: {
    edit ({ dispatch }, { groupId, hostId }) {
      dispatch('changeRoute', { name: 'explorer' }, { root: true })
      dispatch('explorer/group/select', { id: groupId }, { root: true })
      dispatch('explorer/host/select', { id: hostId }, { root: true })
      dispatch('explorer/host/focusList', null, { root: true })
    }
  },
  mutations: {
    setScrollTop (state, { scrollTop }) {
      state.scrollTop = scrollTop
    }
  },
  getters: {
    hosts (state, getters, rootState, rootGetters) {
      return rootGetters['group/hosts']
    }
  }
}
