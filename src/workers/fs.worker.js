import fs from 'fs'

onmessage = ({ data: [method, args] }) => {
  const result = fs[method](...args)
  postMessage(result)
}
