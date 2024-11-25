<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
defineProps({
  item: Object
})
</script>
<template>
  <van-card
    class="card_back"
    :num="item.stock === 0 ? '该商品已售空' : item.stock"
    :price="item.price.toFixed(2)"
    :origin-price="item.old_price ? item.old_price.toFixed(2) : null"
    :desc="item.description"
    :title="item.product_name"
    :thumb="item.product_pic"
    @click="router.push(`/goods/detail/${item.product_id}`)"
  />
</template>
<style lang="less" scoped>
.card_back {
  background-color: #fff;
  border-radius: 7px;
}
</style>
