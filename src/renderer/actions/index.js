import fs from 'fs'
import storage from 'electron-json-storage'
import remote from 'remote'

export const READED_HOSTS = 'READED_HOSTS'
export const WRITED_HOSTS = 'WRITED_HOSTS'
export const ADD_HOST = 'ADD_HOST'

const BEGIN_SECTION = '##test begin'
const END_SECTION = '##test end'

export function readHosts() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      fs.readFile('/etc/hosts', 'utf8', (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
      // storage.get('hosts', (err, data) => {
      //   if (err) {
      //     reject(err)
      //     return
      //   }
      //   if (!Array.isArray(data)) {
      //     data = []
      //   }
      //   resolve(data)
      // })
    })
      .then(data => {
        dispatch({
          type: READED_HOSTS,
          hosts: parseHosts(data)
        })
      })
      .catch(err => {
        console.error(err)
      })
    // .denodeify(fs.readFile)('/etc/hosts')
    //   .then(data => {
    //     dispatch({
    //       type: READED_HOSTS,
    //       hosts: data
    //     })
    //   })
  }
}

export function writeHosts(hosts) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      fs.readFile('/etc/hosts', 'utf8', (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
      .then(data => {
        console.log(data)
        const reg = new RegExp(String.raw`([\s\S]*\n?)${BEGIN_SECTION}\n[\s\S]*\n${END_SECTION}\n?([\s\S]*)`, 'im')
        const matches = data.match(reg)
        const newData = matches[1] + buildHosts(hosts) + matches[2]
        console.log(newData)
        return new Promise((resolve, reject) => {
          fs.writeFile('/etc/hosts', newData, 'utf8', err => {
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

export function addHost(host) {
  return {
    type: ADD_HOST,
    host
  }
}

function parseHosts(data) {
  const reg = new RegExp(String.raw`\n?${BEGIN_SECTION}\n([\s\S]*)\n${END_SECTION}\n?`, 'im')
  const matches = data.match(reg)
  console.log(data)
  console.log(matches)
  return (matches[1] || '')
    .split('\n')
    .map(item => {
      const matches = item.match(/^([#\s]*)([\d\.]+)\t(.*)/i)
      console.log(matches)
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
  const data = hosts.map(item => {
    return (item.enable ? '' : '#')
      + item.ip + '\t'
      + item.host
  }).join('\n')
  return `${BEGIN_SECTION}\n${data}\n${END_SECTION}\n`
}
