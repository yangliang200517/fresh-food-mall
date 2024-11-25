import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useUserInfoStore } from '@/stores/userinfo'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/layout/HomeView.vue'),
      redirect: '/article/content',
      children: [
        {
          path: '/article/content',
          component: () => import('../views/fenlei/ArticleView.vue')
        },
        {
          path: '/goods/content',
          component: () => import('../views/goods/GoodsView.vue')
        },
        {
          path: '/goods/detail',
          component: () => import('../views/goods/GoodsDetailView.vue')
        },
        {
          path: '/home',
          component: () => import('../views/home/HomePage.vue')
        },
        {
          path: '/data',
          component: () => import('../views/data/DataModel.vue')
        },
        {
          path: '/consumer',
          component: () => import('../views/consumer/ConsumerView.vue')
        },
        {
          path: '/member',
          component: () => import('../views/member/MemberView.vue')
        },
        {
          path: '/user/mssage',
          component: () => import('../views/user/MssageView.vue')
        },
        {
          path: '/user/pic',
          component: () => import('../views/user/PicView.vue')
        },
        {
          path: '/user/password',
          component: () => import('../views/user/PasswordView.vue')
        }
      ]
    },
    {
      path: '/login',
      component: () => import('../views/login/LoginView.vue')
    },
    {
      path: '/forgetpwd',
      component: () => import('../views/login/forGetPassword.vue')
    }
  ]
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  const userInfoStore = useUserInfoStore()
  const tokenOut = userStore.dataToken

  if (to.path) {
    const expirationTime = new Date(tokenOut)
    const currentTime = new Date()
    const isShow = ref(true)

    // 如果当前时间晚于过期时间，则 token 已过期
    if (currentTime > expirationTime && to.path !== '/login') {
      // token 已过期，可以在这里执行一些操作，比如清除 token 并跳转到登录页
      if (isShow.value === true) {
        ElMessageBox.confirm('登录过期，请重新登录！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            userStore.removeToken()
            userStore.removeDataToken()
            userInfoStore.setUserInfo({})
            return router.push('/login')
          })
          .catch(() => {
            userStore.removeToken()
            userStore.removeDataToken()
            userInfoStore.setUserInfo({})
            isShow.value = !isShow.value
            return router.push('/login')
          })
      }
    } else {
      // token 未过期，继续正常路由跳转
      if (to.path === '/login' && userStore.token) {
        return '/' // 如果已登录且访问登录页面，则重定向到主页或其他页面
      } else {
        return true // 否则继续正常导航
      }
    }
  } else if (!userStore.token && to.path !== '/login') {
    // 否则判断有没有登录
    return router.push('/login')
  } else {
    return true
  }
})

export default router
