import { ipcRenderer } from 'electron';
import { bindActionCreators } from 'redux';
import * as ActionCreators from './actions';
import * as HostGroup from './utils/host-group';

export default function setupListener(store) {
  const actions = bindActionCreators(ActionCreators, store.dispatch);

  ipcRenderer.on('sendGroups', (event, { mode, groups }) => {
    if (mode === 'add') {
      groups.forEach((group) => {
        actions.createGroup(group);
      });

      const groupLength = groups.length;
      const hostLength = HostGroup.getHostLength(groups);
      actions.createMessage({ text: `Added ${groupLength} group(s), ${hostLength} host(s)` });
    } else if (mode === 'import') {
      actions.initializeGroups(groups);

      const groupLength = groups.length;
      const hostLength = HostGroup.getHostLength(groups);
      actions.createMessage({ text: `Imported ${groupLength} group(s), ${hostLength} host(s)` });
    }
  });

  ipcRenderer.on('requestGroups', (event) => {
    const { groups } = store.getState();
    event.sender.send('sendGroups', { groups });
  });

  ipcRenderer.on('sendMessage', (event, { message }) => {
    actions.createMessage(message);
  });
}
