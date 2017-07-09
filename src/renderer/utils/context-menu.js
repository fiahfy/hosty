import { remote } from 'electron';

const { Menu } = remote;

function inspectElementTemplate(e) {
  const { clientX: x, clientY: y } = e;

  return [
    { type: 'separator' },
    {
      label: 'Inspect Element',
      click: () => {
        remote.getCurrentWindow().inspectElement(x, y);
      },
    },
  ];
}

export default class ContextMenu {
  static show(e, template = []) {
    e.preventDefault();
    e.stopPropagation();

    let newTemplate = template;
    if (process.env.NODE_ENV !== 'production') {
      newTemplate = newTemplate.concat(inspectElementTemplate(e));
    }

    Menu
      .buildFromTemplate(newTemplate)
      .popup(remote.getCurrentWindow(), { async: true });
  }
}
