import { ipcRenderer } from 'electron';
import { bindActionCreators } from 'redux';
import * as ActionCreators from './actions';
import * as Group from './utils/group';

export default function setupListener(store, history) {
  const actions = bindActionCreators(ActionCreators, store.dispatch);

  ipcRenderer.on('sendGroups', (event, { method, groups }) => {
    const groupLength = groups.length;
    const hostLength = Group.getHostLength(groups);

    switch (method) {
      case 'initialize': {
        actions.initializeGroups(groups);
        actions.createMessage({ text: `Imported ${groupLength} group(s), ${hostLength} host(s)` });
        break;
      }
      case 'add': {
        actions.addGroups(groups);
        actions.createMessage({ text: `Added ${groupLength} group(s), ${hostLength} host(s)` });
        break;
      }
      default:
        break;
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

  ipcRenderer.on('showPanel', () => {
    actions.showPanel();
  });

  ipcRenderer.on('showSettingsWindow', () => {
    history.push('/settings');
  });

  ipcRenderer.on('createGroup', () => {
    actions.createGroup();
    window.setTimeout(() => {
      actions.focusGroup();
    }, 0);
  });

  ipcRenderer.on('cutGroups', () => {
    actions.cutGroups();
  });

  ipcRenderer.on('copyGroups', () => {
    actions.copyGroups();
  });

  ipcRenderer.on('pasteGroups', () => {
    actions.pasteGroups();
  });

  ipcRenderer.on('enableGroups', () => {
    actions.enableGroups();
  });

  ipcRenderer.on('disableGroups', () => {
    actions.disableGroups();
  });

  ipcRenderer.on('deleteGroups', () => {
    actions.deleteGroups();
  });

  ipcRenderer.on('createHost', () => {
    actions.createHost();
    window.setTimeout(() => {
      actions.focusHost();
    }, 0);
  });

  ipcRenderer.on('cutHosts', () => {
    actions.cutHosts();
  });

  ipcRenderer.on('copyHosts', () => {
    actions.copyHosts();
  });

  ipcRenderer.on('pasteHosts', () => {
    actions.pasteHosts();
  });

  ipcRenderer.on('enableHosts', () => {
    actions.enableHosts();
  });

  ipcRenderer.on('disableHosts', () => {
    actions.disableHosts();
  });

  ipcRenderer.on('deleteHosts', () => {
    actions.deleteHosts();
  });
}
