import Vue from 'vue'
// 导入axios
import axios from 'axios'
import router from '@/router'
import JSONbig from 'json-bigint'
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
  // 由于这个登录时间有要求限制,所以这里需要对其进行判断
  // console.log(error)
  if (error.response.status === 401) {
    // 强制登录
    router.push({ name: 'login' })
  }
})
// 由于js使用的数字大小有限,这里传递的还是number类型的参数,所以这里我们需要对参数进行额外的处理
// 我们需要在数据响应回来之后对数据进行单独的处理,所以这里我们应该
axios.defaults.transformResponse = [function (data) {
  // 服务器端返回给客户端的data数据主要就两种类型
  // 1) 字符串对象  '{xx:xx...}'
  // 2) 空字符串   ''
  // 在此处要利用JSONbig对返回的信息加以处理，如果不处理，系统默认是通过JSON.parse()给处理的
  // 这样大数字就错误了
  if (data) {
    return JSONbig.parse(data)
  } else {
    return data
  }
}]
Vue.prototype.$http = axios
