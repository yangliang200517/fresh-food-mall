<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { userLogin, userReg } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const isShow = ref(true)
const userStore = useUserStore()
const router = useRouter()

// 数据初始化
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
const form = ref()
// 表单验证规则
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 10, message: '用户名必须是2-10位的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/,
      message: '密码必须是6-12位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/,
      message: '密码必须是6-12的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 去注册
const goRegister = () => {
  isShow.value = false
}

// 去登陆
const goLogin = () => {
  isShow.value = true
}

// 注册
const Register = async () => {
  await form.value.validate()
  await userReg(formModel.value)
  ElMessage.success('注册成功，请登录')
  isShow.value = true
}

// 登录
const login = async () => {
  await form.value.validate()
  const res = await userLogin(formModel.value)
  if (res.data.status === 200) {
    console.log(res.data)
    userStore.setToken(res.data.token)
    userStore.setDataToken(res.data.tokenExpiresAt)
    ElMessage.success(res.data.message)
    router.push('/')
  }
}

watch(isShow, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>

<template>
  <el-row class="box">
    <el-col :span="12">
      <el-row class="left_text" justify="center">
        <el-col :span="24"
          ><h1>生鲜配送</h1>
          <h1>后台管理系统</h1></el-col
        >
      </el-row>
    </el-col>
    <el-col :span="5" :offset="3">
      <el-row class="left_text" justify="center">
        <el-col :span="24">
          <el-form
            ref="form"
            :model="formModel"
            :rules="rules"
            size="large"
            v-if="isShow"
          >
            <el-form-item>
              <h1>登录</h1>
            </el-form-item>
            <el-form-item prop="username">
              <el-input
                v-model="formModel.username"
                placeholder="请输入用户名"
                :prefix-icon="User"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="formModel.password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
              />
            </el-form-item>
            <el-form-item>
              <div class="rep_pwd">
                <el-link :underline="false" href="/forgetpwd" type="primary"
                  >忘记密码</el-link
                >
              </div>
            </el-form-item>
            <el-form-item>
              <el-button class="login_btn" type="primary" @click="login">登录</el-button>
            </el-form-item>
            <el-form-item>
              <el-link :underline="false" type="success" @click="goRegister"
                >还没有账户？去注册</el-link
              >
            </el-form-item>
          </el-form>
          <el-form ref="form" :model="formModel" :rules="rules" size="large" v-else>
            <el-form-item>
              <h1>注册</h1>
            </el-form-item>
            <el-form-item prop="username">
              <el-input
                v-model="formModel.username"
                placeholder="请输入用户名"
                :prefix-icon="User"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="formModel.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
              />
            </el-form-item>
            <el-form-item prop="repassword">
              <el-input
                v-model="formModel.repassword"
                type="password"
                placeholder="请确认密码"
                :prefix-icon="Lock"
              />
            </el-form-item>
            <el-form-item>
              <el-button class="login_btn" type="primary" @click="Register"
                >注册</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-link :underline="false" type="success" @click="goLogin">去登录</el-link>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<style scoped>
.box {
  height: 100vh;
}
.left_text {
  height: 100vh;
  align-content: center;
  font-size: 24px;
  text-align: center;
}
/* .form {
  padding: 0 20px;
} */
h1 {
  font-weight: 400;
}
.login_btn {
  width: 100%;
}
.rep_pwd {
  display: flex;
  width: 100%;
  justify-content: end;
}
</style>
