import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home'),
    redirect: '/welcome',
    children: [
      { path: '/', redirect: '/welcome' },
      { path: '/fans', name: 'fans', component: () => import('@/views/fans') },
      { path: '/material', name: 'material', component: () => import('@/views/material') },
      { path: '/welcome', name: 'welcome', component: () => import('@/views/welcome') },
      { path: '/articleedit/:aid', name: 'articleedit', component: () => import('@/views/articleedit') },
      { path: '/article', name: 'article', component: () => import('@/views/article') },
      { path: '/articleadd', name: 'articleadd', component: () => import('@/views/articleadd') },
      { path: '/account', name: 'account', component: () => import('@/views/account') }
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
  NProgress.start();
  let userInfo = window.sessionStorage.getItem('userinfo')
  // console.log(userInfo)
  // 此时开始判断
  if (!userInfo && to.path !== '/login') {
    return next('/login')
  }
  // 条件不符合就直接放行即可
  next()
})
// 这里用到了一个后置路由守卫,当路由守卫结束之后,做的一些事情
router.afterEach((to,from)=>{
  NProgress.done()
})

export default router
