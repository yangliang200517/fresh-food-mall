<script setup>
import { onMounted, ref } from 'vue'
import navBar from '@/components/navBar.vue'
import cartItem from '@/components/cartItem.vue'
import { getHomeGoods } from '@/api/home'
import { useRouter } from 'vue-router'

const router = useRouter()
// 搜索
const searchValue = ref('')

// 下拉刷新
const loading = ref(false)
const onRefresh = () => {
  setTimeout(() => {
    getGoods()
    loading.value = false
  }, 1000)
}

// 首页数据初始化结构
const goods = ref([])
// 轮播图
const coursels = ref([])
// 宫格左边数据
const gridLeftItem = ref([])
// 宫格右边数据
const gridRightTopItem = ref([])
const gridRightBottomItem = ref([])
// 获取首页数据方法
const getGoods = async () => {
  const res = await getHomeGoods()
  console.log(res)
  if (res.data.status === 200) {
    goods.value = res.data.goods
    coursels.value = res.data.coursel
    fillGridItems()
  }
}

// 从数组中随机选择指定数量的项目
const getRandomItems = (sourceArray, count) => {
  const randomIndices = []
  while (randomIndices.length < count) {
    const index = Math.floor(Math.random() * sourceArray.length)
    if (!randomIndices.includes(index)) {
      randomIndices.push(index)
    }
  }
  return randomIndices.map((index) => ({
    id: sourceArray[index].product_id,
    text: sourceArray[index].product_name,
    path: `/goods/detail/${sourceArray[index].product_id}`,
    img: sourceArray[index].product_pic
  }))
}

// 填充宫格数据
const fillGridItems = () => {
  gridLeftItem.value = getRandomItems(goods.value, 4)
  gridRightTopItem.value = getRandomItems(goods.value, 2)
  gridRightBottomItem.value = getRandomItems(goods.value, 2)
}

// 获取首页数据
onMounted(() => {
  getGoods()
})
</script>

<template>
  <!-- 标题 -->
  <navBar :isShow="false">
    <template #title> 生鲜商城 </template>
  </navBar>

  <!-- 搜索 -->
  <van-row class="search_fixed">
    <van-col span="24">
      <van-search
        v-model="searchValue"
        placeholder="请输入搜索关键词"
        @click="router.push('/search')"
      />
    </van-col>
  </van-row>
  <!-- 占位符 -->
  <van-row style="height: 47px"></van-row>
  <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <van-space direction="vertical" fill :size="12">
      <!-- 轮播图 -->
      <van-row>
        <van-col span="24">
          <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="itemImg in coursels" :key="itemImg.id">
              <img :src="itemImg.carousel_pic" />
            </van-swipe-item>
          </van-swipe>
        </van-col>
      </van-row>
      <van-row class="notice_marg">
        <!-- 导航链接 -->
        <van-col span="24">
          <van-row gutter="6">
            <van-col span="12">
              <van-cell-group inset>
                <van-grid :border="false" :column-num="2" style="height: 100%">
                  <van-grid-item
                    v-for="item in gridLeftItem"
                    :key="item.id"
                    :to="item.path"
                  >
                    <van-image
                      class="imgBox"
                      fit="cover"
                      position="center"
                      :src="item.img"
                    />
                    <span class="treeSelect_text">{{ item.text }}</span>
                  </van-grid-item>
                </van-grid>
              </van-cell-group>
            </van-col>
            <van-col span="12">
              <van-space direction="vertical" fill :size="6">
                <van-row>
                  <van-col span="24">
                    <van-cell-group inset>
                      <van-grid :column-num="2">
                        <van-grid-item
                          v-for="item in gridRightTopItem"
                          :key="item.id"
                          :to="item.path"
                        >
                          <van-image
                            class="imgBox"
                            fit="cover"
                            position="center"
                            :src="item.img"
                          />
                          <span class="treeSelect_text">{{ item.text }}</span>
                        </van-grid-item>
                      </van-grid>
                    </van-cell-group>
                  </van-col>
                </van-row>
                <van-row>
                  <van-col span="24">
                    <van-cell-group inset>
                      <van-grid :column-num="2">
                        <van-grid-item
                          v-for="item in gridRightBottomItem"
                          :key="item.id"
                          :to="item.path"
                        >
                          <van-image
                            class="imgBox"
                            fit="cover"
                            position="center"
                            :src="item.img"
                          />
                          <span class="treeSelect_text">{{ item.text }}</span>
                        </van-grid-item>
                      </van-grid>
                    </van-cell-group>
                  </van-col>
                </van-row>
              </van-space>
            </van-col>
          </van-row>
        </van-col>
        <!-- 生鲜精选 -->
        <van-col span="24">
          <van-divider :style="{ color: '#000', borderColor: 'grey', padding: '0 16px' }"
            >生鲜精选</van-divider
          >
        </van-col>
        <!-- 商品展示 -->
        <van-col span="24" style="padding-bottom: 60px">
          <van-row>
            <van-col span="24">
              <cartItem
                v-for="item in goods"
                :key="item.product_id"
                :item="item"
              ></cartItem>
            </van-col>
          </van-row>
        </van-col>
      </van-row>
    </van-space>
    <!-- 返回顶部 -->
    <van-back-top :offset="1000" right="7vw" bottom="10vh" />
  </van-pull-refresh>
</template>

<style lang="less" scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
  height: 190px;
  img {
    width: 100%;
    height: 100%;
  }
}
.van-cell-group--inset {
  margin: 0;
  height: 100%;
}
.notice_marg {
  padding: 0 8px;
}
.search_fixed {
  position: fixed;
  top: 45px;
  left: 0;
  width: 100%;
  z-index: 1;
}
.van-card {
  background-color: #fff;
  border-radius: 7px;
}
.grid_span_text {
  font-size: 12px;
  margin-top: 8px;
}
.treeSelect_text {
  font-size: 12px;
  margin-top: 8px;
  letter-spacing: 1px;
}
.imgBox {
  width: 30px;
  height: 30px;
}
</style>
