import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useUserInfoStore } from '@/stores/userinfo'
import { useSearchStore } from '@/stores/search'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { showConfirmDialog } from 'vant'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/views/home/index.vue'),
      children: [
        {
          path: '/home',
          component: () => import('@/views/home/homeView.vue')
        },
        {
          path: '/fenlei',
          component: () => import('@/views/home/fenleiView.vue')
        },
        {
          path: '/cart',
          component: () => import('@/views/home/cartView.vue')
        },
        {
          path: '/user',
          component: () => import('@/views/home/userView.vue')
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/login/loginView.vue')
    },
    {
      path: '/user/userimage',
      component: () => import('@/views/userpage/userViewImage.vue')
    },
    {
      path: '/user/userpwd',
      component: () => import('@/views/userpage/userViewPwd.vue')
    },
    {
      path: '/user/usermessage',
      component: () => import('@/views/userpage/userViewMessage.vue')
    },
    {
      path: '/goods/detail/:id',
      component: () => import('@/views/goodsdetail/detailView.vue')
    },
    {
      path: '/goods/comment/:id',
      name: 'goodsComment',
      component: () => import('@/views/goodsdetail/commentView.vue')
    },
    {
      path: '/search',
      component: () => import('@/views/search/searchView.vue')
    },
    {
      path: '/searchlist/:text',
      component: () => import('@/views/search/searchList.vue')
    },
    {
      path: '/order',
      component: () => import('@/views/orders/orderView.vue')
    },
    {
      path: '/order/prices',
      component: () => import('@/views/orders/pricesView.vue')
    },
    {
      path: '/order/type/:id',
      component: () => import('@/views/orders/orderTypeView.vue')
    },
    {
      path: '/order/start',
      component: () => import('@/views/orders/orderStartView.vue')
    },
    {
      path: '/order/comment/:type',
      component: () => import('@/views/orders/orderComment.vue')
    },
    {
      path: '/order/sevice',
      component: () => import('@/views/orders/serviceView.vue')
    },
    {
      path: '/address',
      component: () => import('@/views/address/addressView.vue')
    },
    {
      path: '/update/address',
      component: () => import('@/views/address/updateAddress.vue')
    }
  ]
})

// 定义访问权限页面数组
// const pathToken = ['/cart']

// 登录访问拦截 -- 跳转路由之前做些什么事
router.beforeEach((to) => {
  const userStore = useUserStore()
  const userInfoStore = useUserInfoStore()
  const searchStore = useSearchStore()
  const cartStore = useCartStore()
  const orderStore = useOrderStore()
  const tokenOut = userStore.tokenOut

  const clearUserDatas = async () => {
    userStore.removeToken()
    userStore.removeTokenOut()
    userInfoStore.removeUserData()
    cartStore.cartList = []
    cartStore.selCartList = []
    cartStore.cartListId = []
    orderStore.orderLengths = []
    searchStore.clearSearchData()
  }

  // 访问的页面
  if (to.path) {
    const expirationTime = new Date(tokenOut)
    const currentTime = new Date()
    const isShow = ref(true)

    // 如果当前时间晚于过期时间，则 token 已过期
    if (currentTime > expirationTime && to.path !== '/login') {
      // token 已过期，可以在这里执行一些操作，比如清除 token 并跳转到登录页
      if (isShow.value === true) {
        showConfirmDialog({
          message: '授权过期，是否重新登录？'
        })
          .then(() => {
            clearUserDatas()
            return router.push('/login')
          })
          .catch(() => {
            clearUserDatas()
            isShow.value = !isShow.value
          })
      }
    } else {
      // token 未过期，继续正常路由跳转
      return true
    }
  } else if (!userStore.token && to.path !== 'login') {
    // 否则判断有没有登录
    // next('/login')
    return router.push('/login')
  }
})

export default router
