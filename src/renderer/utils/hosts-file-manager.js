import fs from 'fs';
import path from 'path';
import { app as mainApp, remote } from 'electron';
import * as sudoPrompt from 'sudo-prompt';
import isRenderer from 'is-electron-renderer';
import * as Group from './group';
import * as Host from './host';

const app = isRenderer ? remote.app : mainApp;

const DEBUG = process.env.NODE_ENV !== 'production';
const WIN32 = process.platform === 'win32';

const SECTION_BEGIN = '## hosty begin ##';
const SECTION_END = '## hosty end ##';

const CHARSET = 'utf8';
const EXTENSION = '.hosty';

const PATH_USER = path.join(app.getPath('userData'), 'hosts');
const PATH_OSX = '/etc/hosts';
const PATH_WINDOWS = 'C:\\Windows\\System32\\drivers\\etc\\hosts';
const PATH_DUMMY = path.join(process.cwd(), 'dummyHosts');

const SUDO_OPTIONS = { name: 'Hosty' };

let PATH = WIN32 ? PATH_WINDOWS : PATH_OSX;
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

async function sudo(command) {
  return new Promise((resolve, reject) => {
    sudoPrompt.exec(command, SUDO_OPTIONS, (error, stdout, stderr) => {
      if (error) {
        console.error('Sudo prompt failed: %o', { command, error, stdout, stderr }); // eslint-disable-line no-console
        reject('Sudo prompt failed');
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
  if (WIN32) {
    const commands = [`touch "${PATH}"`, `cacls "${PATH}" /e /g Users:w`];
    const command = commands.join(' && ');
    await sudo(`cmd /c ${command}`);
  } else {
    const commands = [`touch \\"${PATH}\\"`, `chmod 666 \\"${PATH}\\"`];
    const command = commands.join('; ');
    await sudo(`$SHELL -c "${command}"`);
  }
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
  if (WIN32) {
    const commands = [`mklink "${PATH_USER}" "${PATH}"`, `cacls "${PATH}" /e /g Users:w`];
    const command = commands.join(' && ');
    await sudo(`cmd /c ${command}`);
  } else {
    const commands = [`ln -s \\"${PATH}\\" \\"${PATH_USER}\\"`, `chmod 666 \\"${PATH}\\"`];
    const command = commands.join('; ');
    await sudo(`$SHELL -c "${command}"`);
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

export function readGroupsFromHostyFile(filename) {
  const data = fs.readFileSync(filename, CHARSET);
  return JSON.parse(data);
}

export function readGroupFromHostsFile(filename) {
  const { name } = path.parse(filename);
  const data = fs.readFileSync(filename, CHARSET);
  const hosts = Host.parse(data);
  return {
    enable: true,
    name,
    hosts,
  };
}

export function readGroupsFromFiles(filenames) {
  return filenames.map((filename) => {
    const { ext } = path.parse(filename);
    return ext === EXTENSION
      ? this.readGroupsFromHostyFile(filename)
      : [this.readGroupFromHostsFile(filename)];
  }).reduce((previous, current) => [...previous, ...current]);
}

export function writeGroupsToHostyFile(groups, filename) {
  const { ext } = path.parse(filename);
  let filenameWithExtension = filename;
  if (ext !== EXTENSION) {
    filenameWithExtension += EXTENSION;
  }
  fs.writeFileSync(filenameWithExtension, `${JSON.stringify(groups)}\n`, CHARSET);
}

export function writeGroupsToHostsFile(groups, filename) {
  fs.writeFileSync(filename, `${Group.build(groups)}\n`, CHARSET);
}
