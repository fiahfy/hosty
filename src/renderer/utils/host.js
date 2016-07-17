import validator from 'validator'

export default class Host {
  static build(hosts) {
    const newHosts = Array.isArray(hosts) ? hosts : [hosts]
    return newHosts
      .filter(host => Host.isValid(host))
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
    return Object.keys(errors).every(key => {
      return errors[key] === null
    })
  }
}
