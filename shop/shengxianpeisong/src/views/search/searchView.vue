<script setup>
import navBar from '@/components/navBar.vue'
import { onMounted, ref } from 'vue'
import { useSearchStore } from '@/stores/search'
import { showConfirmDialog } from 'vant'
import cartItem from '@/components/cartItem.vue'
import { getHomeGoods } from '@/api/home'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const searchStore = useSearchStore()

// 搜索
const searchValue = ref('')

// 搜索按钮
const onClickButton = (value) => {
  if (value === '') {
    return showToast('请输入要查询的物品')
  }

  searchStore.addSearchData(value)
  searchValue.value = ''
  router.push(`/searchlist/${value}`)
}

// 首页数据初始化结构
const goods = ref([])

// 从数组中随机选择指定数量的项目
const getRandomItems = (sourceArray, count) => {
  const randomIndices = []
  const copySourceArray = [...sourceArray]
  while (randomIndices.length < count && copySourceArray.length > 0) {
    const index = Math.floor(Math.random() * copySourceArray.length)
    randomIndices.push(copySourceArray.splice(index, 1)[0]) // 从原数组中删除选中的商品，并将其添加到 randomGoods 中
  }
  goods.value = randomIndices
}

// 点击换一换
const changeGoods = async () => {
  const res = await getHomeGoods()
  console.log(res)
  if (res.data.status === 200) {
    const goodsFourData = res.data.goods
    // 从 res.data.goods 中随机选择四条数据
    getRandomItems(goodsFourData, 4)
  }
}

// 清空历史搜索
const clearSearch = () => {
  showConfirmDialog({
    message: '确定删除所有历史记录吗？'
  })
    .then(() => {
      searchStore.clearSearchData()
    })
    .catch(() => {})
}

onMounted(() => {
  changeGoods()
})
</script>

<template>
  <!-- 标题 -->
  <navBar :isShow="true">
    <template #title> 搜索商品 </template>
    <template #left>
      <van-icon name="arrow-left" size="18" />
    </template>
  </navBar>
  <!-- 搜索 -->
  <van-row>
    <van-col span="24">
      <van-search v-model="searchValue" show-action placeholder="请输入搜索关键词">
        <template #action>
          <van-button type="primary" size="small" @click="onClickButton(searchValue)"
            >搜索</van-button
          >
        </template>
      </van-search>
    </van-col>
  </van-row>
  <!-- 最近搜索 -->
  <van-row v-if="searchStore.searchLength() > 0">
    <van-col span="24">
      <van-cell title="最近搜索" size="large">
        <template #right-icon>
          <van-icon @click="clearSearch" name="delete-o" size="18" />
        </template>
      </van-cell>
    </van-col>
    <van-col span="24">
      <ul class="search_text">
        <li
          v-for="item in searchStore.searchText"
          :key="item"
          @click="onClickButton(item)"
        >
          {{ item }}
        </li>
      </ul>
    </van-col>
  </van-row>
  <van-row class="secrch_item">
    <van-col span="24">
      <van-cell title="搜索发现" size="large">
        <template #right-icon>
          <van-row @click="changeGoods">
            <span>换一换</span>
            <van-icon name="replay" size="14" />
          </van-row>
        </template>
      </van-cell>
    </van-col>
    <van-col class="search_goods" span="24">
      <cartItem v-for="item in goods" :key="item.product_id" :item="item"></cartItem>
    </van-col>
  </van-row>
</template>
<style lang="less" scoped>
.search_text {
  padding: 0 15px;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  li {
    padding: 8px;
    font-size: 14px;
    background-color: #fff;
    border-radius: 6px;
    margin-right: 10px;
    margin-bottom: 7px;
    font-family: 'Microsoft YaHei UI';
  }
}
.van-search--show-action {
  /deep/.van-search__action {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    .van-button {
      padding: 0 15px;
      font-size: 14px;
    }
  }
}

.van-cell {
  background-color: transparent;
  /deep/.van-cell__title {
    font-weight: 700;
  }
  .van-icon {
    display: flex;
    align-items: center;
    margin-left: 5px;
  }
}
.secrch_item {
  margin: 20px 10px 0 10px;
  padding-bottom: 20px;
  border-radius: 10px;
  background: linear-gradient(to bottom right, #b5d0e9, #dbc5e4);
}
.search_goods {
  padding: 10px 15px;
}
</style>
