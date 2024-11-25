<script setup>
import { onMounted, ref } from 'vue'
import { getMember, delMember } from '@/api/member'
import dayjs from 'dayjs'
import DialogItem from './components/DialogItem.vue'
import AddAdmin from './components/AddAdmin.vue'

const adminList = ref([])
const dialogItems = ref(null)
const admin_user = ref(null)

// 获取管理员数据
const getAdmin = async () => {
  const res = await getMember()
  adminList.value = res.data.data.map((element) => ({
    ...element,
    admin_time: dayjs(element.admin_time).format('YYYY-MM-DD')
  }))
}

// 编辑
const handleEdit = (row) => {
  console.log(row)
  dialogItems.value.dialogFunct(row)
}

// 删除
const handleDelete = async (row) => {
  ElMessageBox.confirm(`确定将${row.name}管理员删除吗?`, '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await delMember(row.id)
      if (res.status === 200) {
        ElMessage.success('删除成功')
      }
      getAdmin()
    })
    .catch(() => {})
}

// 添加管理员
const addAdminUser = () => {
  admin_user.value.changeAdmin()
}

// 字传父更新数据
const updataAdmin = () => {
  getAdmin()
}
const updateAddAdmin = () => {
  getAdmin()
}

const getAdminGrade = (data) => {
  return data === 0 ? '超级管理员' : '普通管理员'
}
onMounted(() => {
  getAdmin()
})
</script>
<template>
  <public-view title="成员管理">
    <template #btnbox>
      <el-button type="primary" @click="addAdminUser">添加管理员</el-button>
    </template>
    <el-row>
      <el-col :span="24">
        <el-table :data="adminList" height="520" style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="80" />
          <el-table-column label="成员头像" align="center" width="auto">
            <template #default="{ row }">
              <el-image
                style="width: 80px; height: 80px"
                :src="row.user_pic"
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
          <el-table-column prop="name" label="成员姓名" align="center" />
          <el-table-column prop="full_name" label="成员昵称" align="center" />
          <el-table-column prop="sex" label="成员性别" align="center" />
          <el-table-column prop="age" label="成员年龄" align="center" />
          <el-table-column prop="grade" label="成员级别" align="center">
            <template #default="{ row }">
              <span>{{ getAdminGrade(row.grade) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" align="center" />
          <el-table-column prop="admin_time" label="成员创建日期" align="center" />
          <el-table-column label="操作" width="200" align="center">
            <template #default="{ row }">
              <el-button :icon="Edit" size="small" @click="handleEdit(row)"
                >修改级别</el-button
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

    <!-- 对话框 -->
    <dialog-item
      ref="dialogItems"
      :show="dialogTableVisible"
      @updateData="updataAdmin"
    ></dialog-item>

    <!-- 添加管理员 -->
    <add-admin ref="admin_user" @updateAddAdminData="updateAddAdmin"></add-admin>
  </public-view>
</template>
