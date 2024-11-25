<script setup>
import { ref } from 'vue'
import selectView from '@/components/selectView.vue'
import { setGoods } from '@/api/goods'
import { Plus } from '@element-plus/icons-vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
const emits = defineEmits(['updateGoods'])
const props = defineProps({
  isMsg: Boolean
})

const form = ref()
let visibilityBinding = ref(false)
let imgValue = ref('')

let defaultModel = {
  category_id: '',
  description: '',
  old_price: 0,
  price: 0,
  product_name: '',
  product_pic: '',
  stock: 0
}
const formModel = ref({
  category_id: '',
  description: '',
  old_price: 0,
  price: 0,
  product_name: '',
  product_pic: '',
  stock: 0
})

const rules = {
  category_id: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  product_name: [
    { required: true, message: '请输入生鲜名称', trigger: 'blur' },
    {
      pattern: /^[\u4e00-\u9fa5]{2,5}$/,
      message: '分类名称必须是2-5位的中文字符',
      trigger: 'blur'
    }
  ],
  description: [
    { required: true, message: '请输入生鲜描述信息', trigger: 'blur' }
    // {
    //   pattern: /^[\u4e00-\u9fa5]$/,
    //   message: '分类名称必须是中文字符',
    //   trigger: 'blur'
    // }
  ],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存数量', trigger: 'blur' }]
}

const changeOrAddGoods = (data) => {
  visibilityBinding.value = true

  if (data.product_id) {
    formModel.value = { ...data }
  } else {
    formModel.value = { ...defaultModel }
  }
}

// 上传头像
const selectPic = async (uploadFile) => {
  formModel.value.product_pic = URL.createObjectURL(uploadFile.raw)
  imgValue.value = uploadFile.raw
}

// 添加 or 确定
const confirmClick = async (tagBtn) => {
  await form.value.validate()
  const formDatas = new FormData()
  formDatas.append('product_pic', imgValue.value)
  formModel.value.product_pic = imgValue.value
  // isMsg 为 true 就是编辑操作，为 false 就是添加操作
  if (tagBtn === true) {
    const res = await setGoods(formModel.value, formDatas)
    console.log(res)
  } else {
    const res = await setGoods(formModel.value, formDatas)
    console.log(res)
  }

  ElMessage({
    message: props.isMsg ? '编辑完成' : '添加完成',
    type: 'success'
  })
  visibilityBinding.value = false
  emits('updateGoods')
}

defineExpose({
  changeOrAddGoods
})
</script>
<template>
  <el-drawer
    v-model="visibilityBinding"
    :title="isMsg ? '编辑生鲜' : '添加生鲜'"
    size="60%"
  >
    <template #default>
      <el-form ref="form" :model="formModel" :rules="rules">
        <el-form-item label="生鲜名称" prop="product_name">
          <el-input v-model="formModel.product_name" placeholder="请输入生鲜名称" />
        </el-form-item>
        <el-form-item label="分类名称" prop="category_id">
          <select-view v-model="formModel.category_id" width="100%"></select-view>
        </el-form-item>
        <el-form-item label="生鲜现价" prop="price">
          <el-input-number v-model="formModel.price" :min="0" />
        </el-form-item>
        <el-form-item label="生鲜原价">
          <el-input-number v-model="formModel.old_price" :min="0" />
        </el-form-item>
        <el-form-item label="生鲜数量" prop="stock">
          <el-input-number v-model="formModel.stock" :min="0" />
        </el-form-item>
        <el-form-item label="生鲜头像">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="selectPic"
          >
            <img
              v-if="formModel.product_pic"
              :src="formModel.product_pic"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="生鲜描述" prop="description">
          <el-input
            v-model="formModel.description"
            type="textarea"
            placeholder="请输入生鲜描述"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button type="primary" @click="confirmClick(isMsg)">{{
          isMsg ? '确定' : '添加'
        }}</el-button>
        <el-button @click="visibilityBinding = false">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<style scoped lang="less">
.avatar-uploader {
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
.qui-text {
  width: 100%;
  /deep/ .ql-editor {
    height: 200px;
  }
}
</style>
<style lang="less">
.avatar-uploader {
  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    &:hover {
      border-color: var(--el-color-primary);
    }
  }
  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
}
</style>
