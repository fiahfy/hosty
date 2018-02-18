import fs from 'fs'
import path from 'path'
import { app as mainApp, remote } from 'electron'
import * as sudoPrompt from 'sudo-prompt'
import isRenderer from 'is-electron-renderer'

const app = isRenderer ? remote.app : mainApp

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

const userHostsFilepath = path.join(app.getPath('userData'), 'hosts')
const hostsFilepath = (() => {
  if (isDev) {
    return path.join(process.cwd(), 'dummyHosts')
  }
  return isWin ? 'C:\\Windows\\System32\\drivers\\etc\\hosts' : '/etc/hosts'
})()

const promptOptions = { name: 'Hosty' }

const sudo = async (command) => {
  return new Promise((resolve, reject) => {
    sudoPrompt.exec(command, promptOptions, (error, stdout, stderr) => {
      if (error) {
        console.error('Sudo prompt failed: %o', { command, error, stdout, stderr }) // eslint-disable-line no-console
        reject(new Error('Sudo prompt failed'))
        return
      }
      resolve()
    })
  })
}

const setupHostsFile = async () => {
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
    const commands = [`touch "${hostsFilepath}"`, `cacls "${hostsFilepath}" /e /g Users:w`]
    const command = commands.join(' && ')
    await sudo(`cmd /c ${command}`)
  } else {
    const commands = [`touch \\"${hostsFilepath}\\"`, `chmod 666 \\"${hostsFilepath}\\"`]
    const command = commands.join('; ')
    await sudo(`$SHELL -c "${command}"`)
  }
}

const setupUserHostsFile = async () => {
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
    const commands = [`mklink "${userHostsFilepath}" "${hostsFilepath}"`, `cacls "${hostsFilepath}" /e /g Users:w`]
    const command = commands.join(' && ')
    await sudo(`cmd /c ${command}`)
  } else {
    const commands = [`ln -s \\"${hostsFilepath}\\" \\"${userHostsFilepath}\\"`, `chmod 666 \\"${hostsFilepath}\\"`]
    const command = commands.join('; ')
    await sudo(`$SHELL -c "${command}"`)
  }
}

const build = (groups) => {
  return groups
    .filter((group) => !group.disabled)
    .map((group) => (group.hosts || []).concat())
    .reduce((carry, hosts) => carry.concat(hosts), [])
    .filter((host) => !host.disabled)
    .sort((a, b) => {
      let result = 0
      if (a.ip > b.ip) {
        result = 1
      } else if (a.ip < b.ip) {
        result = -1
      }
      if (result !== 0) {
        return result
      }
      if (a.disabled > b.disabled) {
        result = 1
      } else if (a.disabled < b.disabled) {
        result = -1
      }
      if (result !== 0) {
        return result
      }
      if (a.name > b.name) {
        result = 1
      } else if (a.name < b.name) {
        result = -1
      }
    })
    .map((host) => `${host.ip}\t${host.name}`)
    .join('\n')
}

export const init = async () => {
  await setupHostsFile()
  await setupUserHostsFile()
}

export const save = async (groups = []) => {
  const data = fs.readFileSync(userHostsFilepath, hostyFile.charset)

  let newData = build(groups)
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

export const clear = () => {
  save()
}
