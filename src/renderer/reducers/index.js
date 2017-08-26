import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import reduceReducers from 'reduce-reducers';
import root from './root';
import groups from './groups';
import settings from './settings';
import app from './containers/app';
import titleContainer from './containers/title-container';
import mainContainer from './containers/main-container';
import groupContainer from './containers/group-container';
import hostContainer from './containers/host-container';
import findContainer from './containers/find-container';

export default reduceReducers(
  combineReducers({
    groups,
    settings,
    app,
    titleContainer,
    mainContainer,
    groupContainer,
    hostContainer,
    findContainer,
    router,
  }),
  root,
);
