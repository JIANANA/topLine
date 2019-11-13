import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home'),
    redirect: '/welcome',
    children: [
      { path: '/welcome', name: 'welcome', component: () => import('@/views/welcome') },
      { path: '/', redirect: '/welcome' },
      { path: '/article', name: 'article', component: () => import('@/views/article') },
      { path: '/articleadd', name: 'articleadd', component: () => import('@/views/articleadd') }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 登录到后台页面之后,删除token值,此时该用户已经处于退出状态,这时再刷新页面就需要对跳转页面重新检验,我们这里采用的是路由守卫的方式
router.beforeEach((to, from, next) => {
  // 判断此时是否有token值,并且跳转的页面不是login页面,就跳转到登录页面
  // 去出存储的token值
  let userInfo = window.sessionStorage.getItem('userinfo')
  // console.log(userInfo)
  // 此时开始判断
  if (!userInfo && to.path !== '/login') {
    return next('/login')
  }
  // 条件不符合就直接放行即可
  next()
})
export default router
