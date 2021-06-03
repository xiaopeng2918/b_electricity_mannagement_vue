import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login/Login.vue'
import Home from '../views/Home/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  /* to 将要访问路径
    from 从哪个路径跳转来的
    next 一个回调函数，表示允许访问
     next() 放行 next('path') 跳转指定路径
   */
  if (to.path === '/login') return next()
  // 获取页面sessionStorage中token
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
