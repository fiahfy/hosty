module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:vue/recommended'
  ],
  rules: {
    'vue/max-attributes-per-line': 'off'
  }
}
