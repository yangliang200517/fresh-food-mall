<script setup>
import { useRoute, useRouter } from 'vue-router'
const props = defineProps({
  isShow: Boolean
})

const route = useRoute()
const router = useRouter()
console.log(router)
const onClickLeft = () => {
  switch (route.path) {
    case '/order/type/1':
      router.push('/user')
      break
    default:
      history.back()
      break
  }
}
</script>
<template>
  <van-row>
    <van-col span="24">
      <van-nav-bar :fixed="true" @click-left="onClickLeft">
        <template #left v-if="props.isShow">
          <slot name="left"></slot>
        </template>
        <template #title>
          <slot name="title"></slot>
        </template>
      </van-nav-bar>
    </van-col>
  </van-row>
  <div class="placeholder"></div>
</template>
<style lang="less" scoped>
.placeholder {
  height: 45px;
}
.van-nav-bar {
  /deep/.van-icon {
    color: #000;
  }
}
</style>
