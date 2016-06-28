import fs from 'fs'
import path from 'path'
import {app as mainApp, remote} from 'electron'
import runas from 'runas'
import validator from 'validator'
import isRenderer from 'is-electron-renderer'

const app = isRenderer ? remote.app : mainApp

const BEGIN_SECTION = '##hosty begin'
const END_SECTION   = '##hosty end'

const DEBUG_HOSTS = true
const HOSTS_OSX = '/etc/hosts'
const HOSTS_WINDOWS = 'C:¥Windows¥System32¥drivers¥etc¥hosts'
const HOSTS_DUMMY = path.join(process.cwd(), 'dummyHosts')
const HOSTS = DEBUG_HOSTS ? HOSTS_DUMMY : process.platform === 'win32' ? HOSTS_WINDOWS : HOSTS_OSX
const TEMP_HOSTS = path.join(app.getPath('temp'), 'hosts')
const HOSTS_CHARSET = 'utf8'


export default class HostsManager {
  static save(groups) {
    return new Promise((resolve, reject) => {
      fs.readFile(HOSTS, HOSTS_CHARSET, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
      .then(data => {
        let newData = `${BEGIN_SECTION}\n` + HostsManager.buildHosts(groups) + `\n${END_SECTION}\n`

        const reg = new RegExp(String.raw`([\s\S]*\n?)${BEGIN_SECTION}\n[\s\S]*\n${END_SECTION}\n?([\s\S]*)`, 'im')
        const matches = data.match(reg)
        if (matches) {
          newData = matches[1] + newData + matches[2]
        } else {
          newData = data + '\n' + newData
        }

        return new Promise((resolve, reject) => {
          fs.writeFile(TEMP_HOSTS, newData, 'utf8', err => {
            if (err) {
              reject(err)
              return
            }
            resolve(groups)
          })
        })
      })
      .then(groups => {
        return new Promise((resolve, reject) => {
          runas('cp', [TEMP_HOSTS, HOSTS], {admin: !DEBUG_HOSTS})
          resolve(groups)
        })
      })
      .catch(err => {
        console.error(err)
      })
  }
  static buildHosts(groups) {
    return groups.map(group => {
      if (!group.hosts) {
        return ''
      }
      return group.hosts.filter(host => isValidHost(host)).map(item => {
        return (group.enable && item.enable ? '' : '#')
          + item.ip + '\t'
          + item.host
      }).join('\n')
    }).join('\n')
  }
  static parseHosts(data) {
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
