<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/stores/userinfo'
import navBar from '@/components/navBar.vue'
import serviceItem from '@/components/serviceItem.vue'
import { getServiceOrderItem } from '@/api/orders'

const router = useRouter()
const userInfoStore = useUserInfoStore()
const active = ref(0)

const userId = () => {
  return userInfoStore.users.user_id
}

// 获取售后指定订单
const serviceOrderList = ref([])
const getServiceOrder = async (productStatus, isType) => {
  const res = await getServiceOrderItem(userId(), productStatus, isType)
  serviceOrderList.value = res.data.orderList
  console.log(serviceOrderList.value)
}

const onClickTab = (val) => {
  if (val.name === 0) {
    getServiceOrder(2, val.name)
  } else if (val.name === 1) {
    getServiceOrder(4, val.name)
  }
}

// 切换选项
const goOkComm = () => {
  active.value = 1
  getServiceOrder(4, 1)
}

// 从子组件传递的事件，更新视图
const updateOrder = () => {
  getServiceOrder(2, 0)
}

onMounted(() => {
  getServiceOrder(2, 0)
})
</script>
<template>
  <!-- 标题 -->
  <navBar :isShow="true">
    <template #title>退换/售后</template>
    <template #left>
      <van-icon name="arrow-left" size="18" />
    </template>
  </navBar>
  <!-- 商品展示 -->
  <van-tabs
    v-model:active="active"
    @click-tab="onClickTab"
    :sticky="true"
    :offset-top="39"
  >
    <van-tab title="售后申请">
      <van-row v-if="serviceOrderList.length <= 0">
        <van-col span="24">
          <van-empty description="没有待售后的商品哦~~">
            <van-button round type="primary" class="bottom-button" @click="goOkComm"
              >查看以售后</van-button
            >
          </van-empty>
        </van-col>
      </van-row>
      <van-row class="service_item" v-else>
        <van-col span="24">
          <serviceItem
            v-for="item in serviceOrderList"
            :key="item.order_detail_id"
            :serviceOrder="item"
            :active="active"
            @update-order="updateOrder"
          ></serviceItem>
        </van-col>
      </van-row>
    </van-tab>
    <van-tab title="申请记录">
      <van-row v-if="serviceOrderList.length <= 0">
        <van-col span="24">
          <van-empty description="您还没有申请记录，快去逛逛吧~~">
            <van-button
              round
              type="primary"
              class="bottom-button"
              @click="router.push('/')"
              >去逛逛~</van-button
            >
          </van-empty>
        </van-col>
      </van-row>
      <van-row class="service_item" v-else>
        <van-col span="24">
          <serviceItem
            v-for="item in serviceOrderList"
            :key="item.order_detail_id"
            :serviceOrder="item"
            :active="active"
          ></serviceItem>
        </van-col>
      </van-row>
    </van-tab>
  </van-tabs>
</template>
<style lang="less" scoped>
.service_item {
  padding: 10px;
}
</style>
