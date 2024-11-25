<script setup>
import { onMounted, ref } from 'vue'
import navBar from '@/components/navBar.vue'
import orderType from '@/components/orderType.vue'
import { useUserInfoStore } from '@/stores/userinfo'
import { getPayOrder, getPayOrderOne } from '@/api/orders'
import { useRoute } from 'vue-router'

const route = useRoute()
const userInfoStore = useUserInfoStore()
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

const active = ref(0)
const tabsData = ref([
  {
    id: 0,
    title: '全部'
  },
  {
    id: 1,
    title: '待收获/使用'
  },
  {
    id: 2,
    title: '已完成'
  },
  {
    id: 3,
    title: '已取消'
  }
])

// 用户id
const userId = () => {
  return userInfoStore.users.user_id
}

const orderList = ref([])
let currentPage = 1
const pageSize = 5

const resetStates = () => {
  currentPage = 1
  orderList.value = []
  finished.value = false
}

const loadOrders = async (orderType) => {
  loading.value = true
  let res
  try {
    if (orderType === 0) {
      res = await getPayOrder(userId(), currentPage, pageSize)
      console.log(res)
    } else {
      res = await getPayOrderOne(userId(), orderType, currentPage, pageSize)
      console.log(res)
    }
    if (res.data.orderList.length > 0) {
      orderList.value.push(...res.data.orderList)
      currentPage++
    } else {
      finished.value = true
    }
  } catch (error) {
    console.error('Error fetching ', error)
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

// 下拉加载
const onLoad = () => {
  loadOrders(active.value)
}

// 下拉刷新
const onRefresh = () => {
  // 清空列表数据
  finished.value = false

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
  onLoad()
}

// tab栏切换
const onChangeTab = (val) => {
  active.value = val
  resetStates()
  loadOrders(active.value)
}

// 用户管理界面传递过来的路由id，点击哪个显示哪个
const tabView = () => {
  active.value = Number(route.params.id)
  loadOrders(active.value)
}

// 子组件发送监听事件，在父组件中更新视图，这个方法主要做的就是，当在子组件删除商品后，需要在父组件动态更新一下视图
const getNewOrder = (actives) => {
  onChangeTab(actives)
}

onMounted(() => {
  tabView()
})
</script>
<template>
  <!-- 标题 -->
  <navBar :isShow="true">
    <template #title>订单详情</template>
    <template #left>
      <van-icon name="arrow-left" size="18" />
    </template>
  </navBar>
  <!-- 订单展示 -->
  <van-row>
    <van-col span="24">
      <van-tabs
        v-model:active="active"
        @change="onChangeTab"
        swipeable
        :sticky="true"
        :offset-top="39"
      >
        <van-tab v-for="item in tabsData" :title="item.title" :key="item.id">
          <van-row>
            <van-col ref="containerRef" span="24" v-if="orderList.length > 0">
              <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list
                  v-model:loading="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onLoad"
                  offset="5"
                >
                  <template #default>
                    <order-type
                      v-for="items in orderList"
                      :key="items.order_detail_id"
                      :order="items"
                      :userId="userId()"
                      @updata-order="getNewOrder(active)"
                    ></order-type>
                  </template>
                </van-list> </van-pull-refresh
            ></van-col>
            <van-col span="24" v-else
              ><van-empty description="您还没有相关订单"
            /></van-col>
          </van-row>
        </van-tab>
      </van-tabs>
    </van-col>
  </van-row>
</template>
<style lang="less" scoped></style>
