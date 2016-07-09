import fs from 'fs'
import path from 'path'
import {app as mainApp, remote} from 'electron'
import runas from 'runas'
import validator from 'validator'
import isRenderer from 'is-electron-renderer'

const app = isRenderer ? remote.app : mainApp

const BEGIN_SECTION = '## hosty begin ##'
const END_SECTION   = '## hosty end ##'

const DEBUG_HOSTS = process.env.NODE_ENV === 'development'
const HOSTS_OSX = '/etc/hosts'
const HOSTS_WINDOWS = 'C:¥Windows¥System32¥drivers¥etc¥hosts'
const HOSTS_DUMMY = path.join(process.cwd(), 'dummyHosts')
const HOSTS = DEBUG_HOSTS ? HOSTS_DUMMY : process.platform === 'win32' ? HOSTS_WINDOWS : HOSTS_OSX
const USER_HOSTS = path.join(app.getPath('userData'), 'hosts')
const HOSTS_CHARSET = 'utf8'

const HostsFile = new (class  {
  read() {
    try {
      return fs.readFileSync(USER_HOSTS, HOSTS_CHARSET)
    } catch (e) {
      throw e
    }
  }
  write(data) {
    try {
      fs.writeFileSync(USER_HOSTS, data, HOSTS_CHARSET)
    } catch (e) {
      throw e
    }
  }
})

export default class HostsManager {
  createSymlink() {
    try {
      const stats = fs.lstatSync(HOSTS)
      if (stats.isSymbolicLink()) {
        return
      }
    } catch (e) {
      throw new Error(`${HOSTS} is nothing`)
    }
    if (runas('/bin/cp', ['-f', HOSTS, USER_HOSTS], {admin: !DEBUG_HOSTS})) {
      throw new Error(`Failed to copy ${HOSTS} to ${USER_HOSTS}`)
    }
    if (runas('/bin/chmod', ['666', USER_HOSTS], {admin: !DEBUG_HOSTS})) {
      throw new Error(`Failed to chmod ${USER_HOSTS}`)
    }
    if (runas('/bin/rm', [HOSTS], {admin: !DEBUG_HOSTS})) {
      throw new Error(`Failed to delete ${HOSTS}`)
    }
    if (runas('/bin/ln', ['-s', USER_HOSTS, HOSTS], {admin: !DEBUG_HOSTS})) {
      throw new Error(`Failed to symlink ${USER_HOSTS} to ${HOSTS}`)
    }
  }
  save(groups) {
    const data = HostsFile.read()

    let newData = `${BEGIN_SECTION}\n` + this.buildGroups(groups) + `\n${END_SECTION}\n`

    const reg = new RegExp(String.raw`([\s\S]*\n?)${BEGIN_SECTION}\n[\s\S]*\n${END_SECTION}\n?([\s\S]*)`, 'im')
    const matches = data.match(reg)
    if (matches) {
      newData = matches[1] + newData + matches[2]
    } else {
      newData = data + '\n' + newData
    }

    HostsFile.write(newData)
  }
  clear() {
    this.save([])
  }
  buildGroups(groups) {
    return groups.map(group => {
      if (!group.hosts) {
        return null
      }
      let hosts = group.hosts.concat()
      if (!group.enable) {
        hosts = hosts.map(host => {
          const newHost = Object.assign({}, host)
          newHost.enable = false
          return newHost
        })
      }
      const data = this.buildHosts(hosts)
      if (!data) {
        return null
      }
      return data
    }).filter(item => !!item).join('\n')
  }
  buildHosts(hosts) {
    return hosts.filter(host => isValidHost(host)).map(item => {
      return (item.enable ? '' : '#')
        + item.ip + '\t'
        + item.host
    }).join('\n')
  }
  parseHosts(data) {
    return data
      .split('\n')
      .map(item => {
        const matches = item.match(/^([#\s]*)(.*)\t(.*)/i)
        if (!matches) {
          return null
        }
        return {
          enable: !matches[1],
          ip: matches[2],
          host: matches[3]
        }
      }).filter(item => !!item)
  }
}

export default new HostsManager

function isValidHost(host) {
  if (!host.host || !host.host.length) {
    return false
  }
  if (!host.ip || !host.ip.length) {
    return false
  }
  if (!validator.isIP(host.ip)) {
    return false
  }
  return true
}
