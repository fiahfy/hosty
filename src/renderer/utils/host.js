import validator from 'validator'

export const SORT_ASC = 'asc'
export const SORT_DESC = 'desc'

export const KEY_ENABLE = 'enable'
export const KEY_HOST = 'host'
export const KEY_IP = 'ip'

export function build(hosts) {
  const newHosts = Array.isArray(hosts) ? hosts : [hosts]
  return newHosts
    .filter(host => isValid(host))
    .sort((a, b) => {
      let result = compare(a, b, KEY_IP)
      if (result !== 0) {
        return result
      }
      result = compare(a, b, KEY_ENABLE, SORT_DESC)
      if (result !== 0) {
        return result
      }
      return compare(a, b, KEY_HOST)
    })
    .map(item => (
      `${(item.enable ? '' : '#')}${item.ip}\t${item.host}`
    ))
    .join('\n')
}

export function parse(data) {
  return data
    .split('\n')
    .map(item => {
      const matches = item.match(/^(#[#\s\t]*)?([^#\s\t]+)[\s\t]+([^#\s\t]+)[\s\t]*(#.*)?$/i)
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

export function getErrorMessages(host) {
  return {
    host: getHostErrorMessage(host.host),
    ip: getIPErrorMessage(host.ip),
  }
}

export function getHostErrorMessage(host) {
  if (!host || !host.length) {
    return 'Missing Host'
  }
  return null
}

export function getIPErrorMessage(ip) {
  if (!ip || !ip.length) {
    return 'Missing IP'
  }
  if (!validator.isIP(ip)) {
    return 'Invalid IP'
  }
  return null
}

export function isValid(host) {
  const errors = getErrorMessages(host)
  return Object.keys(errors).every(key => (
    errors[key] === null
  ))
}

export function compare(a, b, key, order) {
  const r = order === SORT_DESC ? -1 : 1
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
