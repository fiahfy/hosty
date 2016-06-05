import HostsManager from '../utils/hosts-manager'

export default store => next => action => {
  next(action)
  const hosts = store.getState()['hosts']
  HostsManager.save(hosts)
}
