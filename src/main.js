import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

// 导入axios 设置为全局对象
import axios from 'axios'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://120.131.15.111:8888/api/private/v1/'
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
