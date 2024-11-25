<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import cartItem from '@/components/cartItem.vue'
import { getSearchData, getAscSearchData, getDescSearchData } from '@/api/search'

const route = useRoute()
const value1 = ref(0)
const option1 = ref([
  {
    text: '综合排序',
    value: 0
  },
  {
    text: '以价格升序排序',
    value: 1
  },
  {
    text: '以价格降序排序',
    value: 2
  }
])

// 筛选
const activeItem = (value) => {
  console.log(value)
  switch (value) {
    case 0:
      getSearchItem()
      break
    case 1:
      getAscPriceSearchItem()
      break
    case 2:
      getDescPriceSearchItem()
      break
    default:
      getSearchItem()
  }
}

// 下拉刷新
const loading = ref(false)
const onRefresh = () => {
  setTimeout(() => {
    getSearchItem()
    loading.value = false
  }, 1000)
}

// 获取搜索的结果
const searchList = ref([])
const getSearchItem = async () => {
  const res = await getSearchData(route.params.text)
  searchList.value = res.data.searchList
  console.log(res)
}

// 获取以价格升序排序的商品结果
const getAscPriceSearchItem = async () => {
  const res = await getAscSearchData(route.params.text)
  searchList.value = res.data.searchList
}

// 获取以价格降序排序的商品结果
const getDescPriceSearchItem = async () => {
  const res = await getDescSearchData(route.params.text)
  searchList.value = res.data.searchList
}

// 获取屏幕高度
const screenHeight = ref(window.innerHeight)
// 监听窗口变化，更新屏幕高度
const updateScreenHeight = () => {
  screenHeight.value = window.innerHeight
}
onMounted(() => {
  getSearchItem()
  window.addEventListener('resize', updateScreenHeight)
})
</script>
<template>
  <!-- 标题 -->
  <navBar :isShow="true">
    <template #title>商品列表</template>
    <template #left>
      <van-icon name="arrow-left" size="18" />
    </template>
  </navBar>
  <!-- 筛选排序 -->
  <van-row>
    <van-col span="24">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value1" :options="option1" @change="activeItem" />
      </van-dropdown-menu>
    </van-col>
  </van-row>
  <!-- 商品展示 -->
  <van-row>
    <van-col span="24" class="iten_padd">
      <van-pull-refresh
        v-model="loading"
        @refresh="onRefresh"
        :style="{ overflow: 'hidden', height: screenHeight + 'px' }"
      >
        <cartItem
          v-for="item in searchList"
          :key="item.product_id"
          :item="item"
        ></cartItem>
      </van-pull-refresh>
    </van-col>
  </van-row>
</template>
<style lang="less" scoped>
.iten_padd {
  padding: 0 10px;
}
.van-card {
  border-radius: 7px;
}
</style>
