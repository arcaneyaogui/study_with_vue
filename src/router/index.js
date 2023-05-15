import Vue from 'vue'
import VueRouter from 'vue-router'
import loginPage from '../components/loginPage.vue'
import homePage from '../components/homePage.vue'
import welcomePage from '../components/welcomePage.vue'
import userPage from '../components/user/userPage.vue'
import rightsPage from '../components/power/rightsPage.vue'
import rolesPage from '../components/power/rolesPage.vue'

Vue.use(VueRouter)

const routes = [
  //默认访问login页面,重定向.
  {path: '/', redirect:'/login'},
  // 设置路由 , 路径和对应的组件
  {path:'/login', component:loginPage},
  {
    path:'/home', 
    name: 'homePage',
    component:homePage,
    redirect:'/welcomePage',
    children:[
      { path:'/welcomePage', component:welcomePage },
      { path:'/users', component:userPage },
      { path:'/rights', component:rightsPage },
      { path:'/roles', component:rolesPage },
    ]
  }
]

const router = new VueRouter({ routes })

router.beforeEach((to,form,next)=>{
  // next() 放行  next('路劲')强制跳转
  if(to.path === '/login') return next();
  // 获取token 判断是否登录
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next();
})

export default router
