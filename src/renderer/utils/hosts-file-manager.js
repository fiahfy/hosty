import fs from 'fs';
import path from 'path';
import { app as mainApp, remote } from 'electron';
import runas from 'runas';
import isRenderer from 'is-electron-renderer';
import * as HostGroup from './host-group';

const app = isRenderer ? remote.app : mainApp;

const DEBUG = process.env.NODE_ENV !== 'production';

const SECTION_BEGIN = '## hosty begin ##';
const SECTION_END = '## hosty end ##';

const CHARSET = 'utf8';

const PATH_USER = path.join(app.getPath('userData'), 'hosts');
const PATH_OSX = '/etc/hosts';
const PATH_WINDOWS = 'C:\\Windows\\System32\\drivers\\etc\\hosts';
const PATH_DUMMY = path.join(process.cwd(), 'dummyHosts');
let PATH = process.platform === 'win32' ? PATH_WINDOWS : PATH_OSX;
if (DEBUG) {
  PATH = PATH_DUMMY;
}

function read() {
  try {
    return fs.readFileSync(PATH_USER, CHARSET);
  } catch (e) {
    throw e;
  }
}

function write(data) {
  try {
    fs.writeFileSync(PATH_USER, data, CHARSET);
  } catch (e) {
    throw e;
  }
}

function setupHostsFile() {
  const options = { admin: !DEBUG };
  try {
    const stats = fs.lstatSync(PATH);
    if (!stats.isSymbolicLink()) {
      return;
    }
    if (runas('rm', [PATH], options)) {
      throw new Error(`Failed to delete ${PATH}`);
    }
  } catch (e) {
    //
  }
  if (runas('touch', [PATH], options)) {
    throw new Error(`Failed to touch ${PATH}`);
  }
}

function setupUserHostsFile() {
  const options = { admin: !DEBUG };
  try {
    const stats = fs.lstatSync(PATH_USER);
    if (stats.isSymbolicLink()) {
      return;
    }
    if (runas('rm', [PATH_USER], options)) {
      throw new Error(`Failed to delete ${PATH_USER}`);
    }
  } catch (e) {
    //
  }
  if (process.platform === 'win32') {
    const commands = [`mklink ${PATH_USER} ${PATH}`, `cacls ${PATH} /e /g Users:w`];
    const command = commands.join(' && ');
    if (runas('cmd', ['/c', command], options)) {
      throw new Error(`Failed to mklink ${PATH} to ${PATH_USER}, or cacls ${PATH}`);
    }
  } else {
    if (runas('ln', ['-s', PATH, PATH_USER], options)) {
      throw new Error(`Failed to symlink ${PATH} to ${PATH_USER}`);
    }
    if (runas('chmod', ['666', PATH], options)) {
      throw new Error(`Failed to chmod ${PATH}`);
    }
  }
}

export function setup() {
  setupHostsFile();
  setupUserHostsFile();
}

export function save(groups = []) {
  const data = read();

  let newData = HostGroup.build(groups);
  newData = `${SECTION_BEGIN}\n${newData}\n${SECTION_END}\n`;

  const reg = new RegExp(
    String.raw`([\s\S]*\n?)${SECTION_BEGIN}\n[\s\S]*\n${SECTION_END}\n?([\s\S]*)`,
    'im',
  );
  const matches = data.match(reg);
  if (matches) {
    newData = matches[1] + newData + matches[2];
  } else {
    newData = `${data}\n${newData}`;
  }

  write(newData);
}

export function clear() {
  save();
}
