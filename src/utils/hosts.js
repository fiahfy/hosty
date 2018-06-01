import fs from 'fs'
import path from 'path'
import { remote } from 'electron'
import * as sudoPrompt from 'sudo-prompt'

const isDev = process.env.NODE_ENV !== 'production'
const isWin = process.platform === 'win32'

const hostyFile = {
  charset: 'utf8',
  extension: '.hosty'
}
const hostySection = {
  begin: '## hosty begin ##',
  end: '## hosty end ##'
}

const hostsFilepath = (() => {
  if (isDev) {
    return path.join(process.cwd(), 'dummyHosts')
  }
  return isWin ? 'C:\\Windows\\System32\\drivers\\etc\\hosts' : '/etc/hosts'
})()
const userHostsFilepath = path.join(remote.app.getPath('userData'), 'hosts')

const promptOptions = { name: 'Hosty' }

const sudo = async (command) => {
  return new Promise((resolve, reject) => {
    sudoPrompt.exec(command, promptOptions, (error, stdout, stderr) => {
      if (error) {
        console.error('Sudo prompt exec failed: %o', { command, error, stdout, stderr }) // eslint-disable-line no-console
        reject(error)
        return
      }
      resolve()
    })
  })
}

const setupHosts = async () => {
  try {
    const stats = fs.lstatSync(hostsFilepath)
    if (!stats.isSymbolicLink()) {
      return
    }
    await sudo(`rm "${hostsFilepath}"`)
  } catch (e) {
    //
  }
  if (isWin) {
    const command = [
      `touch "${hostsFilepath}"`,
      `cacls "${hostsFilepath}" /e /g Users:w`
    ].join(' && ')
    await sudo(`cmd /c ${command}`)
  } else {
    const command = [
      `touch \\"${hostsFilepath}\\"`,
      `chmod 666 \\"${hostsFilepath}\\"`
    ].join('; ')
    await sudo(`$SHELL -c "${command}"`)
  }
}

const setupUserHosts = async () => {
  try {
    const stats = fs.lstatSync(userHostsFilepath)
    if (stats.isSymbolicLink()) {
      return
    }
    await sudo(`rm "${userHostsFilepath}"`)
  } catch (e) {
    //
  }
  if (isWin) {
    const command = [
      `mklink "${userHostsFilepath}" "${hostsFilepath}"`,
      `cacls "${hostsFilepath}" /e /g Users:w`
    ].join(' && ')
    await sudo(`cmd /c ${command}`)
  } else {
    const command = [
      `ln -s \\"${hostsFilepath}\\" \\"${userHostsFilepath}\\"`,
      `chmod 666 \\"${hostsFilepath}\\"`
    ].join('; ')
    await sudo(`$SHELL -c "${command}"`)
  }
}

const isOldFormat = (groups) => {
  if (!Array.isArray(groups) || !groups.length) {
    return false
  }
  return groups[0].enable !== undefined
}

const migrate = (groups) => {
  return groups.map((group) => {
    return {
      id: group.id,
      disabled: !group.enable,
      name: group.name,
      hosts: group.hosts.map((host) => {
        return {
          id: host.id,
          disabled: !host.enable,
          ip: host.ip,
          name: host.host
        }
      })
    }
  })
}

export const setup = async () => {
  await setupHosts()
  await setupUserHosts()
}

export const sync = (hosts = []) => {
  const data = fs.readFileSync(userHostsFilepath, hostyFile.charset)

  let newData = hosts
    .map((host) => `${host.ip}\t${host.name}`)
    .join('\n')
  newData = `${hostySection.begin}\n${newData}\n${hostySection.end}\n`

  const reg = new RegExp(
    String.raw`([\s\S]*\n?)${hostySection.begin}\n[\s\S]*\n${hostySection.end}\n?([\s\S]*)`,
    'im'
  )
  const matches = data.match(reg)
  if (matches) {
    newData = matches[1] + newData + matches[2]
  } else {
    newData = `${data}\n${newData}`
  }

  fs.writeFileSync(userHostsFilepath, newData, hostyFile.charset)
}

export const exit = () => {
  sync()
}

export const read = (filepath) => {
  const data = fs.readFileSync(filepath, hostyFile.charset)
  const obj = JSON.parse(data)
  // TODO: remove this
  if (isOldFormat(obj)) {
    return migrate(obj)
  }
  return obj
}

export const write = (filepath, obj) => {
  const data = JSON.stringify(obj)
  fs.writeFileSync(filepath, data, hostyFile.charset)
}
