import * as HostsFileManager from '../utils/hosts-file-manager';

export default store => next => (action) => {
  const returnedValue = next(action);
  const { groups } = store.getState();
  HostsFileManager.save(groups);
  return returnedValue;
};
