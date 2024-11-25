<script setup>
import { showConfirmDialog, showSuccessToast } from 'vant'
import { setOrderItemType } from '@/api/orders'

const props = defineProps({
  serviceOrder: Object,
  active: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits('updateOrder')

const orderId = () => {
  return props.serviceOrder.order_detail_id
}
const userId = () => {
  return props.serviceOrder.user_id
}
const productId = () => {
  return props.serviceOrder.product_id
}
const titAndMsg = () => {
  return props.serviceOrder.product_name + ' ' + props.serviceOrder.description
}

// 申请售后按钮
const serviceOrderItem = () => {
  showConfirmDialog({
    message: '确定要退货吗？'
  })
    .then(async () => {
      await setOrderItemType(orderId(), userId(), productId())
      showSuccessToast('申请售后成功')
      // 向父组件传递事件，更新数据
      emit('updateOrder')
    })
    .catch(() => {
      // on cancel
    })
}
</script>
<template>
  <van-row class="service_row">
    <van-col span="24">
      <!-- 头部 -->
      <van-row>
        <van-col span="24"><van-cell :title="`SH 生鲜`" /> </van-col>
      </van-row>
      <!-- 商品展示 -->
      <van-row>
        <van-col class="servie_pic" span="6">
          <van-image
            width="55"
            height="55"
            :radius="5"
            fit="cover"
            position="center"
            :src="serviceOrder.product_pic"
          />
        </van-col>
        <van-col class="service_text" span="18">
          <van-row class="service_text_row">
            <van-col class="service_title" span="24">{{ titAndMsg() }}</van-col>
            <van-col class="service_num" span="24" v-if="active === 0">
              数量:{{ serviceOrder.quantity }}</van-col
            >
            <van-row class="service_peice_row" v-if="active === 1">
              <van-col class="service_num" span="12"
                >申请数量: {{ serviceOrder.quantity }}</van-col
              >
              <van-col class="service_price" span="12"
                >已退款: ￥{{
                  (serviceOrder.price * serviceOrder.quantity).toFixed(2)
                }}</van-col
              >
            </van-row>
          </van-row>
        </van-col>
      </van-row>
      <!-- 按钮展示 -->
      <van-row class="service_btn" justify="end" v-if="props.active === 0">
        <van-col span="5">
          <van-button size="small" round plain type="primary" @click="serviceOrderItem"
            >申请售后</van-button
          >
        </van-col>
      </van-row>
      <!-- 完成展示 -->
      <van-row class="service_over" v-else>
        <van-col class="service_over_text" span="4">完成</van-col>
        <van-col class="service_over_text over_text" span="20"
          >服务已完成，感谢您对生鲜的支持</van-col
        >
      </van-row>
    </van-col>
  </van-row>
</template>
<style lang="less" scoped>
.service_row {
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 15px;
  overflow: hidden;
  .servie_pic {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .service_text {
    display: flex;
    padding-right: 20px;
    .service_text_row {
      width: 100%;
      .service_title,
      .service_num,
      .service_price {
        display: flex;
        width: 100%;
        align-items: center;
        font-size: 12px;
      }
      .service_peice_row {
        width: 100%;
      }
      .service_num {
        justify-content: left;
      }
      .service_price {
        justify-content: right;
        color: red;
      }
    }
  }
  .service_btn {
    margin: 15px 10px 15px 0;
  }
  .service_over {
    margin: 15px 15px 30px 15px;
    padding: 15px 15px;
    background-color: #e3e3e3;
    border-radius: 3px;
    .service_over_text {
      display: flex;
      justify-content: left;
      align-items: center;
      font-size: 13px;
    }
    .over_text {
      color: grey;
    }
  }
}
</style>
