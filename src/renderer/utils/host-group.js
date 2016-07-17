import Host from './host'

export default class HostGroup {
  static SORT_ASC = 'asc'
  static SORT_DESC = 'desc'
  static KEY_ENABLE = 'enable'
  static KEY_NAME = 'name'
  static build(groups) {
    const newGroups = Array.isArray(groups) ? groups : [groups]
    const hosts = newGroups
      .map(group => {
        if (!group.hosts) {
          return []
        }
        const hosts = group.hosts.concat()
        if (group.enable) {
          return hosts
        }
        return hosts.map(host => {
          const newHost = Object.assign({}, host)
          newHost.enable = false
          return newHost
        })
      })
      .reduce((previous, current) => previous.concat(current), [])
    return Host.build(hosts)
  }
  static getHostLength(groups) {
    const newGroups = Array.isArray(groups) ? groups : [groups]
    return newGroups
      .reduce((previous, current) => (
        previous + (current.hosts ? current.hosts.length : 0)
      ), 0)
  }
  static compare(a, b, key, order) {
    const r = order === Host.SORT_DESC ? -1 : 1
    if (a[key] === '' || a[key] === null || typeof a[key] === 'undefined') {
      return r
    }
    if (b[key] === '' || b[key] === null || typeof b[key] === 'undefined') {
      return -1 * r
    }
    if (a[key] === b[key]) {
      return 0
    }
    return (a[key] > b[key]) ? r : -1 * r
  }
}
