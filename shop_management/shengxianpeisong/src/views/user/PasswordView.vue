<script setup>
import { reactive } from 'vue'
import { updatePassword } from '@/api/user'
import { useUserInfoStore } from '@/stores/userinfo'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userInfoStore = useUserInfoStore()
const UserStore = useUserStore()
const router = useRouter()

const form = reactive({
  oldPwd: '',
  newPwd: ''
})
const onSubmit = async () => {
  const res = await updatePassword(form.newPwd, form.oldPwd)
  if (res.status === 200) {
    ElMessage.success('密码修改成功，请重新登录')
  }
  UserStore.removeToken()
  UserStore.removeDataToken()
  userInfoStore.setUserInfo({})
  router.push(`/login`)
}
</script>
<template>
  <public-view title="修改密码">
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="旧密码">
        <el-input v-model="form.oldPwd" placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="form.newPwd" placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改</el-button>
      </el-form-item>
    </el-form>
  </public-view>
</template>
