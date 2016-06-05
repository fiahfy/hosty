import fs from 'fs'
import path from 'path'
import {remote} from 'electron'
import sudo from 'electron-sudo'

const app = remote.app

const BEGIN_SECTION = '##hosty begin'
const END_SECTION   = '##hosty end'

const DEBUG_HOSTS = true
const HOSTS_OSX = '/etc/hosts'
const HOSTS_WINDOWS = 'C:¥Windows¥System32¥drivers¥etc¥hosts'
const HOSTS_DUMMY = path.join(process.cwd(), 'dummyHosts')
const HOSTS = DEBUG_HOSTS ? HOSTS_DUMMY : process.platform === 'win32' ? HOSTS_WINDOWS : HOSTS_OSX
const TEMP_HOSTS = path.join(app.getPath('temp'), 'hosts')
const HOSTS_CHARSET = 'utf8'


export default store => next => action => {
  next(action)
  const hosts = store.getState()['hosts']
  HostsManager.save(hosts)
}

class HostsManager {
  static save(hosts) {
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
        let newData = `${BEGIN_SECTION}\n` + buildHosts(hosts) + `\n${END_SECTION}\n`

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
            resolve(hosts)
          })
        })
      })
      .then(hosts => {
        return new Promise((resolve, reject) => {
          const options = {
            name: app.getName(),
            // icns: '/path/to/icns/file' // (optional, only for MacOS),
            process: {
              // options: {
              //   // Can use custom environment variables for your privileged subprocess
              //   env: {'VAR': 'VALUE'}
              //   // ... and all other subprocess options described here
              //   // https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
              // },
              on: ps => {
                // ps.stdout.on('data', data => {
                //   resolve(hosts)
                // })
                setTimeout(function() {
                  ps.kill()
                }.bind(ps), 50000)
              }
            }
          }
          sudo.exec(`cp ${TEMP_HOSTS} ${HOSTS}`, options, err => {
            if (err) {
              reject(err)
              return
            }
            resolve(hosts)
          })
        })
      })
      .catch(err => {
        console.error(err)
      })
  }
}

function parseHosts(data) {
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

function buildHosts(hosts) {
  return hosts.map(item => {
    return (item.enable ? '' : '#')
      + item.ip + '\t'
      + item.host
  }).join('\n')
}
