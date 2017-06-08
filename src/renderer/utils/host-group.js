import * as Host from './host';

export const SORT_ASC = 'asc';
export const SORT_DESC = 'desc';

export const KEY_ENABLE = 'enable';
export const KEY_NAME = 'name';

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

export function compare(a, b, key, order) {
  const r = order === Host.SORT_DESC ? -1 : 1;
  if (a[key] === '' || a[key] === null || typeof a[key] === 'undefined') {
    return r;
  }
  if (b[key] === '' || b[key] === null || typeof b[key] === 'undefined') {
    return -1 * r;
  }
  if (a[key] === b[key]) {
    return 0;
  }
  return (a[key] > b[key]) ? r : -1 * r;
}
