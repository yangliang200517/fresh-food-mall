<script setup>
import { ref } from 'vue'
import { addArticle, setArticle } from '@/api/article'
import { ElMessage } from 'element-plus'

const dialogFormVisible = ref(false)
const form = ref()
const formModel = ref({
  category_name: ''
})

const rules = {
  category_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^[\u4e00-\u9fa5]{2,5}$/,
      message: '分类名称必须是2-5位的中文字符',
      trigger: 'blur'
    }
  ]
}

// 编辑或添加按钮
const changeOrAddArticle = (data) => {
  dialogFormVisible.value = true
  formModel.value = { ...data }
}

// 提交
const emit = defineEmits(['updateArticle'])
const submitArticle = async () => {
  await form.value.validate()
  const isId = formModel.value.category_id

  if (isId) {
    await setArticle(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await addArticle(formModel.value)
    ElMessage.success('添加成功')
  }

  dialogFormVisible.value = false
  emit('updateArticle')
}

// 暴露出去
defineExpose({
  changeOrAddArticle
})
</script>
<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="formModel.category_id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form ref="form" :model="formModel" :rules="rules">
      <el-form-item label="分类名称" prop="category_name">
        <el-input v-model="formModel.category_name" placeholder="请输入分类名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitArticle">{{
          formModel.category_id ? '编辑' : '添加'
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
