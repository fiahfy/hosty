import validator from 'validator';

export const SORT_ASC = 'asc';
export const SORT_DESC = 'desc';

export const KEY_ID = 'id';
export const KEY_ENABLE = 'enable';
export const KEY_HOST = 'host';
export const KEY_IP = 'ip';

export function isValidHost(host) {
  if (!host || !host.length) {
    return false;
  }
  return true;
}

export function isValidIp(ip) {
  if (!ip || !ip.length) {
    return false;
  }
  if (!validator.isIP(ip)) {
    return false;
  }
  return true;
}

export function isValid(host) {
  return isValidHost(host.host) && isValidIp(host.ip);
}

export function compare(a, b, { key, order }) {
  if (!a[KEY_HOST] && !b[KEY_HOST]) {
    return a[KEY_ID] > b[KEY_ID] ? 1 : -1;
  }
  if (!a[KEY_HOST]) {
    return 1;
  }
  if (!b[KEY_HOST]) {
    return -1;
  }
  const reversed = order === SORT_DESC ? -1 : 1;
  if (a[key] === b[key]) {
    return a[KEY_ID] > b[KEY_ID] ? reversed : -1 * reversed;
  }
  if (a[key] === '' || a[key] === null || typeof a[key] === 'undefined') {
    return reversed;
  }
  if (b[key] === '' || b[key] === null || typeof b[key] === 'undefined') {
    return -1 * reversed;
  }
  return a[key] > b[key] ? reversed : -1 * reversed;
}

export function build(hosts) {
  const newHosts = Array.isArray(hosts) ? hosts : [hosts];
  return newHosts
    .filter(host => isValid(host))
    .sort((a, b) => {
      let result = compare(a, b, KEY_IP);
      if (result !== 0) {
        return result;
      }
      result = compare(a, b, KEY_ENABLE, SORT_DESC);
      if (result !== 0) {
        return result;
      }
      return compare(a, b, KEY_HOST);
    })
    .map(item => (
      `${(item.enable ? '' : '#')}${item.ip}\t${item.host}`
    ))
    .join('\n');
}

export function parse(data) {
  return data
    .split('\n')
    .map((item) => {
      const matches = item.match(/^(#[#\s\t]*)?([^#\s\t]+)[\s\t]+([^#\s\t]+)[\s\t]*(#.*)?$/i);
      if (!matches) {
        return null;
      }
      return {
        enable: !matches[1],
        ip: matches[2],
        host: matches[3],
      };
    })
    .filter(item => !!item);
}
