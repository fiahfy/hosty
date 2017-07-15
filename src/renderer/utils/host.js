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
  const reversed = order === SORT_DESC ? -1 : 1;
  if (a[key] === b[key]) {
    return 0;
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
    .filter(host => isValid(host) && host.enable)
    .sort((a, b) => {
      let result = compare(a, b, { key: KEY_IP });
      if (result !== 0) {
        return result;
      }
      result = compare(a, b, { key: KEY_ENABLE, order: SORT_DESC });
      if (result !== 0) {
        return result;
      }
      return compare(a, b, { key: KEY_HOST });
    })
    .map(item => (
      `${item.ip}\t${item.host}`
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
