import fs from 'fs'
import storage from 'electron-json-storage'
import {remote} from 'electron'
import sudo from 'electron-sudo'

const app = remote.app

export const READED_HOSTS = 'READED_HOSTS'
export const WRITED_HOSTS = 'WRITED_HOSTS'
export const CREATE_HOST = 'CREATE_HOST'
export const UPDATE_HOST = 'UPDATE_HOST'

const BEGIN_SECTION = '##test begin'
const END_SECTION = '##test end'

// const HOSTS = '/etc/hosts'
const HOSTS = process.cwd() + '/dummyHosts'
const TEMP_HOSTS = app.getPath('temp') + 'hosts'
const HOSTS_CHARSET = 'utf8'

export function readHosts() {
  return dispatch => {
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
        const reg = new RegExp(String.raw`\n?${BEGIN_SECTION}\n([\s\S]*)\n${END_SECTION}\n?`, 'im')
        const matches = data.match(reg)
        const hostsData = matches ? matches[1] : ''
        // dispatch({
        //   type: READED_HOSTS,
        //   hosts: parseHosts(hostsData)
        // })
        return parseHosts(hostsData)
      })
      .catch(err => {
        console.error(err)
      })
  }
}

export function writeHosts(hosts) {
  return dispatch => {
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
            name: 'Your application name',
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
      .then(hosts => {
        dispatch({
          type: WRITED_HOSTS,
          hosts: hosts
        })
      })
      .catch(err => {
        console.error(err)
      })
  }
}

export function createHost(host) {
  return {
    type: CREATE_HOST,
    host
  }
}

export function updateHost(index, host) {
  return {
    type: UPDATE_HOST,
    index,
    host
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
