import Vue from 'vue'

import Cookies from 'js-cookie'
import VueSession from 'vue-session'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control

import * as filters from './filters' // global filters

import permission from '@/directive/permission/index.js' // 权限判断指令

import Print from '@/utils/print' // 打印

import request from '@/utils/request' // ajax

import * as message from '@/utils/message';


Vue.use(Print)

Vue.use(VueSession)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.directive('permission', permission)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
// // 定义全局方法
Vue.prototype.$http = request;
Vue.prototype.$info = message.info;
Vue.prototype.$success = message.success;
Vue.prototype.$warning = message.warning;
Vue.prototype.$error = message.error;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
