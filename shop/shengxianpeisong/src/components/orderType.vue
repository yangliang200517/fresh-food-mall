<script setup>
import { onMounted, ref } from 'vue'
import { deleteOrderItem, cancelOrderItem } from '@/api/orders'
import { showConfirmDialog } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  order: Object,
  userId: Number
})

const emit = defineEmits(['updataOrder'])
// 计算订单的状态
const orderType = () => {
  switch (props.order.product_status) {
    case 0:
      return '全部'
    case 1:
      return '待发货'
    case 2:
      return '已完成'
    case 3:
      return '已取消'
    default:
      return '商家以接单'
  }
}

// 按钮显示
const cancelOrder = () => {
  return props.order.product_status === 1
}

const goPayOrder = () => {
  return props.order.product_status !== 1
}

const detailOrder = () => {
  return props.order.product_status !== 0 && props.order.product_status !== 1
}

const serviceOrder = () => {
  return props.order.product_status === 2
}

// 封装从父组件传递过来的数据
const userId = () => {
  return props.userId
}
const orderId = () => {
  return props.order.order_detail_id
}
const productId = () => {
  return props.order.product_id
}

// 删除订单商品
const delOrderItem = async () => {
  showConfirmDialog({
    message: '确定要删除订单吗？'
  })
    .then(async () => {
      const res = await deleteOrderItem(userId(), orderId(), productId())
      console.log(res)
      emit('updataOrder', props.order.product_status)
    })
    .catch(() => {})
}

// 取消订单
const canOrderItem = async () => {
  showConfirmDialog({
    message: '确定要取消订单吗？'
  })
    .then(async () => {
      const res = await cancelOrderItem(3, userId(), orderId(), productId())
      console.log(res)
      emit('updataOrder', props.order.product_status)
    })
    .catch(() => {})
}
// 再次购买
const goPayOrderItem = () => {
  router.push(`/goods/detail/${props.order.product_id}`)
}

// 评价服务
const commText = ref('')
const commBtn = ref(true)
const commOrders = () => {
  if (props.order.iscomment !== 1 && props.order.iscomment !== 2) {
    router.push({
      path: '/order/comment/0',
      query: {
        orderId: props.order.order_detail_id,
        userId: props.order.user_id,
        productId: props.order.product_id
      }
    })
  } else if (props.order.iscomment === 1) {
    router.push({
      path: '/order/comment/1',
      query: {
        orderId: props.order.order_detail_id,
        userId: props.order.user_id,
        productId: props.order.product_id,
        productName: props.order.product_name,
        productText: props.order.description,
        isComment: props.order.iscomment,
        productPic: props.order.product_pic
      }
    })
  }
}
onMounted(() => {
  if (props.order.iscomment !== 1 && props.order.iscomment !== 2) {
    commText.value = '评价服务'
  } else if (props.order.iscomment === 1) {
    commText.value = '去追评'
  } else if (props.order.iscomment === 2) {
    commBtn.value = false
  }
})
</script>
<template>
  <van-row class="order_row">
    <van-col span="24">
      <!-- 头部 -->
      <van-row>
        <van-col span="24">
          <van-cell :title="`SH ${order.product_name}`" :value="orderType()" />
        </van-col>
      </van-row>
      <!-- 订单信息 -->
      <van-row class="order_item">
        <!-- 订单图片 -->
        <van-col span="7">
          <van-image
            width="80"
            height="80"
            :radius="5"
            fit="cover"
            position="center"
            :src="order.product_pic"
          />
        </van-col>
        <!-- 订单描述 -->
        <van-col class="order_text" span="10" offset="1">
          <van-text-ellipsis :content="order.description" rows="2" />
        </van-col>
        <!-- 订单价格数量 -->
        <van-col class="order_price" span="6">
          <van-row>
            <van-col span="24">￥{{ order.price }}</van-col>
            <van-col span="24">共{{ order.quantity }}件</van-col>
          </van-row>
        </van-col>
      </van-row>
      <!-- 订单操作 -->
      <van-row justify="end" class="order_btn">
        <van-col span="5" offset="1" v-if="cancelOrder()"
          ><van-button size="small" round plain type="primary" @click="canOrderItem"
            >取消订单</van-button
          ></van-col
        >
        <van-col span="5" offset="1" v-if="detailOrder()"
          ><van-button size="small" round plain type="primary" @click="delOrderItem"
            >删除订单</van-button
          ></van-col
        >
        <van-col span="5" offset="1" v-if="goPayOrder()"
          ><van-button size="small" round plain type="primary" @click="goPayOrderItem"
            >再次购买</van-button
          ></van-col
        >
        <van-col span="5" offset="1" v-if="serviceOrder() && commBtn === true"
          ><van-button size="small" round plain type="primary" @click="commOrders">{{
            commText
          }}</van-button></van-col
        >
      </van-row>
    </van-col>
  </van-row>
</template>
<style lang="less" scoped>
.order_row {
  margin: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  .order_item {
    padding: 10px 16px;
    .van-image {
      visibility: visible;
    }
    .order_text,
    .order_price {
      display: flex;
      align-items: center;
    }
    .order_text,
    .order_price {
      font-size: 14px;
    }
    .order_text {
      .van-text-ellipsis {
        width: 100%;
      }
    }
    .order_price {
      text-align: right;
    }
  }
  .order_btn {
    padding: 16px;
  }
}
</style>
