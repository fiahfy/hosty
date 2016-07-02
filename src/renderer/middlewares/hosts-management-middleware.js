import HostsManager from '../utils/hosts-manager'

export default store => next => action => {
  next(action)
  const groups = store.getState()['groups']
  HostsManager.save(groups)
}
