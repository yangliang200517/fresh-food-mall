<script setup>
import { onMounted, ref } from 'vue'
import { setAdminPic, getAdminPic } from '@/api/user'
import { useUserInfoStore } from '@/stores/userinfo'

const userInfoStore = useUserInfoStore()
let imgValue = ref('')
const adminPic = ref({
  user_pic: ''
})

// 上传头像
const selectPic = async (uploadFile) => {
  adminPic.value.user_pic = URL.createObjectURL(uploadFile.raw)
  imgValue.value = uploadFile.raw
}

// 修改头像
const confirmClick = async () => {
  if (!imgValue.value) {
    ElMessage.error('请选择头像')
    return
  }

  const formDatas = new FormData()
  formDatas.append('user_pic', imgValue.value)
  adminPic.value.user_pic = imgValue.value

  const res = await setAdminPic(adminPic.value, formDatas)
  if (res.data.status === 200) {
    ElMessage.success('头像更新成功')
  }
  getPic()
  userInfoStore.getUserInfo()
}

// 获取头像
const getPic = async () => {
  const res = await getAdminPic()
  console.log(res)
  adminPic.value = res.data.data[0]
  console.log(adminPic.value)
}

onMounted(() => {
  getPic()
})
</script>
<template>
  <public-view title="个人头像">
    <el-upload
      class="avatar-uploader"
      :show-file-list="false"
      :auto-upload="false"
      :on-change="selectPic"
    >
      <img v-if="adminPic.user_pic" :src="adminPic.user_pic" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <el-button type="primary" @click="confirmClick">修改头像</el-button>
  </public-view>
</template>
<style scoped>
.avatar-uploader .avatar {
  width: 300px;
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
  width: 300px;
  height: 300px;
  text-align: center;
}
</style>
