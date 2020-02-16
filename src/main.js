// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import router from './router'
import store from './store'
import meta from 'vue-meta'
import './icons'
import './style/index.less'
import './permission' // permission control
import { AlertPlugin, ToastPlugin, ConfirmPlugin } from 'vux'

Vue.use(AlertPlugin)
Vue.use(ToastPlugin, { position: 'top' })
Vue.use(ConfirmPlugin)
Vue.use(VueRouter)

FastClick.attach(document.body)

Vue.config.productionTip = false

Vue.use(meta)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
