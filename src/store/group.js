import isIP from 'is-ip'

const reversed = {
  disabled: false,
  name: false,
  ip: false
}

export default {
  namespaced: true,
  state: {
    groups: []
  },
  getters: {
    actualHosts(state) {
      return state.groups
        .filter((group) => !group.disabled)
        .map((group) => group.hosts || [])
        .reduce((carry, hosts) => carry.concat(hosts), [])
        .filter((host) => !host.disabled && host.name && host.ip)
        .sort((a, b) => {
          let result = 0
          if (a.ip > b.ip) {
            result = 1
          } else if (a.ip < b.ip) {
            result = -1
          }
          if (result === 0) {
            if (a.name > b.name) {
              result = 1
            } else if (a.name < b.name) {
              result = -1
            }
          }
          return result
        })
    },
    findHostErrors(state, getters) {
      return ({ group, host }) => {
        const errors = []
        let error
        error = getters.findHostIPError({ group, host })
        if (error) {
          errors.push(error)
        }
        error = getters.findHostNameError({ group, host })
        if (error) {
          errors.push(error)
        }
        return errors
      }
    },
    findHostIPError() {
      return ({ host }) => {
        if (!host.ip) {
          return 'Missing ip address.'
        }
        if (!isIP(host.ip)) {
          return `'${host.ip}' is invalid ip address.`
        }
        return ''
      }
    },
    findHostNameError(state) {
      return ({ group, host }) => {
        if (!host.name) {
          return 'Missing hostname.'
        }
        if (group.disabled || host.disabled) {
          return ''
        }
        if (
          state.groups
            .filter((group) => !group.disabled)
            .map((group) =>
              (group.hosts || []).map((host) => ({
                groupId: group.id,
                ...host
              }))
            )
            .reduce((carry, hosts) => carry.concat(hosts), [])
            .filter(
              (currentHost) =>
                !currentHost.disabled &&
                (currentHost.groupId !== group.id || currentHost.id !== host.id)
            )
            .some((currentHost) => currentHost.name === host.name)
        ) {
          return `'${host.name}' is duplicate entry.`
        }
        return ''
      }
    }
  },
  actions: {},
  mutations: {
    setGroups(state, { groups }) {
      state.groups = groups
    },
    addGroup(state, { group } = {}) {
      const id =
        Math.max.apply(null, [0, ...state.groups.map((group) => group.id)]) + 1

      state.groups = [
        ...state.groups,
        {
          disabled: false,
          name: '',
          hosts: [],
          ...group,
          id
        }
      ]
    },
    removeGroup(state, { id }) {
      state.groups = state.groups.filter((group) => group.id !== id)
    },
    updateGroup(state, { id, group }) {
      state.groups = state.groups.map((currentGroup) => {
        if (currentGroup.id !== id) {
          return currentGroup
        }
        return {
          ...currentGroup,
          ...group
        }
      })
    },
    sortGroups(state, { by, descending }) {
      state.groups = state.groups.sort((a, b) => {
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
    },
    addHost(state, { groupId, host } = {}) {
      state.groups = state.groups.map((group) => {
        if (group.id !== groupId) {
          return group
        }

        const id =
          Math.max.apply(null, [0, ...group.hosts.map((host) => host.id)]) + 1

        return {
          ...group,
          hosts: [
            ...group.hosts,
            {
              disabled: false,
              name: '',
              ip: '',
              ...host,
              id
            }
          ]
        }
      })
    },
    removeHost(state, { groupId, id }) {
      state.groups = state.groups.map((group) => {
        if (group.id !== groupId) {
          return group
        }

        return {
          ...group,
          hosts: group.hosts.filter((host) => host.id !== id)
        }
      })
    },
    updateHost(state, { groupId, id, host }) {
      state.groups = state.groups.map((group) => {
        if (group.id !== groupId) {
          return group
        }

        return {
          ...group,
          hosts: group.hosts.map((currentHost) => {
            if (currentHost.id !== id) {
              return currentHost
            }
            return {
              ...currentHost,
              ...host
            }
          })
        }
      })
    },
    sortHosts(state, { groupId, by, descending }) {
      state.groups = state.groups.map((group) => {
        if (group.id !== groupId) {
          return group
        }

        return {
          ...group,
          hosts: group.hosts.sort((a, b) => {
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
        }
      })
    }
  }
}
