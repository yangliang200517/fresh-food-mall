<script setup>
import { ref } from 'vue'
import { getGoodsDetail, delGoodsDetail } from '@/api/goodsdetail'
import DetailSelect from './components/DetailSelect.vue'
import DetailAlert from './components/DetailAlter.vue'
import dayjs from 'dayjs'

const detailAlter = ref(null)
const tableList = ref([])
const isMsg = ref(false)
const product_id = ref(null)

// 监听子组件传递的选择值
const handleSelectChange = (value) => {
  console.log(value)
  product_id.value = value
  getGoodsDetailImg(value)
}

// 获取生鲜详情图片
const getGoodsDetailImg = async (product_id) => {
  const res = await getGoodsDetail(product_id)
  tableList.value = res.data.data.map((item) => ({
    ...item,
    detail_time: dayjs(item.detail_time).format('YYYY-MM-DD')
  }))
}

// 子传父，更新数据
const updateDetailData = () => {
  getGoodsDetailImg(product_id.value)
}

// 删除操作
const handleDelete = async (row) => {
  const res = await delGoodsDetail(row.detail_id)
  if (res.status === 200) {
    ElMessage.success('删除成功')
  }
  getGoodsDetailImg(row.product_id)
}

// 编辑操作
const handleEdit = (row) => {
  isMsg.value = true
  detailAlter.value.changeOrCarousel(row)
}

// 添加操作
const addDetailImg = () => {
  isMsg.value = false
  detailAlter.value.changeOrCarousel({})
}
</script>
<template>
  <public-view title="生鲜商品详情轮播图管理">
    <template #btnbox>
      <el-button type="primary" @click="addDetailImg">添加生鲜商品详情图片</el-button>
    </template>
    <!-- select选择框 -->
    <detail-select @handleSelectChange="handleSelectChange"></detail-select>
    <!-- 表格 -->
    <el-row>
      <el-col :span="24">
        <el-table :data="tableList" height="480" style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="80" />
          <el-table-column label="生鲜详情图片" align="center" width="auto">
            <template #default="{ row }">
              <el-image
                style="width: 80px; height: 80px"
                :src="row.detail_img"
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
          <el-table-column
            prop="detail_time"
            label="生鲜详情图片创建日期"
            align="center"
          />
          <el-table-column label="操作" width="200" align="center">
            <template #default="{ row }">
              <el-button :icon="Edit" size="small" @click="handleEdit(row)"
                >编辑</el-button
              >
              <el-button
                :icon="Delete"
                size="small"
                type="danger"
                @click="handleDelete(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="还没有管理员~" />
          </template>
        </el-table>
      </el-col>
    </el-row>
    <!-- 编辑/添加弹窗 -->
    <DetailAlert
      ref="detailAlter"
      :isMsg="isMsg"
      @updateDetailImg="updateDetailData"
    ></DetailAlert>
  </public-view>
</template>
