import { createAction } from 'redux-actions';

export const INITIALIZE_GROUPS = 'INITIALIZE_GROUPS';
export const CREATE_GROUP = 'CREATE_GROUP';
export const UPDATE_GROUP = 'UPDATE_GROUP';
export const DELETE_GROUPS = 'DELETE_GROUPS';
export const SORT_GROUPS = 'SORT_GROUPS';
export const SELECT_GROUPS = 'SELECT_GROUPS';

export const CREATE_HOST = 'CREATE_HOST';
export const UPDATE_HOST = 'UPDATE_HOST';
export const DELETE_HOSTS = 'DELETE_HOSTS';
export const SORT_HOSTS = 'SORT_HOSTS';
export const SELECT_HOSTS = 'SELECT_HOSTS';

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

export const selectGroups = createAction(
  SELECT_GROUPS,
  ids => ({ ids }),
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

export const sortHosts = createAction(
  SORT_HOSTS,
  (groupId, options) => ({ groupId, options }),
);

export const selectHosts = createAction(
  SELECT_HOSTS,
  ids => ({ ids }),
);

export const createMessage = createAction(
  CREATE_MESSAGE,
  message => ({ message }),
);

export const clearMessages = createAction(
  CLEAR_MESSAGES,
);

