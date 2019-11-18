import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/font/iconfont.css'
import '@/assets/css/gobal.css'
import '@/utils/elt.js'
// 由于大量的axios在main.js文件中,所以这里可能会出现代码不整洁的情况,所以这里把所有的axios请求都单独的设置出去
import '../src/utils/ax.js'
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
