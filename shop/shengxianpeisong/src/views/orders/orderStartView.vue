<script setup>
import { onMounted, ref } from 'vue'
import navBar from '@/components/navBar.vue'
import commentOrder from '@/components/commentOrder.vue'
import { useUserInfoStore } from '@/stores/userinfo'
import { useOrderStore } from '@/stores/order'
import { useRouter, useRoute } from 'vue-router'

const userInfoStore = useUserInfoStore()
const orderStore = useOrderStore()
const router = useRouter()
const route = useRoute()
const active = ref(0)

const orderId = () => {
  return Number(route.query.orderId)
}

// 评价管权益
const startUser = ref([
  {
    id: 1,
    text: '双倍鲜豆'
  },
  {
    id: 2,
    text: '先用后付'
  },
  {
    id: 3,
    text: '优惠券'
  },
  {
    id: 4,
    text: '福利多多'
  },
  {
    id: 5,
    text: '免运费'
  }
])
// 用户评价
const userComment = ref([
  {
    id: 1,
    comm: '刘*满发布了1条评价',
    drow: '+5鲜豆'
  },
  {
    id: 2,
    comm: '张*发布了1条五星评价',
    drow: '+20鲜豆'
  },
  {
    id: 3,
    comm: '刘**发布了1条三星评价',
    drow: '+10鲜豆'
  }
])

// 下拉刷新
const loading = ref(false)
const onRefresh = () => {
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

// tab栏切换
const onClickTab = (val) => {
  console.log(val.name)
  // 等于0获取未评价的
  if (val.name === 0) {
    orderStore.getNoCommOrderItem(2, val.name)
  } else if (val.name === 1) {
    //获取已评价的订单
    orderStore.getNoCommOrderItem(2, val.name)
  }
}
// 去看已评价
const goOkComm = () => {
  active.value = 1
  orderStore.getNoCommOrderItem(2, 1)
}
onMounted(() => {
  orderStore.getNoCommOrderItem(2, 0)
})
</script>
<template>
  <!-- 标题 -->
  <navBar :isShow="true">
    <template #title>评价中心</template>
    <template #left>
      <van-icon name="arrow-left" size="18" />
    </template>
  </navBar>
  <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <van-row class="start_row">
      <van-col span="24">
        <!-- 头部信息展示 -->
        <van-row>
          <van-col span="24">
            <van-cell-group inset>
              <van-row class="user_info">
                <!-- 用户信息 -->
                <van-col span="24">
                  <van-row>
                    <van-col span="5" class="prc_pos"
                      ><van-image
                        width="35"
                        height="35"
                        round
                        fit="cover"
                        position="canter"
                        :src="userInfoStore.users.user_pic"
                    /></van-col>
                    <van-col span="19">
                      <van-row class="user_name">
                        <van-col class="user_name_full" span="24">{{
                          userInfoStore.users.full_name
                        }}</van-col>
                        <van-col class="user_name_email" span="24">{{
                          userInfoStore.users.email
                        }}</van-col>
                      </van-row>
                    </van-col>
                  </van-row>
                </van-col>
                <van-col span="24">
                  <van-row>
                    <van-col span="24" class="user_statou">评价官权益</van-col>
                    <van-col span="24">
                      <van-row justify="left">
                        <van-col
                          class="user_oker"
                          v-for="item in startUser"
                          :key="item.id"
                          >{{ item.text }}</van-col
                        >
                      </van-row>
                    </van-col>
                  </van-row>
                </van-col>
                <van-col span="24"></van-col>
              </van-row>
            </van-cell-group>
          </van-col>
        </van-row>
        <!-- 动态信息 -->
        <van-row>
          <van-col span="24">
            <van-notice-bar :scrollable="false" background="rgba(0, 0, 0, 0)">
              <van-swipe
                vertical
                class="notice-swipe"
                :autoplay="1500"
                :touchable="false"
                :show-indicators="false"
              >
                <van-swipe-item v-for="item in userComment" :key="item.id">
                  {{ item.comm }} {{ item.drow }}
                </van-swipe-item>
              </van-swipe>
            </van-notice-bar>
          </van-col>
        </van-row>
        <!-- 评价订单 -->
        <van-row class="comm_row">
          <van-col span="24">
            <van-tabs v-model:active="active" @click-tab="onClickTab">
              <van-tab title="待评价">
                <van-row v-if="orderStore.orderList.length <= 0">
                  <van-col span="24">
                    <van-empty description="没有待评价的商品哦~~">
                      <van-button
                        round
                        type="primary"
                        class="bottom-button"
                        @click="goOkComm"
                        >查看以评价</van-button
                      >
                    </van-empty>
                  </van-col>
                </van-row>
                <van-row v-else>
                  <van-col span="24">
                    <commentOrder
                      v-for="item in orderStore.orderList"
                      :key="item.order_detail_id"
                      :order="item"
                    ></commentOrder>
                  </van-col>
                </van-row>
              </van-tab>
              <van-tab title="已评价/追评">
                <van-row v-if="orderStore.orderList.length <= 0">
                  <van-col span="24">
                    <van-empty description="您还没有已评价的商品，快去逛逛吧~~">
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
                <van-row v-else>
                  <van-col span="24">
                    <commentOrder
                      v-for="item in orderStore.orderList"
                      :key="item.order_detail_id"
                      :order="item"
                      :orderId="orderId()"
                    ></commentOrder>
                  </van-col>
                </van-row>
              </van-tab>
            </van-tabs>
          </van-col>
        </van-row>
      </van-col>
    </van-row>
  </van-pull-refresh>
</template>
<style lang="less" scoped>
.start_row {
  padding-top: 20px;
}
.notice-swipe {
  height: 40px;
  line-height: 40px;
}
.user_info {
  padding: 20px 20px;
  .prc_pos {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .user_name {
    padding: 10px 0 5px 0;
    .user_name_full {
      font-size: 15px;
      margin-bottom: 3px;
    }
    .user_name_email {
      font-size: 13px;
    }
  }
  .van-cell {
    padding-left: 0;
  }
}
.user_oker {
  font-size: 13px;
  padding-left: 5px;
  &::after {
    content: '';
    display: inline-block;
    width: 1px;
    height: 10px;
    background-color: #000;
    margin-left: 5px;
  }
  &:last-child::after {
    display: none;
  }
}
.user_statou {
  font-size: 13px;
  padding: 10px 0 5px 0;
}
.comm_row {
  padding: 0 15px;
}
</style>
