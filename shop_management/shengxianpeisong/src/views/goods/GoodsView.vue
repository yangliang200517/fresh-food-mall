<script setup>
import { onMounted, ref } from 'vue'
import { useUserInfoStore } from '@/stores/userinfo'
import { Delete, Edit, Share, Search } from '@element-plus/icons-vue'
import { getGoods, delGoods } from '@/api/goods'
import selectView from '@/components/selectView.vue'
import DrawerView from '@/components/DrawerView.vue'

const userInfoStore = useUserInfoStore()
let loading = ref(false)
let acticleList = ref([])
let total = ref(0)
let drawer = ref()
let dialog = ref()
let isMsg = ref(null)
let pageData = ref({
  page: 1,
  pageSize: 4,
  selValue: ''
})

// 判断管理员等级
const isAdminStart = () => {
  return userInfoStore.user.grade === 0 ? false : true
}

// 获取生鲜商品
const getProducts = async () => {
  loading.value = true
  console.log(pageData.value)
  const res = await getGoods(pageData.value)
  console.log(res)
  acticleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}

// 分页
const handleSizeChange = (size) => {
  pageData.value.page = 1
  pageData.value.pageSize = size
  getProducts()
}

// 页码
const handleCurrentChange = (page) => {
  pageData.value.page = page
  getProducts()
}

// 搜索
const onSearch = () => {
  pageData.value.page = 1
  getProducts()
}

// 重置
const onReset = () => {
  pageData.value.page = 1
  pageData.value.selValue = ''
  getProducts()
}

// 添加生鲜商品
const addGoods = () => {
  isMsg.value = false
  drawer.value.changeOrAddGoods({})
}

// 编辑生鲜商品
const handleEdit = (row) => {
  isMsg.value = true
  drawer.value.changeOrAddGoods(row)
}

// 删除生鲜商品
const handleDelete = async (row) => {
  ElMessageBox.confirm(
    '确定要删除该商品吗？如果删除，该商品下的所有商品评论也会删除。',
    '温馨提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const res = await delGoods(row.product_id)
      console.log(res)
      ElMessage.success('删除成功')
      getProducts()
    })
    .catch(() => {})
}

// 商品详情按钮
const handleData = (row) => {
  dialog.value.changeProduct(row)
}

// 子组件中编辑或添加完商品后，通知父组件更新数据
const updateGoods = () => {
  getProducts()
}

onMounted(() => {
  getProducts()
})
</script>
<template>
  <public-view title="生鲜商品">
    <template #btnbox>
      <el-button type="primary" @click="addGoods">添加生鲜商品</el-button>
    </template>
    <!-- 主体部分 -->
    <el-row>
      <el-col :span="24">
        <el-form inline>
          <el-form-item label="生鲜分类:">
            <select-view v-model="pageData.selValue" width="200px"></select-view>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="onSearch">查找</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-table
          v-loading="loading"
          :data="acticleList"
          height="420"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" align="center" width="100" />
          <el-table-column label="商品图片" align="center" width="auto">
            <template #default="{ row }">
              <el-image
                style="width: 80px; height: 80px"
                :src="row.product_pic"
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
          <el-table-column prop="product_name" label="商品名称" align="center" />
          <el-table-column prop="category_name" label="分类名称" align="center" />
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button size="small" :icon="Share" @click="handleData(row)"
                >详情</el-button
              >
              <el-button
                :disabled="isAdminStart()"
                size="small"
                :icon="Edit"
                type="primary"
                @click="handleEdit(row)"
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
            <el-empty description="还没有生鲜~" />
          </template>
        </el-table>
      </el-col>
      <el-col :span="24">
        <el-pagination
          v-model:current-page="pageData.page"
          v-model:page-size="pageData.pageSize"
          :page-sizes="[4, 8, 10, 15]"
          :background="true"
          layout="jumper, total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          style="margin-top: 20px; justify-content: flex-end"
        />
      </el-col>
    </el-row>

    <!-- 编辑对话框 -->
    <drawer-view ref="drawer" :isMsg="isMsg" @updateGoods="updateGoods"></drawer-view>

    <!-- 详情对话框 -->
    <product-dialog ref="dialog"></product-dialog>
  </public-view>
</template>
<style scoped>
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
.image-slot .el-icon {
  font-size: 20px;
}
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>
