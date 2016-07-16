import Host from './host'

export default class HostGroup {
  static build(groups) {
    const newGroups = Array.isArray(groups) ? groups : [groups]
    return newGroups
      .map(group => {
        if (!group.hosts) {
          return null
        }
        let hosts = group.hosts.concat()
        if (!group.enable) {
          hosts = hosts.map(host => {
            const newHost = Object.assign({}, host)
            newHost.enable = false
            return newHost
          })
        }
        const data = Host.build(hosts)
        if (!data) {
          return null
        }
        return data
      })
      .filter(item => !!item)
      .join('\n')
  }
  static getHostLength(groups) {
    const newGroups = Array.isArray(groups) ? groups : [groups]
    return newGroups
      .reduce((previous, current) => (
        previous + (current.hosts ? current.hosts.length : 0)
      ), 0)
  }
}
