
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from 'store/store.js'
import { $http } from "@escook/request-miniprogram"
// 挂在$http 到uni上
uni.$http = $http
// 配置请求拦截器
$http.baseUrl = "https://www.uinav.com"
$http.beforeRequest = function (options) {
  uni.showLoading({
    "title": "加载中..."
  })
}
// 响应拦截器哦
$http.afterRequest = function (options) {
  uni.hideLoading()
}
// 封装轻提示方法
uni.$showMsg = function (title="数据加载失败", duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: "none"
  })
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    // 将store挂载到Vue实例上
    store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif