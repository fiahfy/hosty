import { createAction } from 'redux-actions';

export const INITIALIZE_GROUPS = 'INITIALIZE_GROUPS';
export const CREATE_GROUP = 'CREATE_GROUP';
export const UPDATE_GROUP = 'UPDATE_GROUP';
export const DELETE_GROUPS = 'DELETE_GROUPS';
export const SORT_GROUPS = 'SORT_GROUPS';
export const FOCUS_GROUP = 'FOCUS_GROUP';
export const SELECT_GROUP = 'SELECT_GROUP';
export const UNSELECT_GROUP_ALL = 'UNSELECT_GROUP_ALL';

export const CREATE_HOST = 'CREATE_HOST';
export const UPDATE_HOST = 'UPDATE_HOST';
export const DELETE_HOSTS = 'DELETE_HOSTS';
export const COPY_HOSTS = 'COPY_HOSTS';
export const PASTE_HOSTS = 'PASTE_HOSTS';
export const SORT_HOSTS = 'SORT_HOSTS';
export const FOCUS_HOST = ' FOCUS_HOST';
export const SELECT_HOST = 'SELECT_HOST';
export const UNSELECT_HOST_ALL = 'UNSELECT_HOST_ALL';

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';

export const SEARCH = 'SEARCH';
export const SORT_RESULTS = 'SORT_RESULTS';
export const SELECT_RESULT = 'SELECT_RESULT';

export const CREATE_MESSAGE = 'CREATE_MESSAGE';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';

export const initializeGroups = createAction(
  INITIALIZE_GROUPS,
  groups => ({ groups }),
);

export const createGroup = createAction(
  CREATE_GROUP,
  group => ({ group }),
);

export const updateGroup = createAction(
  UPDATE_GROUP,
  (id, group) => ({ id, group }),
);

export const deleteGroups = createAction(
  DELETE_GROUPS,
  ids => ({ ids }),
);

export const sortGroups = createAction(
  SORT_GROUPS,
  options => ({ options }),
);

export const focusGroup = createAction(
  FOCUS_GROUP,
);

export const selectGroup = createAction(
  SELECT_GROUP,
  (id, mode) => ({ id, mode }),
);

export const unselectGroupAll = createAction(
  UNSELECT_GROUP_ALL,
);

export const createHost = createAction(
  CREATE_HOST,
  (groupId, host) => ({ groupId, host }),
);

export const updateHost = createAction(
  UPDATE_HOST,
  (groupId, id, host) => ({ groupId, id, host }),
);

export const deleteHosts = createAction(
  DELETE_HOSTS,
  (groupId, ids) => ({ groupId, ids }),
);

export const copyHosts = createAction(
  COPY_HOSTS,
);

export const pasteHosts = createAction(
  PASTE_HOSTS,
);

export const sortHosts = createAction(
  SORT_HOSTS,
  (groupId, options) => ({ groupId, options }),
);

export const focusHost = createAction(
  FOCUS_HOST,
);

export const selectHost = createAction(
  SELECT_HOST,
  (id, mode) => ({ id, mode }),
);

export const unselectHostAll = createAction(
  UNSELECT_HOST_ALL,
);

export const updateSettings = createAction(
  UPDATE_SETTINGS,
  settings => ({ settings }),
);

export const search = createAction(
  SEARCH,
  query => ({ query }),
);

export const sortResults = createAction(
  SORT_RESULTS,
  options => ({ options }),
);

export const selectResult = createAction(
  SELECT_RESULT,
  (id, mode) => ({ id, mode }),
);

export const createMessage = createAction(
  CREATE_MESSAGE,
  message => ({ message }),
);

export const clearMessages = createAction(
  CLEAR_MESSAGES,
);
