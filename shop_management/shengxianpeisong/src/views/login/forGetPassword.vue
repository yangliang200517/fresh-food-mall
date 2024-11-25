<script setup>
import { ref } from 'vue'
import { forGetPassword } from '@/api/user'
import { useUserInfoStore } from '@/stores/userinfo'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userInfoStore = useUserInfoStore()
const UserStore = useUserStore()
const router = useRouter()
const form = ref({
  email: '',
  password: ''
})

const onSubmit = async () => {
  const res = await forGetPassword(form.value)
  if (res.status === 200) {
    ElMessage.success('密码重置成功，请重新登录')
  }
  UserStore.removeToken()
  UserStore.removeDataToken()
  userInfoStore.setUserInfo({})
  router.push(`/login`)
}
</script>
<template>
  <el-row class="cards">
    <el-col :span="7">
      <el-card>
        <template #header>
          <div><h3>忘记密码</h3></div>
        </template>
        <el-form :model="form" label-width="auto" style="max-width: 600px">
          <el-form-item label="邮箱">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="form.password" placeholder="请输入新密码" />
          </el-form-item>
          <el-form-item class="card_btn">
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>
<style scoped>
.cards {
  height: 100vh;
  justify-content: center;
  align-items: center;
}
.card_btn {
  float: right;
}
h3 {
  font-weight: 400;
}
</style>
