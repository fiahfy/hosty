import validator from 'validator'

export default class Host {
  static SORT_ASC = 'asc'
  static SORT_DESC = 'desc'
  static KEY_ENABLE = 'enable'
  static KEY_HOST = 'host'
  static KEY_IP = 'ip'
  static build(hosts) {
    const newHosts = Array.isArray(hosts) ? hosts : [hosts]
    return newHosts
      .filter(host => Host.isValid(host))
      .sort((a, b) => {
        let compare = Host.compare(a, b, Host.KEY_IP)
        if (compare !== 0) {
          return compare
        }
        compare = Host.compare(a, b, Host.KEY_ENABLE, Host.SORT_DESC)
        if (compare !== 0) {
          return compare
        }
        return Host.compare(a, b, Host.KEY_HOST)
      })
      .map(item => (
        `${(item.enable ? '' : '#')}${item.ip}\t${item.host}`
      ))
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
          ip: matches[2],
          host: matches[3],
        }
      })
      .filter(item => !!item)
  }
  static getErrorMessages(host) {
    return {
      host: Host.getHostErrorMessage(host.host),
      ip: Host.getIPErrorMessage(host.ip),
    }
  }
  static getHostErrorMessage(host) {
    if (!host || !host.length) {
      return 'Missing Host'
    }
    return null
  }
  static getIPErrorMessage(ip) {
    if (!ip || !ip.length) {
      return 'Missing IP'
    }
    if (!validator.isIP(ip)) {
      return 'Invalid IP'
    }
    return null
  }
  static isValid(host) {
    const errors = Host.getErrorMessages(host)
    return Object.keys(errors).every(key => (
      errors[key] === null
    ))
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
