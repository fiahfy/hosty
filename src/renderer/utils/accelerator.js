const orders = [
  'Shift',
  'CmdOrCtrl'
]

const darwin = process.platform === 'darwin'

const sortKey = (a, b) => {
  a = orders.indexOf(a)
  b = orders.indexOf(b)
  a = a === -1 ? Infinity : a
  b = b === -1 ? Infinity : b
  if (a > b) {
    return 1
  } else if (a < b) {
    return -1
  } else {
    return 0
  }
}

export const buildText = (accelerator) => {
  const keys = accelerator.split('+')
  const seperator = darwin ? '' : '+'
  return keys.sort(sortKey).map(key => {
    switch (key) {
      case 'Shift': return darwin ? '⇧' : key
      case 'CmdOrCtrl': return darwin ? '⌘' : 'Ctrl'
      case 'Up': return darwin ? '↑' : key
      case 'Down': return darwin ? '↓' : key
      case 'Left': return darwin ? '←' : key
      case 'Right': return darwin ? '→' : key
      case 'Enter': return darwin ? '↩' : key
      case 'Esc': return darwin ? '⎋' : key
      case 'Plus': return '+'
      default:
        return key
    }
  }).join(seperator)
}
