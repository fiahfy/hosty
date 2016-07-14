import validator from 'validator'

export default class Host {
  static build(hosts) {
    const newHosts = Array.isArray(hosts) ? hosts : [hosts]
    return newHosts
      .filter(host => Host.isValid(host))
      .map(item => {
        return (item.enable ? '' : '#')
          + item.ip + '\t'
          + item.host
      })
      .join('\n')
  }
  static parse(data) {
    return data
      .split('\n')
      .map(item => {
        const matches = item.match(/^([#\s]*)(.*)\t(.*)/i)
        if (!matches) {
          return null
        }
        return {
          enable: !matches[1],
          ip:     matches[2],
          host:   matches[3]
        }
      })
      .filter(item => !!item)
  }
  static isValid(host) {
    if (!host.host || !host.host.length) {
      return false
    }
    if (!host.ip || !host.ip.length) {
      return false
    }
    if (!validator.isIP(host.ip)) {
      return false
    }
    return true
  }
}
