import fs from 'fs'
import path from 'path'
import { remote } from 'electron'
import * as sudoPrompt from 'sudo-prompt'
import Package from '~~/package.json'

const isDev = process.env.NODE_ENV !== 'production'
const isWin = process.platform === 'win32'

const charset = 'utf8'

const section = {
  begin: '## hosty begin ##',
  end: '## hosty end ##'
}

const filepath = (() => {
  if (isDev) {
    return path.join(process.cwd(), 'hosts')
  }
  return isWin ? 'C:\\Windows\\System32\\drivers\\etc\\hosts' : '/etc/hosts'
})()
const userFilepath = path.join(remote.app.getPath('userData'), 'hosts')

const sudo = async (command) => {
  return new Promise((resolve, reject) => {
    sudoPrompt.exec(
      command,
      { name: Package.productName },
      (error, stdout, stderr) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Sudo prompt exec failed: %o', {
            command,
            error,
            stdout,
            stderr
          })
          reject(error)
          return
        }
        resolve()
      }
    )
  })
}

const grantPermission = async () => {
  try {
    const stats = fs.lstatSync(filepath)
    if (!stats.isSymbolicLink()) {
      return
    }
    await sudo(`rm "${filepath}"`)
  } catch (e) {
    //
  }
  if (isWin) {
    const command = [
      `touch "${filepath}"`,
      `cacls "${filepath}" /e /g Users:w`
    ].join(' && ')
    await sudo(`cmd /c ${command}`)
  } else {
    const command = [
      `touch \\"${filepath}\\"`,
      `chmod 666 \\"${filepath}\\"`
    ].join('; ')
    await sudo(`$SHELL -c "${command}"`)
  }
}

const createUserHosts = async () => {
  try {
    const stats = fs.lstatSync(userFilepath)
    if (stats.isSymbolicLink()) {
      return
    }
    await sudo(`rm "${userFilepath}"`)
  } catch (e) {
    //
  }
  if (isWin) {
    const command = [
      `mklink "${userFilepath}" "${filepath}"`,
      `cacls "${filepath}" /e /g Users:w`
    ].join(' && ')
    await sudo(`cmd /c ${command}`)
  } else {
    const command = [
      `ln -s \\"${filepath}\\" \\"${userFilepath}\\"`,
      `chmod 666 \\"${filepath}\\"`
    ].join('; ')
    await sudo(`$SHELL -c "${command}"`)
  }
}

export { filepath as path }

export const initialize = async () => {
  await grantPermission()
  await createUserHosts()
}

export const sync = (hosts = []) => {
  const data = fs.readFileSync(userFilepath, charset)

  let newData = hosts.map((host) => `${host.ip}\t${host.name}`).join('\n')
  newData = `${section.begin}\n${newData}\n${section.end}\n`

  const reg = new RegExp(
    String.raw`([\s\S]*\n?)${section.begin}\n[\s\S]*\n${
      section.end
    }\n?([\s\S]*)`,
    'im'
  )
  const matches = data.match(reg)
  if (matches) {
    newData = matches[1] + newData + matches[2]
  } else {
    newData = `${data}\n${newData}`
  }

  fs.writeFileSync(userFilepath, newData, charset)
}

export const finalize = () => {
  sync()
}

export const read = (filepath) => {
  const data = fs.readFileSync(filepath, charset)
  return JSON.parse(data)
}

export const write = (filepath, obj) => {
  const data = JSON.stringify(obj)
  fs.writeFileSync(filepath, data, charset)
}
