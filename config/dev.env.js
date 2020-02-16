'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // base api
  VUE_APP_BASE_API: '"http://api-node.tony93-dev.top"',
  // VUE_APP_BASE_API: '"http://api-node.tony93.top"',
  // 图片等资源的域名地址
  VUE_APP_STORE: '"http://store.tony93-dev.top"',
  // VUE_APP_STORE: '"http://store.tony93.top"',
  // 注册中心地址
  VUE_APP_REGISTER: '"http://localhost:9527"',
  // 阅读器地址
  VUE_APP_READER: '"http://localhost:8080"'
})
