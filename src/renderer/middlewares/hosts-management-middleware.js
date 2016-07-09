import HostsManager from '../utils/hosts-manager'

export default store => next => action => {
  const returnedValue = next(action)
  const groups = store.getState()['groups']
  HostsManager.save(groups)
  return returnedValue
}
