import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入插件配置
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体文件
import './assets/fonts/iconfont.css'
import axios from 'axios'

// 配置请求的base接口地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 绑定axios到Vue根实例上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
