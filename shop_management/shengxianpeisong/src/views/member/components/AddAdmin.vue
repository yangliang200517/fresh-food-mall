<script setup>
import { ref, watch } from 'vue'
import { addMember } from '@/api/member'
const emits = defineEmits(['updateAddAdminData'])

const form = ref()
let visibilityBinding = ref(false)

const gradeSexValue = ref('男')
const gradeSexList = ref([
  { label: '男', value: '男' },
  { label: '女', value: '女' }
])

const gradeValue = ref(1)
const gradeList = ref([
  { label: '超级管理员', value: 0 },
  { label: '普通管理员', value: 1 }
])

const formModel = ref({
  name: '',
  sex: gradeSexValue.value,
  password: '',
  age: 0,
  grade: gradeValue.value,
  email: ''
})

const rules = {
  name: [{ required: true, message: '请输入管理员姓名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const changeAdmin = () => {
  visibilityBinding.value = true
}

// 添加
const confirmClick = async () => {
  await form.value.validate()
  const res = await addMember(formModel.value)
  if (res.status === 200) {
    ElMessage.success('添加成功')
  }
  emits('updateAddAdminData')
  visibilityBinding.value = false
}

// 取消
const confirmEdit = () => {
  visibilityBinding.value = false
  formModel.value.name = ''
  formModel.value.password = ''
  formModel.value.email = ''
}
watch(gradeValue, (newVal) => {
  formModel.value.gride = newVal
})
watch(gradeSexValue, (newVal) => {
  formModel.value.sex = newVal
})

defineExpose({
  changeAdmin
})
</script>
<template>
  <el-drawer v-model="visibilityBinding" title="添加管理员" size="60%">
    <template #default>
      <el-form ref="form" :model="formModel" :rules="rules">
        <el-form-item label="管理员姓名" prop="name">
          <el-input v-model="formModel.name" placeholder="请输入管理员姓名" />
        </el-form-item>
        <el-form-item label="管理员邮箱" prop="email">
          <el-input v-model="formModel.email" placeholder="请输入管理员邮箱" />
        </el-form-item>
        <el-form-item label="初始密码" prop="password">
          <el-input v-model="formModel.password" placeholder="请输入初始密码" />
        </el-form-item>
        <el-form-item label="管理员姓别">
          <el-select v-model="gradeSexValue" placeholder="请选择" style="width: 200px">
            <el-option
              v-for="item in gradeSexList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理员年龄">
          <el-input-number v-model="formModel.age" :min="0" />
        </el-form-item>
        <el-form-item label="管理员职级">
          <el-select v-model="gradeValue" placeholder="请选择" style="width: 200px">
            <el-option
              v-for="item in gradeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button type="primary" @click="confirmClick">添加</el-button>
        <el-button @click="confirmEdit">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<style scoped lang="less"></style>
