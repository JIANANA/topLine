import Vue from 'vue'
// 导入axios
import axios from 'axios'
// 配置公共根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 为了在其他的地方也方便使用,所以这里需要在原型上面绑定这个方法
// axios的请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么，例如加入token
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 如果直接判断的话可能就会出现userinfo不存在,这样可能就会报错(不存在token等指令)
  // 所以这里需要判断一下当前是否存在userinfo的值,如果存在再对其进行转换的相关操作
  if (userinfo) {
    userinfo = JSON.parse(userinfo).token
    // 这里主要是为了让axios在发过去请求的时候让请求头带着token指令对服务器进行访问,也就是添加认证
    config.headers.Authorization = 'Bearer ' + userinfo
    // console.log(config.headers)
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
Vue.prototype.$http = axios
