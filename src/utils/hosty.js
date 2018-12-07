import fs from 'fs'
import path from 'path'
import { remote } from 'electron'
import { debounce } from 'debounce'
import { exec } from 'sudo-prompt'
import Package from '~~/package.json'

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

export default class Hosty {
  constructor() {
    this.data = []
    this.lazySync = debounce((...args) => this._sync(...args), 1000)
  }
  static get debug() {
    return process.env.NODE_ENV !== 'production'
  }
  static get darwin() {
    return process.platform !== 'win32'
  }
  static get extension() {
    return 'hosty'
  }
  static get charset() {
    return 'utf8'
  }
  static get hostsPath() {
    if (Hosty.debug) {
      return path.join(process.cwd(), 'hosts')
    }
    return Hosty.darwin
      ? '/etc/hosts'
      : 'C:\\Windows\\System32\\drivers\\etc\\hosts'
  }
  static get userHostsPath() {
    return path.join(remote.app.getPath('userData'), 'hosts')
  }
  get validHosts() {
    return this.data
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
  async _createHosts() {
    try {
      const stats = fs.lstatSync(Hosty.hostsPath)
      if (!stats.isSymbolicLink()) {
        return
      }
      await execAsync(`rm "${Hosty.hostsPath}"`)
    } catch (e) {
      // not exists
    }

    if (Hosty.darwin) {
      const command = [
        `touch \\"${Hosty.hostsPath}\\"`,
        `chmod 666 \\"${Hosty.hostsPath}\\"`
      ].join('; ')
      await execAsync(`$SHELL -c "${command}"`)
    } else {
      const command = [
        `touch "${Hosty.hostsPath}"`,
        `cacls "${Hosty.hostsPath}" /e /g Users:w`
      ].join(' && ')
      await execAsync(`cmd /c ${command}`)
    }
  }
  async _symlinkHosts() {
    try {
      const stats = fs.lstatSync(Hosty.userHostsPath)
      if (stats.isSymbolicLink()) {
        return
      }
      await execAsync(`rm "${Hosty.userHostsPath}"`)
    } catch (e) {
      // not exists
    }

    if (Hosty.darwin) {
      const command = [
        `ln -s \\"${Hosty.hostsPath}\\" \\"${Hosty.userHostsPath}\\"`,
        `chmod 666 \\"${Hosty.hostsPath}\\"`
      ].join('; ')
      await execAsync(`$SHELL -c "${command}"`)
    } else {
      const command = [
        `mklink "${Hosty.userHostsPath}" "${Hosty.hostsPath}"`,
        `cacls "${Hosty.hostsPath}" /e /g Users:w`
      ].join(' && ')
      await execAsync(`cmd /c ${command}`)
    }
  }
  async _syncAsync() {
    return new Promise((resolve, reject) => {
      this._sync((e) => {
        if (e) {
          return reject(e)
        }
        resolve()
      })
    })
  }
  _sync(callback = () => {}) {
    try {
      const begin = '## hosty begin ##'
      const end = '## hosty end ##'

      const content = fs.readFileSync(Hosty.userHostsPath, Hosty.charset)

      let newContent = this.validHosts
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

      fs.writeFileSync(Hosty.userHostsPath, newContent, Hosty.charset)
      callback()
    } catch (e) {
      callback(e)
    }
  }
  async initialize(data) {
    this.data = data
    await this._createHosts()
    await this._symlinkHosts()
    await this._syncAsync()
  }
  async finalize() {
    this.data = []
    await this._syncAsync()
  }
  load(filepath) {
    const json = fs.readFileSync(filepath, Hosty.charset)
    this.data = JSON.parse(json)
  }
  save(filepath) {
    const json = JSON.stringify(this.data)
    fs.writeFileSync(filepath, json, Hosty.charset)
  }
}
