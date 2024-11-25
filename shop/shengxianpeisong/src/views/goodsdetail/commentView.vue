<script setup>
import { onMounted, ref, watch } from 'vue'
import navBar from '@/components/navBar.vue'
import orderComment from '@/components/orderCommentView.vue'
import { useRoute } from 'vue-router'
import { getGoodsDetailComment } from '@/api/home'
import { getCommitGood, getCommitMiddle, getCommitBid } from '@/api/comment'
import dayjs from 'dayjs'

const route = useRoute()

// 筛选
const value = ref(0)

const switch1 = ref(true)
const options = ref([
  { text: '全部评论', value: 0 },
  { text: '好评', value: 1 },
  { text: '中评', value: 2 },
  { text: '差评', value: 3 }
])
const textValue = ref(options.value[0].text)

watch(value, () => {
  textValue.value = options.value[value.value].text
})

// 下拉刷新
const loading = ref(false)
const onRefresh = () => {
  setTimeout(() => {
    value.value = 0
    getComment()
    loading.value = false
  }, 1000)
}

// 时间转换
const dayFormat = () => {
  commentList.value.forEach((item) => {
    item.review_date = dayjs(item.review_date).format('YYYY-MM-DD')
  })
}

// 评论数据初始化
const commentList = ref([])
const productName = ref([])

// 获取全部评论数据
const getComment = async () => {
  const res = await getGoodsDetailComment(route.params.id)
  commentList.value = res.data.commentList
  productName.value = res.data.title
  dayFormat()
}
// 获取好评数据
const getCommentGood = async () => {
  const res = await getCommitGood(route.params.id)
  commentList.value = res.data.commentGood
  dayFormat()
}

// 获取中评数据
const getCommitMid = async () => {
  const res = await getCommitMiddle(route.params.id)
  commentList.value = res.data.commentGood
  dayFormat()
}

// 获取差评数据
const getCommitBiddle = async () => {
  const res = await getCommitBid(route.params.id)
  commentList.value = res.data.commentGood
  dayFormat()
}

// 切换评价等级
const toggleComment = (value) => {
  switch (value) {
    case 0:
      getComment()
      break
    case 1:
      getCommentGood()
      break
    case 2:
      getCommitMid()
      break
    case 3:
      getCommitBiddle()
      break
    default:
      getComment()
  }
}

const screenHeight = ref(window.innerHeight)
// 监听窗口变化，更新屏幕高度
const updateScreenHeight = () => {
  screenHeight.value = window.innerHeight
}

onMounted(() => {
  getComment()
  window.addEventListener('resize', updateScreenHeight)
})
</script>
<template>
  <!-- 标题 -->
  <navBar :isShow="true">
    <template #title>商品评价</template>
    <template #left>
      <van-icon name="arrow-left" size="18" />
    </template>
  </navBar>

  <!-- 筛选 -->
  <van-row class="menu_fixed">
    <van-col span="24">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value" :options="options" @change="toggleComment" />
        <van-dropdown-item title="默认排序">
          <van-cell center title="默认排序">
            <template #right-icon>
              <van-switch v-model="switch1" disabled />
            </template>
          </van-cell>
        </van-dropdown-item>
      </van-dropdown-menu>
    </van-col>
  </van-row>
  <!-- 占位符 -->
  <div class="menu_box"></div>
  <van-space direction="vertical" fill>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <!-- 评价 -->
      <van-row>
        <van-col class="van-hairline--bottom" span="24">
          <van-cell
            class="shop_title"
            v-for="item in productName"
            :key="item"
            :title="`关于『${item.product_name}』的${textValue}`"
          />
        </van-col>
        <van-col span="24" v-if="commentList.length">
          <orderComment
            v-for="items in commentList"
            :key="items.review_id"
            :commItem="items"
          ></orderComment>
        </van-col>
        <van-col span="24" v-else>
          <van-empty
            image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
            image-size="80"
            description="暂无评价"
          >
          </van-empty>
        </van-col>
      </van-row>
    </van-pull-refresh>
  </van-space>
</template>
<style lang="less" scoped>
.menu_fixed {
  position: fixed;
  width: 100%;
  z-index: 1;
}
.menu_box {
  height: 45px;
  margin-bottom: 20px;
}
.shop_title {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
</style>
