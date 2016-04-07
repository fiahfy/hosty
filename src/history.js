import {browserHistory, createMemoryHistory} from 'react-router'
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment'

function createBrowserHistory() {
  return browserHistory
}

export default (ExecutionEnvironment.canUseDOM ? createBrowserHistory() : createMemoryHistory())
