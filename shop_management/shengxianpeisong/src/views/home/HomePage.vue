<script setup>
import { onMounted, ref } from 'vue'
import { useUserInfoStore } from '@/stores/userinfo'
import { getCarousel, deleteCarousel } from '@/api/home'
import dayjs from 'dayjs'

const userInfoStore = useUserInfoStore()
const carouselList = ref([])
const parousel = ref(null)
let isMsg = ref(false)

// 判断管理员等级
const isAdminStart = () => {
  return userInfoStore.user.grade === 0 ? false : true
}

// 获取轮播图
const getCarouselList = async () => {
  const res = await getCarousel()
  console.log(res)
  carouselList.value = res.data.data.map((element) => ({
    ...element,
    carousel_time: dayjs(element.carousel_time).format('YYYY-MM-DD')
  }))
}

// 添加轮播图
const addCarouse = () => {
  isMsg.value = false
  parousel.value.changeOrCarousel({})
}

// 编辑轮播图
const handleEdit = (row) => {
  isMsg.value = true
  parousel.value.changeOrCarousel(row)
}

// 删除轮播图
const handleDelete = async (row) => {
  const res = await deleteCarousel(row.id)
  if (res.data.status === 200) {
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
  }
  getCarouselList()
}

// 字传父更新方法
const updateCarousel = () => {
  getCarouselList()
}

onMounted(() => {
  getCarouselList()
})
</script>
<template>
  <public-view title="轮播图管理">
    <template #btnbox>
      <el-button type="primary" @click="addCarouse">添加轮播图</el-button>
    </template>
    <!-- 主体部分 -->
    <el-row>
      <el-col :span="24">
        <el-table :data="carouselList" height="520" style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="100" />
          <el-table-column label="轮播图图片" align="center" width="auto">
            <template #default="{ row }">
              <el-image
                style="width: 200px; height: 80px"
                :src="row.carousel_pic"
                :fit="cover"
              >
                <template #error>
                  <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="carousel_time" label="创建日期" align="center" />
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button size="small" :icon="Edit" type="primary" @click="handleEdit(row)"
                >编辑</el-button
              >
              <el-button
                :disabled="isAdminStart()"
                size="small"
                :icon="Delete"
                type="danger"
                @click="handleDelete(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="还没有轮播图~" />
          </template>
        </el-table>
      </el-col>
    </el-row>

    <!-- 对话框 -->
    <carousel-view
      ref="parousel"
      :isMsg="isMsg"
      @updateCarousel="updateCarousel"
    ></carousel-view>
  </public-view>
</template>
