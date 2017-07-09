import { ipcRenderer } from 'electron';
import { bindActionCreators } from 'redux';
import * as ActionCreators from './actions';
import * as Group from './utils/group';

export default function setupListener(store, history) {
  const actions = bindActionCreators(ActionCreators, store.dispatch);

  ipcRenderer.on('sendGroups', (event, { mode, groups }) => {
    if (mode === 'add') {
      groups.forEach((group) => {
        actions.createGroup(group);
      });

      const groupLength = groups.length;
      const hostLength = Group.getHostLength(groups);
      actions.createMessage({ text: `Added ${groupLength} group(s), ${hostLength} host(s)` });
    } else if (mode === 'import') {
      actions.initializeGroups(groups);

      const groupLength = groups.length;
      const hostLength = Group.getHostLength(groups);
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

  ipcRenderer.on('showGroupsWindow', () => {
    history.push('/');
  });

  ipcRenderer.on('showSearchWindow', () => {
    history.push('/search');
  });

  ipcRenderer.on('showSettingsWindow', () => {
    history.push('/settings');
  });

  ipcRenderer.on('createGroup', () => {
    actions.createGroup({ enable: true });
    window.setTimeout(() => {
      actions.focusGroup();
    }, 0);
  });

  ipcRenderer.on('copyGroups', () => {
    actions.copyGroups();
  });

  ipcRenderer.on('pasteGroups', () => {
    actions.pasteGroups();
  });

  ipcRenderer.on('deleteGroups', () => {
    actions.deleteGroups();
  });

  ipcRenderer.on('createHost', () => {
    actions.createHost({ enable: true });
    window.setTimeout(() => {
      actions.focusHost();
    }, 0);
  });

  ipcRenderer.on('copyHosts', () => {
    actions.copyHosts();
  });

  ipcRenderer.on('pasteHosts', () => {
    actions.pasteHosts();
  });

  ipcRenderer.on('deleteHosts', () => {
    actions.deleteHosts();
  });
}
