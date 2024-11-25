<script setup>
import { ref, watch } from 'vue'
import { setMemberGrade } from '@/api/member'
const emit = defineEmits('updateData')

let dialogTableVisible = ref(false)
const gradeValue = ref()
const name = ref('')
const id = ref(null)
const gradeList = ref([
  { label: '超级管理员', value: 0 },
  { label: '普通管理员', value: 1 }
])

const dialogFunct = (data) => {
  dialogTableVisible.value = true
  gradeValue.value = data.grade
  name.value = data.name
  id.value = data.id
}
watch(gradeList.value, (newVal) => {
  gradeValue.value = newVal
})

defineExpose({
  dialogFunct
})
// 确定
const confirmClick = async () => {
  const res = await setMemberGrade(id.value, gradeValue.value)
  console.log(res)
  if (res.status === 200) {
    emit('updateData')
    ElMessage.success('修改成功')
  }
  dialogTableVisible.value = false
}
</script>
<template>
  <el-row>
    <el-col :span="24">
      <el-dialog v-model="dialogTableVisible" :show-close="false" width="500">
        <template #header="{ titleId, titleClass }">
          <div class="my-header">
            <h4 :id="titleId" :class="titleClass">成员 『{{ name }}』</h4>
          </div>
        </template>
        <el-select v-model="gradeValue" placeholder="请选择" style="width: 200px">
          <el-option
            v-for="item in gradeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <template #footer>
          <div style="flex: auto">
            <el-button type="primary" @click="confirmClick">确定</el-button>
            <el-button @click="dialogTableVisible = false">取消</el-button>
          </div>
        </template>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<style scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>
