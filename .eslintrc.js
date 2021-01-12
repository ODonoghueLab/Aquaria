module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	"strict": "off",
	'no-unused-vars': 'off'
  },
  ignorePatterns: [
    'src/legacy/**/*.js',
    'public/javascripts/**/*.js'
  ],
}
