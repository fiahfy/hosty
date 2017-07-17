import * as Host from './host';

export const SORT_ASC = 'asc';
export const SORT_DESC = 'desc';

export const KEY_ID = 'id';
export const KEY_ENABLE = 'enable';
export const KEY_NAME = 'name';

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
  let result = false;
  if (key === KEY_ENABLE) {
    result = a[key] < b[key];
  } else {
    result = a[key] > b[key];
  }
  return result ? reversed : -1 * reversed;
}

export function build(groups) {
  const newGroups = Array.isArray(groups) ? groups : [groups];
  const newHosts = newGroups
    .map((group) => {
      if (!group.hosts) {
        return [];
      }
      const hosts = group.hosts.concat();
      if (group.enable) {
        return hosts;
      }
      return hosts.map((host) => {
        const newHost = Object.assign({}, host);
        newHost.enable = false;
        return newHost;
      });
    })
    .reduce((previous, current) => previous.concat(current), []);
  return Host.build(newHosts);
}

export function getHostLength(groups) {
  const newGroups = Array.isArray(groups) ? groups : [groups];
  return newGroups
    .reduce((previous, current) => (
      previous + (current.hosts ? current.hosts.length : 0)
    ), 0);
}
