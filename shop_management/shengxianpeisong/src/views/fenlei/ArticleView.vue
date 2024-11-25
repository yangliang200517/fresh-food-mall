<script setup>
import { onMounted, ref } from 'vue'
import { useUserInfoStore } from '@/stores/userinfo'
import { getArticle } from '@/api/article'
import { Delete, Edit } from '@element-plus/icons-vue'
import DialogEdit from './components/DialogEdit.vue'
import { delArticle } from '@/api/article'
import dayjs from 'dayjs'

const userInfoStore = useUserInfoStore()
const dialog = ref()
const loading = ref(false)
const acticleList = ref([])

// 判断管理员等级
const isAdminStart = () => {
  return userInfoStore.user.grade === 0 ? false : true
}

// 获取生鲜分类
const getFenleiData = async () => {
  loading.value = true
  const res = await getArticle()
  acticleList.value = res.data.data.map((element) => ({
    ...element,
    category_time: dayjs(element.category_time).format('YYYY-MM-DD')
  }))
  loading.value = false
}

// 添加分类
const addArticle = () => {
  dialog.value.changeOrAddArticle({})
}
// 编辑分类
const handleEdit = (row) => {
  dialog.value.changeOrAddArticle(row)
}
// 删除分类
const handleDelete = async (row, $index) => {
  console.log(row, $index)
  ElMessageBox.confirm(
    '确定要删除该分类吗？如果删除，该分类下的所有商品和商品评论也会删除。',
    '温馨提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const res = await delArticle(row.category_id)
      console.log(res)
      ElMessage.success('删除成功')
      getFenleiData()
    })
    .catch(() => {})
}

// 字传父监听更新事件
const updateArticle = () => {
  getFenleiData()
}
onMounted(() => {
  getFenleiData()
})
</script>
<template>
  <public-view title="生鲜分类">
    <template #btnbox>
      <el-button type="primary" @click="addArticle">添加生鲜分类</el-button>
    </template>
    <!-- 主体部分 -->
    <el-table v-loading="loading" :data="acticleList" style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="100" />
      <el-table-column prop="category_name" label="分类名称" align="center" />
      <el-table-column prop="category_time" label="创建时间" align="center" />
      <el-table-column label="操作" width="200" align="center">
        <template #default="{ row, $index }">
          <el-button
            :disabled="isAdminStart()"
            :icon="Edit"
            size="small"
            @click="handleEdit(row, $index)"
            >编辑</el-button
          >
          <el-button
            :disabled="isAdminStart()"
            :icon="Delete"
            size="small"
            type="danger"
            @click="handleDelete(row, $index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="还没有分类~" />
      </template>
    </el-table>
    <!-- 弹层对话框 -->
    <dialog-edit ref="dialog" @update-article="updateArticle"></dialog-edit>
  </public-view>
</template>
<style scoped></style>
