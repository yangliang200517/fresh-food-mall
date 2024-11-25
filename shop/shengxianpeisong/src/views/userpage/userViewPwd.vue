<script setup>
import { ref } from 'vue'
import navBar from '@/components/navBar.vue'
import { regUserPwd } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { useUserInfoStore } from '@/stores/userinfo'
import { useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'

const userStore = useUserStore()
const userInfoStore = useUserInfoStore()
const router = useRouter()

// 表单数据初始化
const userPwd = ref({
  oldPwd: '',
  newPwd: '',
  rePwd: ''
})

// 密码验证自定义方法
const newPasswordIsValidator = (value) => {
  const valsize = value.length
  if (value === userPwd.value.oldPwd) {
    return '新密码与旧密码相同'
  }
  if (valsize < 6 || valsize > 12) {
    return '新密码必须在 6-12 个字符之间'
  }
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/.test(value)) {
    return '新密码只能包含字母和数字'
  }
}
const rePasswordIsValidator = (value) => {
  const valsize = value.length

  if (valsize < 6 || valsize > 12) {
    return '确认新密码必须在 6-12 个字符之间'
  }
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/.test(value)) {
    return '确认新密码只能包含字母和数字'
  }
  if (value !== userPwd.value.newPwd) {
    return '确认新密码与新密码不符'
  }
}

// 密码验证规则
const rules = {
  oldPassword: [
    {
      required: true,
      message: '旧密码不能为空',
      trigger: 'onSubmit'
    }
  ],
  newPassword: [
    {
      required: true,
      message: '新密码不能为空',
      trigger: 'onSubmit'
    },
    {
      validator: newPasswordIsValidator,
      message: '',
      trigger: 'onSubmit'
    }
  ],
  rePassword: [
    {
      required: true,
      message: '确认新密码不能为空',
      trigger: 'onSubmit'
    },
    {
      validator: rePasswordIsValidator,
      message: '',
      trigger: 'onSubmit'
    }
  ]
}

const forms = ref(null)
// 提交按钮
const onSubmit = async () => {
  // 如果校验成功
  await forms.value.validate()
  const res = await regUserPwd(userPwd.value)
  console.log(res)
  if (res.data.status === 200) {
    showSuccessToast(`${res.data.message} 请重新登录`)
    userStore.removeToken()
    userInfoStore.removeUserData()
    router.push('/login')
  }
}
</script>
<template>
  <!-- 标题 -->
  <navBar :isShow="true">
    <template #title>修改密码</template>
    <template #left>
      <van-icon name="arrow-left" size="18" />
    </template>
  </navBar>

  <!-- 表单 -->
  <van-form ref="forms" @submit="onSubmit">
    <van-field
      v-model="userPwd.oldPwd"
      type="password"
      name="oldPwd"
      label="旧密码"
      placeholder="请输入旧密码"
      :rules="rules.oldPassword"
    />
    <van-field
      v-model="userPwd.newPwd"
      type="password"
      name="newPwd"
      label="新密码"
      placeholder="请输入新密码"
      :rules="rules.newPassword"
    />
    <van-field
      v-model="userPwd.rePwd"
      type="password"
      name="rePwd"
      label="确认新密码"
      placeholder="请输入确认新密码"
      :rules="rules.rePassword"
    />
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit"> 修改密码 </van-button>
    </div>
  </van-form>
</template>
<style lang="less" scoped></style>
