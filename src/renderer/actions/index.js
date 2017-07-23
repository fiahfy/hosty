import { createAction } from 'redux-actions';

export const INITIALIZE_GROUPS = 'INITIALIZE_GROUPS';
export const ADD_GROUPS = 'ADD_GROUPS';

export const CREATE_GROUP = 'CREATE_GROUP';
export const UPDATE_GROUP = 'UPDATE_GROUP';
export const ENABLE_GROUPS = 'ENABLE_GROUPS';
export const DISABLE_GROUPS = 'DISABLE_GROUPS';
export const DELETE_GROUPS = 'DELETE_GROUPS';
export const CUT_GROUPS = 'CUT_GROUPS';
export const COPY_GROUPS = 'COPY_GROUPS';
export const PASTE_GROUPS = 'PASTE_GROUPS';
export const SORT_GROUPS = 'SORT_GROUPS';
export const FOCUS_GROUP = 'FOCUS_GROUP';
export const SELECT_GROUP = 'SELECT_GROUP';

export const CREATE_HOST = 'CREATE_HOST';
export const UPDATE_HOST = 'UPDATE_HOST';
export const ENABLE_HOSTS = 'ENABLE_HOSTS';
export const DISABLE_HOSTS = 'DISABLE_HOSTS';
export const DELETE_HOSTS = 'DELETE_HOSTS';
export const CUT_HOSTS = 'CUT_HOSTS';
export const COPY_HOSTS = 'COPY_HOSTS';
export const PASTE_HOSTS = 'PASTE_HOSTS';
export const SORT_HOSTS = 'SORT_HOSTS';
export const FOCUS_HOST = ' FOCUS_HOST';
export const SELECT_HOST = 'SELECT_HOST';

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';

export const FIND_HOSTS = 'FIND_HOSTS';
export const SET_REGEXP_ENABLED = 'SET_REGEXP_ENABLED';
export const SHOW_PANEL = 'SHOW_PANEL';
export const HIDE_PANEL = 'HIDE_PANEL';

export const CREATE_MESSAGE = 'CREATE_MESSAGE';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';

export const initializeGroups = createAction(
  INITIALIZE_GROUPS,
  groups => ({ groups }),
);

export const addGroups = createAction(
  ADD_GROUPS,
  groups => ({ groups }),
);

export const createGroup = createAction(CREATE_GROUP);

export const updateGroup = createAction(
  UPDATE_GROUP,
  (id, group) => ({ id, group }),
);

export const enableGroups = createAction(ENABLE_GROUPS);

export const disableGroups = createAction(DISABLE_GROUPS);

export const deleteGroups = createAction(DELETE_GROUPS);

export const cutGroups = createAction(CUT_GROUPS);

export const copyGroups = createAction(COPY_GROUPS);

export const pasteGroups = createAction(PASTE_GROUPS);

export const sortGroups = createAction(
  SORT_GROUPS,
  options => ({ options }),
);

export const focusGroup = createAction(FOCUS_GROUP);

export const selectGroup = createAction(
  SELECT_GROUP,
  (id, option) => ({ id, option }),
);

export const createHost = createAction(CREATE_HOST);

export const updateHost = createAction(
  UPDATE_HOST,
  (id, host) => ({ id, host }),
);

export const enableHosts = createAction(ENABLE_HOSTS);

export const disableHosts = createAction(DISABLE_HOSTS);

export const deleteHosts = createAction(DELETE_HOSTS);

export const cutHosts = createAction(CUT_HOSTS);

export const copyHosts = createAction(COPY_HOSTS);

export const pasteHosts = createAction(PASTE_HOSTS);

export const sortHosts = createAction(
  SORT_HOSTS,
  options => ({ options }),
);

export const focusHost = createAction(FOCUS_HOST);

export const selectHost = createAction(
  SELECT_HOST,
  (id, option) => ({ id, option }),
);

export const updateSettings = createAction(
  UPDATE_SETTINGS,
  settings => ({ settings }),
);

export const findHosts = createAction(
  FIND_HOSTS,
  query => ({ query }),
);

export const setRegExpEnabled = createAction(
  SET_REGEXP_ENABLED,
  enabled => ({ enabled }),
);

export const showPanel = createAction(SHOW_PANEL);

export const hidePanel = createAction(HIDE_PANEL);

export const createMessage = createAction(
  CREATE_MESSAGE,
  message => ({ message }),
);

export const clearMessages = createAction(CLEAR_MESSAGES);
