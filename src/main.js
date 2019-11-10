import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import '@/assets/css/gobal.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/font/iconfont.css'
// 导入axios
import axios from 'axios'
// 配置公共根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 为了在其他的地方也方便使用,所以这里需要在原型上面绑定这个方法
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
