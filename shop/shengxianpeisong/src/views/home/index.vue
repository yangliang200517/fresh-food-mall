<script setup>
import { onMounted, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { useUserInfoStore } from '@/stores/userinfo'

const cartStore = useCartStore()
const userStore = useUserStore()
const userInfoStore = useUserInfoStore()

const isLogin = () => {
  return userStore.token
}
// 因为一登陆没有在全局获取用户信息，所以在这里获取一下
const userInfo = () => {
  return userInfoStore.getUserData()
}

const showBadge = () => {
  if (!isLogin()) {
    return null
  } else {
    if (cartStore.cartListId.length === 0) {
      return null
    } else {
      return cartStore.cartListId.length
    }
  }
}

onMounted(async () => {
  if (isLogin()) {
    userInfo()
    // 这里加个定时器是因为用户信息中的id获取不到，所以无法获取购物车数量，加上延时延迟一会儿就可以获取到了
    setTimeout(() => {
      cartStore.getCartData()
      cartStore.cartListId
    }, 200)
  }
})

const active = ref(0)
</script>

<template>
  <router-view></router-view>

  <van-tabbar v-model="active" route>
    <van-tabbar-item replace to="/home" icon="wap-home">首页</van-tabbar-item>
    <van-tabbar-item replace to="/fenlei" icon="list-switching">分类</van-tabbar-item>
    <van-tabbar-item replace to="/cart" icon="shopping-cart" :badge="showBadge()"
      >购物车</van-tabbar-item
    >
    <van-tabbar-item replace to="/user" icon="user">我的生鲜</van-tabbar-item>
  </van-tabbar>
</template>

<style scoped></style>
