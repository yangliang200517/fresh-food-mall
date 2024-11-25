<script setup>
import { onMounted, ref, watch } from 'vue'
import { getUserData, setUserData } from '@/api/user'
import { useUserInfoStore } from '@/stores/userinfo'

const userInfoStore = useUserInfoStore()
const formInline = ref({
  name: '',
  full_name: '',
  age: '',
  sex: '',
  grade: undefined
})

const gradeValue = ref(null)
const gradeOption = ref([
  {
    value: 0,
    label: '超级管理员'
  },
  {
    value: 1,
    label: '普通管理员'
  }
])

// 判断管理员等级
const isAdminStart = () => {
  return userInfoStore.user.grade === 0 ? false : true
}

// 获取用户信息
const getUserInfo = async () => {
  const res = await getUserData()
  console.log(res)
  formInline.value = res.data.data
  gradeValue.value = res.data.data.grade
}

// 修改按钮
const onSubmit = async () => {
  console.log('submit!')
  console.log(formInline.value)
  const res = await setUserData(formInline.value)
  console.log(res)
  ElMessage.success('修改成功')
  getUserInfo()
}

// 监听el-select的值变化，更新到formInline的grade字段
watch(gradeValue, (newVal) => {
  formInline.value.grade = newVal
})

onMounted(() => {
  getUserInfo()
})
</script>
<template>
  <public-view title="个人基本资料">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="姓名：">
        <el-input v-model="formInline.name" clearable />
      </el-form-item>
      <el-form-item label="昵称：">
        <el-input v-model="formInline.full_name" clearable />
      </el-form-item>
      <el-form-item label="性别：">
        <el-input v-model="formInline.sex" clearable />
      </el-form-item>
      <el-form-item label="年龄：">
        <el-input v-model="formInline.age" clearable />
      </el-form-item>
      <el-form-item label="职称：">
        <el-select :disabled="isAdminStart()" v-model="gradeValue" style="width: 240px">
          <el-option
            v-for="item in gradeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改</el-button>
      </el-form-item>
    </el-form>
  </public-view>
</template>
<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
