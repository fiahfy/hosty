import fs from 'fs';
import path from 'path';
import { app as mainApp, remote } from 'electron';
import * as sudoPrompt from 'sudo-prompt';
import isRenderer from 'is-electron-renderer';
import * as Group from './group';

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

const SUDO_OPTIONS = { name: 'Hosty' };

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

async function sudo(command) {
  return new Promise((resolve, reject) => {
    sudoPrompt.exec(command, SUDO_OPTIONS, (error, stdout, stderr) => {
      if (error) {
        reject('Sudo prompt failed: %o', { command, error, stdout, stderr });
        return;
      }
      resolve();
    });
  });
}

async function setupHostsFile() {
  try {
    const stats = fs.lstatSync(PATH);
    if (!stats.isSymbolicLink()) {
      return;
    }
    await sudo(`rm "${PATH}"`);
  } catch (e) {
    //
  }
  await sudo(`touch "${PATH}"`);
}

async function setupUserHostsFile() {
  try {
    const stats = fs.lstatSync(PATH_USER);
    if (stats.isSymbolicLink()) {
      return;
    }
    await sudo(`rm "${PATH_USER}"`);
  } catch (e) {
    //
  }
  if (process.platform === 'win32') {
    const commands = [`mklink "${PATH_USER}" "${PATH}"`, `cacls "${PATH}" /e /g Users:w`];
    const command = commands.join(' && ');
    await sudo(`cmd /c ${command}`);
  } else {
    await sudo(`$SHELL -c "ln -s \\"${PATH}\\" \\"${PATH_USER}\\"; chmod 666 \\"${PATH}\\""`);
  }
}

export async function setup() {
  await setupHostsFile();
  await setupUserHostsFile();
}

export function save(groups = []) {
  const data = read();

  let newData = Group.build(groups);
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
