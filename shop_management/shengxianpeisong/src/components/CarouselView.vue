<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { setCarousel } from '@/api/home'
const emits = defineEmits(['updateCarousel'])
const props = defineProps({
  isMsg: Boolean
})

const dialogTableVisible = ref(false)
let imgValue = ref('')

const carouselModel = ref({
  carousel_pic: '',
  carousel_time: ''
})
const defaultModel = ref({
  carousel_pic: '',
  carousel_time: ''
})

const changeOrCarousel = (data) => {
  console.log(data)
  dialogTableVisible.value = true
  // 有id就把c传过来的数据给初始化数据，没有就把默认数据给初始化数据
  if (data.id) {
    carouselModel.value = { ...data }
  } else {
    carouselModel.value = { ...defaultModel.value }
  }
}
// 上传头像
const selectPic = (uploadFile) => {
  carouselModel.value.carousel_pic = URL.createObjectURL(uploadFile.raw)
  imgValue.value = uploadFile.raw
}

// 编辑或添加按钮
const confirmClick = async (isMsg) => {
  const formDatas = new FormData()
  formDatas.append('carousel_pic', imgValue.value)
  carouselModel.value.carousel_pic = imgValue.value
  // isMsg 为 true 就是编辑操作，为 false 就是添加操作
  if (isMsg) {
    console.log(carouselModel.value)
    const res = await setCarousel(carouselModel.value, formDatas)
    console.log(res)
  } else {
    console.log(carouselModel.value)
    const res = await setCarousel(carouselModel.value, formDatas)
    console.log(res)
  }

  ElMessage({
    message: props.isMsg ? '编辑完成' : '添加完成',
    type: 'success'
  })
  dialogTableVisible.value = false
  emits('updateCarousel')
}

defineExpose({
  changeOrCarousel
})
</script>
<template>
  <el-dialog
    v-model="dialogTableVisible"
    :show-close="false"
    :title="isMsg ? '编辑轮播图' : '添加轮播图'"
    width="800"
  >
    <el-upload
      class="avatar-uploader"
      :show-file-list="false"
      :auto-upload="false"
      :on-change="selectPic"
    >
      <img
        v-if="carouselModel.carousel_pic"
        :src="carouselModel.carousel_pic"
        class="avatar"
      />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
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
  width: 700px;
  height: 300px;
  display: block;
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
  width: 700px;
  height: 300px;
  text-align: center;
}
</style>
