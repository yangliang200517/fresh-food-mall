<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  order: Object,
  orderId: Number
})

const statusType = () => {
  if (props.order.iscomment === 0) {
    return '您还没有评价'
  } else if (props.order.iscomment === 1) {
    return '您已评价'
  } else {
    return '您已追评'
  }
}

// 去评价
const goComment = () => {
  router.push({
    path: '/order/comment/0',
    query: {
      orderId: props.order.order_detail_id,
      userId: props.order.user_id,
      productId: props.order.product_id
    }
  })
}
// 追评
const gosComment = () => {
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
const text = ref(props.order.description)
console.log(props.order)
</script>
<template>
  <van-row class="comm_order">
    <van-col span="24">
      <!-- 商品标题 -->
      <van-row>
        <van-col span="24">
          <van-cell :title="`SH ${order.product_name}`" />
        </van-col>
      </van-row>
      <!-- 商品信息 -->
      <van-row
        class="order_msg order_pad"
        @click="router.push(`/goods/detail/${order.product_id}`)"
      >
        <van-col class="order_img" span="5">
          <van-image
            width="50"
            height="50"
            fit="cover"
            position="center"
            :radius="5"
            :src="order.product_pic"
          />
        </van-col>
        <van-col class="order_text" span="19">
          <van-row>
            <van-col span="24"><van-text-ellipsis :content="text" /></van-col>
            <van-col class="no_comm" span="24">{{ statusType() }}</van-col>
          </van-row>
        </van-col>
      </van-row>
      <!-- 评价按钮 -->
      <van-row justify="end" class="order_pad">
        <van-col span="5" v-if="order.iscomment === 1">
          <van-button plain round type="primary" size="small" @click="gosComment"
            >追评</van-button
          >
        </van-col>
        <van-col span="5" v-if="order.iscomment === 0">
          <van-button plain round type="primary" size="small" @click="goComment"
            >去评价</van-button
          >
        </van-col>
      </van-row>
    </van-col>
  </van-row>
</template>
<style lang="less" scoped>
.comm_order {
  margin-bottom: 15px;
}
.van-row {
  background-color: #fff;
}
.order_pad,
.order_msg {
  padding: 0 15px 20px 15px;
}
.order_msg {
  font-size: 14px;
  .order_img {
    display: flex;
    justify-content: left;
    align-items: center;
  }
  .order_text {
    display: flex;
    align-items: center;
    .van-row {
      width: 100%;
    }
  }
}
.no_comm {
  color: crimson;
}
</style>
