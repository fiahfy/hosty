import router from '~/router'
import * as HostsFileManager from '~/utils/hosts-file-manager'
import explorer from './explorer'
import preview from './preview'

export const Selector = {
  groupList: '.group-list',
  hostList: '.host-list'
}

export default {
  namespaced: true,
  state: {
    title: '',
    message: ''
  },
  actions: {
    changeRoute ({ dispatch }, payload) {
      router.push(payload)
      const title = payload.name.charAt(0).toUpperCase() + payload.name.slice(1)
      dispatch('changeTitle', { title })
    },
    focus (_, { selector }) {
      // wait dom updated
      setTimeout(() => {
        const el = document.querySelector(selector)
        if (el) {
          el.focus()
        }
      })
    },
    focusGroupList ({ dispatch }) {
      dispatch('focus', { selector: Selector.groupList })
    },
    focusHostList ({ dispatch }) {
      dispatch('focus', { selector: Selector.hostList })
    },
    async initHosts ({ rootGetters }) {
      await HostsFileManager.setup()
      HostsFileManager.save(rootGetters['group/hosts'])
    },
    saveHosts ({ rootGetters }) {
      HostsFileManager.save(rootGetters['group/hosts'])
    },
    clearHosts () {
      HostsFileManager.clear()
    },
    importHosts ({ dispatch }, { filepath }) {
      try {
        const groups = HostsFileManager.readHostyFile(filepath)
        dispatch('group/setGroups', { groups })
        dispatch('explorer/group/sort')
        dispatch('showMessage', { message: 'Imported' })
      } catch (e) {
        console.error(e)
        dispatch('showMessage', { message: 'Import failed' })
      }
    },
    exportHosts ({ dispatch, state }, { filepath }) {
      try {
        const groups = state.group.groups
        HostsFileManager.writeHostyFile(filepath, groups)
        dispatch('showMessage', { message: 'Exported' })
      } catch (e) {
        console.error(e)
        dispatch('showMessage', { message: 'Export failed' })
      }
    },
    changeTitle ({ commit }, { title }) {
      commit('setTitle', { title })
    },
    showMessage ({ commit }, { message }) {
      commit('setMessage', { message })
      // wait dom updated
      setTimeout(() => {
        commit('setMessage', { message: '' })
      })
    }
  },
  mutations: {
    setTitle (state, { title }) {
      state.title = title
    },
    setMessage (state, { message }) {
      state.message = message
    }
  },
  getters: {
    titleBar (state) {
      return process.platform === 'darwin' && !state.fullScreen
    }
  },
  modules: {
    explorer,
    preview
  }
}
