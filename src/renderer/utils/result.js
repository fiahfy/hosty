export const SORT_ASC = 'asc';
export const SORT_DESC = 'desc';

export const KEY_GROUP_ID = 'id';
export const KEY_GROUP_ENABLE = 'enable';
export const KEY_GROUP_NAME = 'name';

export const KEY_HOST_ID = 'id';
export const KEY_HOST_ENABLE = 'enable';
export const KEY_HOST_HOST = 'host';
export const KEY_HOST_IP = 'ip';

export function compare(a, b, { key, order }) {
  let objA;
  let objB;
  if ([KEY_GROUP_ID, KEY_GROUP_ENABLE, KEY_GROUP_NAME].indexOf(key) > -1) {
    objA = a.group;
    objB = b.group;
  } else {
    objA = a.host;
    objB = b.host;
  }
  const reversed = order === SORT_DESC ? -1 : 1;
  if (objA[key] === objB[key]) {
    return 0;
  }
  if (objA[key] === '' || objA[key] === null || typeof objA[key] === 'undefined') {
    return reversed;
  }
  if (objB[key] === '' || objB[key] === null || typeof objB[key] === 'undefined') {
    return -1 * reversed;
  }
  return objA[key] > objB[key] ? reversed : -1 * reversed;
}
