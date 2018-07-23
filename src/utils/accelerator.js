const orders = [
  'Alt',
  'Shift',
  'CommandOrControl',
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
      case 'Alt': return darwin ? '⌥' : key
      case 'Shift': return darwin ? '⇧' : key
      case 'CommandOrControl':
      case 'CmdOrCtrl':
        return darwin ? '⌘' : 'Ctrl'
      case 'Plus': return '+'
      case 'Backspace': return darwin ? '⌫' : key
      case 'Delete': return darwin ? '⌦' : key
      case 'Return':
      case 'Enter':
        return darwin ? '↩' : 'Enter'
      case 'Up': return darwin ? '↑' : key
      case 'Down': return darwin ? '↓' : key
      case 'Left': return darwin ? '←' : key
      case 'Right': return darwin ? '→' : key
      case 'Escape':
      case 'Esc':
        return darwin ? '⎋' : key
      default:
        return key
    }
  }).join(seperator)
}
