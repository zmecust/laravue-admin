var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"https://api.laravue.org/api/v1"',
  URL: '"https://admin.laravue.org"',
})
