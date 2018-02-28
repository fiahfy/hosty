import * as HostsFileManager from '../utils/hosts-file-manager'

export default {
  namespaced: true,
  state: {
    scrollTop: 0
  },
  mutations: {
    setScrollTop (state, { scrollTop }) {
      state.scrollTop = scrollTop
    }
  },
  getters: {
    hosts (state, getters, rootState) {
      return HostsFileManager.filterHosts(rootState.group.groups)
    }
  }
}
