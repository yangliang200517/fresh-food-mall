<script setup>
import navBar from '@/components/navBar.vue'
import orderItem from '@/components/orderItem.vue'
import { useUserInfoStore } from '@/stores/userinfo'
import { getAddress } from '@/api/address'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrder } from '@/api/orders'
import { showToast } from 'vant'

const userInfoStore = useUserInfoStore()
const route = useRoute()
const router = useRouter()

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
const stock = () => {
  return route.query.stock
}

// 获取地址
const address = ref([])
const addressNoe = ref({})
const getUserAddress = async () => {
  const res = await getAddress(userInfoStore.users.user_id)
  address.value = res.data.addresList.map((item) => {
    item.is_default = item.is_default === 1 ? true : false
    return item
  })

  // 过滤，只显示默认地址
  addressNoe.value = address.value.filter((item) => item.is_default === true)[0]
}

// 判断地址 判断一下地址是否存在
const addMsg = ref('')
const isAddress = () => {
  if (address.value.length === 0) {
    addMsg.value = '您还没有配送地址'
    return false
  } else if (addressNoe.value === undefined) {
    addMsg.value = '请选择默认的配送地址'
    return false
  } else {
    return true
  }
}

// 拼接地址
const addAddress = () => {
  return addressNoe.value.state + addressNoe.value.city + addressNoe.value.region
}

// 获取订单数据
const orderList = ref([])
const orderListCount = ref(0)
const orderListPrice = ref(0)
const getOrderItem = async () => {
  // 购物车订单
  if (type() === 'cart') {
    const res = await getOrder(type(), {
      cartId: cartId()
    })
    orderList.value = res.data.orderList
    orderListCount.value = res.data.orderListCount
    orderListPrice.value = res.data.orderListPrice

    return
  }
  // 立刻购买订单
  if (type() === 'menu') {
    const res = await getOrder(type(), {
      productId: productId(),
      quantity: quantity()
    })
    console.log(res)
    orderList.value = res.data.orderList
    orderListCount.value = res.data.orderListCount
    orderListPrice.value = res.data.orderListPrice

    return
  }
}

// 提交订单
const onSubmit = () => {
  if (isAddress()) {
    router.push({
      path: '/order/prices',
      query: {
        priceCount: orderListPrice.value,
        type: type(),
        cartId: cartId(),
        productId: productId(),
        quantity: quantity(),
        stock: stock()
      }
    })
  } else {
    showToast(addMsg.value)
  }
}

onMounted(() => {
  getUserAddress()
  isAddress()
  getOrderItem()
})
</script>
<template>
  <!-- 标题 -->
  <navBar :isShow="true">
    <template #title> 填写订单 </template>
    <template #left>
      <van-icon name="arrow-left" size="18" />
    </template>
  </navBar>
  <van-space direction="vertical" fill :size="12">
    <!-- 地址显示 -->
    <van-row @click="router.push('/address')">
      <van-col span="24">
        <van-row class="address" v-if="isAddress()">
          <van-col span="21">
            <van-row>
              <van-col class="address_add addre_padd" span="24">{{
                addAddress()
              }}</van-col>
              <van-col class="address_addr addre_padd" span="24">{{
                addressNoe.street_address
              }}</van-col>
              <van-col class="address_name addre_padd" span="24"
                >{{ addressNoe.name }} {{ addressNoe.phone }}</van-col
              >
            </van-row>
          </van-col>
          <van-col class="address_arrow" span="3">
            <van-icon name="arrow" />
          </van-col>
        </van-row>
        <van-row class="address" v-else>
          <van-col class="not_address" span="21"> {{ addMsg }} </van-col>
          <van-col class="address_arrow" span="3">
            <van-icon name="arrow" />
          </van-col>
        </van-row>
      </van-col>
    </van-row>
    <!-- 订单展示 -->
    <orderItem v-for="item in orderList" :key="item.cart_id" :item="item"></orderItem>
  </van-space>
  <!-- 提交订单 -->
  <van-submit-bar
    text-align="left"
    :label="`共(${orderListCount})件生鲜，合计:`"
    :price="orderListPrice * 100"
    button-text="提交订单"
    @submit="onSubmit"
  />
</template>
<style lang="less" scoped>
.van-space {
  padding-bottom: 80px;
}
.not_address {
  font-size: 16px;
  padding: 10px 0;
}
.address {
  padding: 20px 5px 10px 20px;
  background-color: #fff;
  border-radius: 8px;
  .address_arrow {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .addre_padd {
    margin-bottom: 7px;
  }
  .address_add,
  .address_name {
    font-size: 13px;
  }
  .address_addr {
    font-weight: 700;
    font-size: 16px;
  }
}
</style>
