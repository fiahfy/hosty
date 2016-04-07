import fs from 'fs'
import storage from 'electron-json-storage'

export const READED_HOSTS = 'READED_HOSTS'
export const ADD_HOST = 'ADD_HOST'

export function readHosts() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      // fs.readFile('/etc/hosts', 'utf8', (err, data) => {
      //   if (err) {
      //     reject(err)
      //     return
      //   }
      //   resolve(data)
      // })
      storage.get('hosts', (err, data) => {
        if (err) {
          reject(err)
          return
        }
        if (!Array.isArray(data)) {
          data = []
        }
        resolve(data)
      })
    })
      .then(data => {
        dispatch({
          type: READED_HOSTS,
          hosts: data
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

export function addHost(host) {
  return dispatch => {
    dispatch({
      type: ADD_HOST,
      host
    })
    return new Promise((resolve, reject) => {
      storage.get('hosts', (err, data) => {
        if (err) {
          reject(err)
          return
        }
        if (!Array.isArray(data)) {
          data = []
        }
        resolve(data)
      })
    })
      .then(data => {
        return new Promise((resolve, reject) => {
          data.push(host)
          storage.set('hosts', data, err => {
            if (err) {
              reject(err)
              return
            }
            resolve(data)
          })
        })
      })
      .then(data => {
        dispatch({
          type: READED_HOSTS,
          hosts: data
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
