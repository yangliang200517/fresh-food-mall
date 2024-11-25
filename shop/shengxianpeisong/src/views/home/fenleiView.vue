<script setup>
import navBar from '@/components/navBar.vue'
import { onMounted, ref } from 'vue'
import { getFenleiData } from '@/api/fenlei'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索
const valueSearch = ref('')

// 分类
const activeIndex = ref(0)
const items = ref([])

const getFenlei = async () => {
  const res = await getFenleiData()
  res.data.data.forEach((item) => {
    item.showChildren = false
  })

  items.value = res.data.data
  items.value[0].showChildren = true
  console.log(items.value)
  console.log(res)
}

const toogleTreeSelect = (index) => {
  items.value[index].showChildren = true
  items.value.forEach((item, i) => {
    if (i !== index) {
      item.showChildren = false
    }
  })
}

const screenHeight = ref(window.innerHeight)
// 监听窗口变化，更新屏幕高度
const updateScreenHeight = () => {
  screenHeight.value = window.innerHeight
}
// 在组件挂载时添加窗口变化监听
onMounted(() => {
  getFenlei()
  window.addEventListener('resize', updateScreenHeight)
})
</script>

<template>
  <!-- 标题 -->
  <navBar :isShow="false">
    <template #title> 生鲜分类 </template>
  </navBar>
  <!-- 搜索 -->
  <van-row class="search_fixed">
    <van-col span="24">
      <van-search
        v-model="valueSearch"
        placeholder="请输入搜索关键词"
        @click="router.push('/search')"
      />
    </van-col>
  </van-row>

  <!-- 占位符 -->
  <van-row style="height: 45px"></van-row>

  <!--分类  -->
  <van-row>
    <van-col span="24">
      <van-tree-select
        class="hidden_soll"
        v-model:main-active-index="activeIndex"
        :style="{ overflow: 'hidden', height: screenHeight - 127 + 'px' }"
        :items="items"
        @click-nav="toogleTreeSelect"
      >
        <template #content>
          <div v-for="(item, indexs) in items" :key="item.fenleiId">
            <div v-if="item.showChildren">
              <van-grid square :border="false" :column-num="3">
                <van-grid-item
                  v-for="(child, index) in item.children"
                  :key="child.goodsId"
                  @click="router.push(`/goods/detail/${child.goodsId}`)"
                >
                  <van-image
                    class="imgBox"
                    fit="cover"
                    position="center"
                    :src="items[indexs].children[index].pic"
                  />
                  <span class="treeSelect_text">{{
                    items[indexs].children[index].text
                  }}</span>
                </van-grid-item>
              </van-grid>
            </div>
          </div>
        </template>
      </van-tree-select>
    </van-col>
  </van-row>
</template>

<style lang="less" scoped>
.search_fixed {
  position: fixed;
  top: 45px;
  left: 0;
  width: 100%;
  z-index: 1;
}
.treeSelect_text {
  font-size: 12px;
  margin-top: 8px;
  letter-spacing: 1px;
}
.imgBox {
  width: 40px;
  height: 40px;
}
</style>
