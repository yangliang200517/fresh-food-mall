<script setup>
import { ref } from 'vue'
import navBar from '@/components/navBar.vue'
import { useRoute, useRouter } from 'vue-router'
import { addPayOrder } from '@/api/orders'
import { showSuccessToast } from 'vant'
import { useUserInfoStore } from '@/stores/userinfo'
import _ from 'lodash'

const route = useRoute()
const router = useRouter()
const userInfoStore = useUserInfoStore()

const checked = ref('1')
// 总价格显示
const priceCount = () => {
  return Number(route.query.priceCount).toFixed(2)
}

const type = () => {
  return route.query.type
}
// 购物车的信息
const cartId = () => {
  return route.query.cartId
}
// 立即购买的信息
const productId = () => {
  return route.query.productId
}
const quantity = () => {
  return route.query.quantity
}
const userId = () => {
  return userInfoStore.users.user_id
}

// 确定按钮
const showPay = ref(false)
const payLogin = ref(false)

// 确认付款
const isPay = () => {
  payLogin.value = true

  const isPayLogin = setTimeout(() => {
    payLogin.value = false
    showPay.value = true
  }, 1000)

  clearTimeout(() => {
    isPayLogin
  })
}

// 立即支付
const goPay = async () => {
  if (type() === 'cart') {
    const res = await addPayOrder(type(), {
      cartId: cartId(),
      userId: userId()
    })
    console.log(res)
  } else if (type() === 'menu') {
    const res = await addPayOrder(type(), {
      userId: userId(),
      productId: productId(),
      quantity: quantity()
    })
    console.log(res)
  } else {
    console.log('错了')
  }

  setTimeout(() => {
    showSuccessToast('支付成功')
  }, 1100)
  setTimeout(() => {
    router.push('/order/type/1')
  }, 1500)
}
const debouncedGoPay = _.debounce(goPay, 1000)
</script>
<template>
  <!-- 标题 -->
  <navBar :isShow="true">
    <template #title>生鲜收银台</template>
    <template #left>
      <van-icon name="arrow-left" size="18" />
    </template>
  </navBar>
  <!-- 价钱显示 -->
  <van-row>
    <van-col class="price" span="24">{{ priceCount() }}</van-col>
  </van-row>
  <!-- 支付方式 -->
  <van-row class="pay_style">
    <van-col span="24">
      <van-cell title="支付方式" />
    </van-col>
    <van-col span="24">
      <van-radio-group v-model="checked">
        <van-cell-group inset>
          <van-cell title="微信支付" clickable @click="checked = '1'">
            <template #icon>
              <van-icon name="wechat-pay" color="#00a74c" size="25" />
            </template>
            <template #right-icon>
              <van-radio name="1" />
            </template>
          </van-cell>
          <van-cell title="支付宝支付" clickable @click="checked = '2'">
            <template #icon>
              <van-icon name="alipay" color="#1989fa" size="25" />
            </template>
            <template #right-icon>
              <van-radio name="2" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-col>
  </van-row>
  <!-- 确定按钮 -->
  <van-row class="btn_position">
    <van-col span="24">
      <van-button type="primary" round block @click="isPay">确认付款</van-button>
    </van-col>
  </van-row>

  <!-- 支付加载 -->
  <van-toast
    v-model:show="payLogin"
    :forbidClick="true"
    style="height: 100px; width: 100px"
  >
    <template #message>
      <van-row>
        <van-col span="24" class="toast_style">
          <van-icon :name="checked === '1' ? 'wechat-pay' : 'alipay'" size="35" />
        </van-col>
        <van-col span="24" class="toast_text_style">
          {{ checked === '1' ? '微信支付' : '支付宝支付' }}
        </van-col>
        <van-col span="24">
          <span class="jump-dots" v-for="item in 3" :key="item"></span>
        </van-col>
      </van-row>
    </template>
  </van-toast>

  <!-- 立即支付弹窗 -->
  <van-popup v-model:show="showPay" round closeable position="bottom">
    <template #default>
      <van-row>
        <van-col span="24">
          <!-- 标题 -->
          <van-row>
            <van-col span="24">
              <van-nav-bar :title="checked === '1' ? '微信支付' : '支付宝支付'" />
            </van-col>
          </van-row>
          <!-- 总价展示 -->
          <van-row>
            <van-col class="price_pay" span="24">
              {{ priceCount() }}
            </van-col>
          </van-row>
          <!-- 收款方 -->
          <van-row>
            <van-col span="24">
              <van-cell title="收款方" value="生鲜商城" />
            </van-col>
          </van-row>
          <!-- 付款按钮 -->
          <van-row class="pay_btn">
            <van-col span="24">
              <van-button type="primary" round block @click="debouncedGoPay"
                >立即支付</van-button
              >
            </van-col>
          </van-row>
        </van-col>
      </van-row>
    </template>
  </van-popup>
</template>
<style lang="less" scoped>
.price,
.price_pay {
  display: inline-block;
  font-size: 25px;
  font-weight: 600;
  text-align: center;
  color: red;
  &::before {
    content: '￥';
    font-size: 16px;
    vertical-align: middle; // 垂直居中对齐
  }
}
.price {
  padding: 40px 0;
}
.price_pay {
  padding: 30px 0;
}
.pay_style {
  margin: 0 10px;
  border-radius: 8px;
  background-color: #ffffff;
  overflow: hidden;
}
.van-cell-group--inset {
  margin: 0;
}
.van-icon {
  margin-right: 5px;
}
.van-cell {
  align-items: center;
}
.btn_position {
  position: fixed;
  width: 100%;
  bottom: 20px;
  padding: 0 10px;
}
.jump-dots {
  display: inline-block;
  width: 5px;
  height: 5px;
  background-color: #ccc;
  border-radius: 50%;
  margin-left: 5px;
  opacity: 0.3;
  animation: highlightAnimation 1s infinite;
}

.jump-dots:nth-child(1) {
  animation-delay: 0s;
}

.jump-dots:nth-child(2) {
  animation-delay: 0.2s;
}

.jump-dots:nth-child(3) {
  animation-delay: 0.5s;
}

@keyframes highlightAnimation {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
.toast_style {
  margin-bottom: 15px;
}
.toast_text_style {
  font-size: 15px;
}
.pay_btn {
  margin: 100px 10px 40px 10px;
}
</style>
