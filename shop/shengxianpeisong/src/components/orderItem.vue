<script setup>
defineProps({
  item: Object
})
</script>
<template>
  <van-row class="order_item">
    <van-col class="order_item_col" span="24">
      <van-space direction="vertical" fill :size="20">
        <!-- 标题 -->
        <van-row class="order_item_title">
          <van-col span="24">SH 生鲜商城</van-col>
        </van-row>
        <!-- 订单商品信息 -->
        <van-row>
          <van-col span="24">
            <van-card
              :num="item.quantity"
              :price="item.price.toFixed(2)"
              :desc="item.description"
              :title="item.product_name"
              :thumb="item.product_pic"
            >
              <template #tags>
                <van-tag color="red" plain style="margin-top: 5px"
                  >支持七天无理由退货</van-tag
                >
                <van-tag color="red" plain style="margin-top: 5px; margin-left: 8px"
                  >七天保价</van-tag
                >
              </template>
            </van-card>
          </van-col>
        </van-row>
        <!-- 服务 -->
        <van-row>
          <van-col span="24">
            <van-cell title="服务" value="损坏包赔" />
          </van-col>
        </van-row>
        <!-- 配送 -->
        <van-row>
          <van-col span="24">
            <van-cell title="配送" value="快递运输，已包邮" />
          </van-col>
        </van-row>
        <!-- 退换货 -->
        <van-row>
          <van-col span="24">
            <van-cell title="退换货免运费" value="商家赠送" />
          </van-col>
        </van-row>
      </van-space>
    </van-col>
  </van-row>
</template>
<style lang="less" scoped>
.order_item {
  background-color: #fff;
  border-radius: 8px;
  .order_item_col {
    padding: 20px;
    .order_item_title {
      font-size: 14px;
    }
    .van-card {
      padding: 0;
      background-color: #fff;
    }
    .van-cell {
      padding: 0;
    }
  }
}
</style>
