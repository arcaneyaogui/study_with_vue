import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
// 导入全局样式
import './assets/CSS/global.css'
/**
 * 添加到vue.prototype.$http后
 * 可以在每一个组件上通过 this.$http 获取axios 
 * 不必每个页面都 import axios , $http是自定义的属性名
 */
import axios from 'axios'
// 配置根目录
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
Vue.prototype.$http = axios;


Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
