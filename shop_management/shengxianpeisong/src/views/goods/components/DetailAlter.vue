<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { setAndAddGoodsDetail } from '@/api/goodsdetail'
import DetailSelect from './DetailSelect.vue'
const emits = defineEmits(['updateDetailImg'])
const props = defineProps({
  isMsg: Boolean
})

const dialogTableVisible = ref(false)
let imgValue = ref('')
let product_id = ref()

const detailModel = ref({})
const defaultModel = ref({
  product_id: '',
  detail_img: '',
  detail_time: ''
})

const changeOrCarousel = (data) => {
  console.log(data)
  dialogTableVisible.value = true

  // 有id就把c传过来的数据给初始化数据，没有就把默认数据给初始化数据
  if (data.detail_id) {
    detailModel.value = { ...data }
    console.log(detailModel.value)
  } else {
    detailModel.value = { ...defaultModel.value }
    console.log(detailModel.value)
  }
}
// 上传图片
const selectPic = (uploadFile) => {
  detailModel.value.detail_img = URL.createObjectURL(uploadFile.raw)
  imgValue.value = uploadFile.raw
}

// 监听子组件传递的选择值
const handleSelectChange = (value) => {
  console.log(value)
  product_id.value = value // 更新 product_id 的值
}

// 编辑或添加按钮
const confirmClick = async () => {
  const formDatas = new FormData()
  // formDatas.append('detail_img', imgValue.value)
  detailModel.value.detail_img = imgValue.value
  detailModel.value.product_id = product_id.value
  Object.entries(detailModel.value).forEach(([key, value]) => {
    console.log(key, value)
    formDatas.append(key, value)
  })
  const res = await setAndAddGoodsDetail(formDatas)
  console.log(res)

  ElMessage({
    message: props.isMsg ? '编辑完成' : '添加完成',
    type: 'success'
  })
  dialogTableVisible.value = false
  emits('updateDetailImg')
}
defineExpose({
  changeOrCarousel
})
</script>
<template>
  <el-dialog
    v-model="dialogTableVisible"
    :show-close="false"
    :title="isMsg ? '编辑生鲜详情图片' : '添加生鲜详情图片'"
    width="400"
  >
    <el-row class="select_box" v-if="!isMsg">
      <el-col :span="24">
        <detail-select @handleSelectChange="handleSelectChange"></detail-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="selectPic"
        >
          <img
            v-if="detailModel.detail_img"
            :src="detailModel.detail_img"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-col>
    </el-row>
    <template #footer>
      <div style="flex: auto">
        <el-button type="primary" @click="confirmClick(isMsg)">{{
          isMsg ? '确定' : '添加'
        }}</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped>
.avatar-uploader .avatar {
  width: 300px;
  height: 300px;
  display: block;
}
.select_box {
  margin-bottom: 20px;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 300px;
  text-align: center;
}
</style>
