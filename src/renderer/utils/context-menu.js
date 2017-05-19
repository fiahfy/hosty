import { remote } from 'electron';

const { Menu, MenuItem } = remote;

function createInspectElementMenuItem(e) {
  const position = { x: e.clientX, y: e.clientY };
  return new MenuItem({
    label: 'Inspect Element',
    click: () => {
      remote.getCurrentWindow().inspectElement(position.x, position.y);
    },
  });
}

export default class ContextMenu {
  static show(e, menuItems = []) {
    e.preventDefault();
    e.stopPropagation();
    const menu = new Menu();
    menuItems.forEach((item) => {
      menu.append(new MenuItem(item));
    });
    if (process.env.NODE_ENV === 'development') {
      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(createInspectElementMenuItem(e));
    }
    menu.popup(remote.getCurrentWindow());
  }
}
