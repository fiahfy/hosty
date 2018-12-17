import fs from 'fs'
import path from 'path'
import { remote } from 'electron'
import { debounce } from 'debounce'
import { exec } from 'sudo-prompt'
import Package from '~~/package.json'

const debug = process.env.NODE_ENV !== 'production'

const darwin = process.platform !== 'win32'

const EXTENSION = 'hosty'

const CHARSET = 'utf8'

const hostsPath = (() => {
  if (debug) {
    return path.join(process.cwd(), 'hosts')
  }
  return darwin ? '/etc/hosts' : 'C:\\Windows\\System32\\drivers\\etc\\hosts'
})()

const userHostsPath = path.join(remote.app.getPath('userData'), 'hosts')

const execAsync = async (command) => {
  return new Promise((resolve, reject) => {
    exec(command, { name: Package.productName }, (error, stdout, stderr) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error('sudo %s %s %s', command, stdout, stderr)
        reject(error)
        return
      }
      resolve()
    })
  })
}

const createHosts = async () => {
  try {
    const stats = fs.lstatSync(hostsPath)
    if (!stats.isSymbolicLink()) {
      return
    }
    await execAsync(`rm "${hostsPath}"`)
  } catch (e) {
    // not exists
  }

  if (darwin) {
    const command = [
      `touch \\"${hostsPath}\\"`,
      `chmod 666 \\"${hostsPath}\\"`
    ].join('; ')
    await execAsync(`$SHELL -c "${command}"`)
  } else {
    const command = [
      `touch "${hostsPath}"`,
      `cacls "${hostsPath}" /e /g Users:w`
    ].join(' && ')
    await execAsync(`cmd /c ${command}`)
  }
}

const symlinkHosts = async () => {
  try {
    const stats = fs.lstatSync(userHostsPath)
    if (stats.isSymbolicLink()) {
      return
    }
    await execAsync(`rm "${userHostsPath}"`)
  } catch (e) {
    // not exists
  }

  if (darwin) {
    const command = [
      `ln -s \\"${hostsPath}\\" \\"${userHostsPath}\\"`,
      `chmod 666 \\"${hostsPath}\\"`
    ].join('; ')
    await execAsync(`$SHELL -c "${command}"`)
  } else {
    const command = [
      `mklink "${userHostsPath}" "${hostsPath}"`,
      `cacls "${hostsPath}" /e /g Users:w`
    ].join(' && ')
    await execAsync(`cmd /c ${command}`)
  }
}

const validHosts = (data) => {
  return data
    .filter((group) => !group.disabled)
    .map((group) => group.hosts || [])
    .reduce((carry, hosts) => carry.concat(hosts), [])
    .filter((host) => !host.disabled && host.name && host.ip)
    .sort((a, b) => {
      let result = 0
      if (a.ip > b.ip) {
        result = 1
      } else if (a.ip < b.ip) {
        result = -1
      }
      if (result === 0) {
        if (a.name > b.name) {
          result = 1
        } else if (a.name < b.name) {
          result = -1
        }
      }
      return result
    })
}

const sync = (data, callback = () => {}) => {
  try {
    const begin = '## hosty begin ##'
    const end = '## hosty end ##'

    const content = fs.readFileSync(userHostsPath, CHARSET)

    let newContent = validHosts(data)
      .map((host) => `${host.ip}\t${host.name}`)
      .join('\n')
    newContent = `${begin}\n${newContent}\n${end}\n`

    const reg = new RegExp(
      String.raw`([\s\S]*\n?)${begin}\n[\s\S]*\n${end}\n?([\s\S]*)`,
      'im'
    )
    const matches = content.match(reg)
    if (matches) {
      newContent = matches[1] + newContent + matches[2]
    } else {
      newContent = `${content}\n${newContent}`
    }

    fs.writeFileSync(userHostsPath, newContent, CHARSET)
    callback()
  } catch (e) {
    callback(e)
  }
}

const syncAsync = (data) => {
  return new Promise((resolve, reject) => {
    sync(data, (e) => {
      if (e) {
        return reject(e)
      }
      resolve()
    })
  })
}

const lazySync = debounce((...args) => sync(...args), 1000)

const initialize = async (data) => {
  await createHosts()
  await symlinkHosts()
  await syncAsync(data)
}

const finalize = async () => {
  await syncAsync([])
}

const read = (filepath) => {
  const json = fs.readFileSync(filepath, CHARSET)
  return JSON.parse(json)
}

const write = (filepath, data) => {
  const json = JSON.stringify(data)
  fs.writeFileSync(filepath, json, CHARSET)
}

export default {
  EXTENSION,
  CHARSET,
  hostsPath,
  userHostsPath,
  sync,
  syncAsync,
  lazySync,
  initialize,
  finalize,
  read,
  write
}
