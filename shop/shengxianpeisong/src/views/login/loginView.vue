<script setup>
import { ref, watch } from 'vue'
import { userLogin, userReg } from '@/api/user'
import { showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const isLogin = ref(true)
const forms = ref(null)
const userStore = useUserStore()

// 初始化表单数据
const loginForm = ref({
  name: '',
  password: '',
  repassword: ''
})

// 登陆方法
const onSubmit = async () => {
  await forms.value.validate()
  const res = await userLogin(loginForm.value)
  console.log(res)
  if (res.data.status === 200) {
    console.log(res)
    showSuccessToast(res.data.message)

    // 存入token
    userStore.setToken(res.data.token)
    userStore.setTokenOut(res.data.tokenExpiresAt)
    router.push('/')
  }
}

// 注册方法
const regSubmit = async () => {
  await forms.value.validate()
  const res = await userReg(loginForm.value)
  console.log(res)
  if (res.data.status === 200) {
    showSuccessToast(res.data.message)
    isLogin.value = true
  }
}

// 用户名自定义验证方法
const nameIsValidator = (value) => {
  const valsize = value.length
  if (valsize < 3 || valsize > 10) {
    return '用户名必须在 3-10 个字符之间'
  }
  if (!/^[a-zA-Z0-9]/.test(value)) {
    return '用户名必须为字母或数字'
  }
}

// 密码自定义验证方法
const passwordIsValidator = (value) => {
  const valsize = value.length
  if (valsize < 6 || valsize > 12) {
    return '密码必须在 6-12 个字符之间'
  }
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/.test(value)) {
    return '密码只能包含字母和数字'
  }
}

// 确认密码自定义验证方法
const repasswordIsValidator = (value) => {
  const valsize = value.length
  if (valsize < 6 || valsize > 12) {
    return '密码必须在 6-12 个字符之间'
  }
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/.test(value)) {
    return '密码只能包含字母和数字'
  }
  if (value !== loginForm.value.password) {
    return '确认密码与密码不符'
  }
}

// 输入框验证规则
const rules = {
  name: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'onSubmit'
    },
    {
      validator: nameIsValidator,
      message: '',
      trigger: 'onSubmit'
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'onSubmit'
    },
    {
      validator: passwordIsValidator,
      message: '',
      trigger: 'onSubmit'
    }
  ],
  repassword: [
    {
      required: true,
      message: '确认密码不能为空',
      trigger: 'onSubmit'
    },
    {
      validator: repasswordIsValidator,
      message: '',
      trigger: 'onSubmit'
    }
  ]
}

const loginToggleIcon = ref(false)
const regToggleIcon = ref(false)
const reRegToggleIcon = ref(false)

// 显示密码
const togglePwd = (type) => {
  if (type === 'login') {
    loginToggleIcon.value = !loginToggleIcon.value
  } else if (type === 'reguser') {
    regToggleIcon.value = !regToggleIcon.value
  } else {
    reRegToggleIcon.value = !reRegToggleIcon.value
  }
}

// 登陆注册切换时清空输入框内容
watch(isLogin, () => {
  loginForm.value = {
    name: '',
    password: '',
    repassword: ''
  }
})
</script>

<template>
  <div class="bodyskrap">
    <!-- 标题 -->
    <van-nav-bar :title="isLogin ? '用户登录' : '用户注册'" />
    <van-row>
      <van-col span="24">
        <div class="title">
          <p>生鲜商城</p>
        </div>
      </van-col>
    </van-row>

    <!-- 登录 -->
    <van-form v-if="isLogin" ref="forms" @submit="onSubmit">
      <van-row justify="center">
        <van-col span="18">
          <van-field
            class="inputborder"
            v-model="loginForm.name"
            name="name"
            placeholder="请输入用户名"
            :rules="rules.name"
          />
        </van-col>
        <van-col span="18">
          <van-field
            class="inputborder"
            v-model="loginForm.password"
            :type="loginToggleIcon ? 'text' : 'password'"
            name="password"
            placeholder="请输入密码"
            @click-right-icon="togglePwd('login')"
            :right-icon="loginToggleIcon ? 'eye-o' : 'closed-eye'"
            :rules="rules.password"
          />
        </van-col>
      </van-row>
      <van-row justify="end">
        <van-col span="8">
          <van-cell title="立即注册" @click="isLogin = false" />
        </van-col>
      </van-row>
      <van-row justify="center">
        <van-col span="20">
          <div class="buttonfooset">
            <van-button round block type="primary" native-type="submit">
              登录
            </van-button>
          </div>
        </van-col>
      </van-row>
    </van-form>

    <!-- 注册 -->
    <van-form v-else ref="forms" @submit="regSubmit">
      <van-row justify="center">
        <van-col span="18">
          <van-field
            class="inputborder"
            v-model="loginForm.name"
            name="name"
            placeholder="请输入用户名"
            :rules="rules.name"
          />
        </van-col>
        <van-col span="18">
          <van-field
            class="inputborder"
            v-model="loginForm.password"
            :type="regToggleIcon ? 'text' : 'password'"
            name="password"
            placeholder="请输入密码"
            @click-right-icon="togglePwd('reguser')"
            :right-icon="regToggleIcon ? 'eye-o' : 'closed-eye'"
            :rules="rules.password"
          />
        </van-col>
        <van-col span="18">
          <van-field
            class="inputborder"
            v-model="loginForm.repassword"
            :type="reRegToggleIcon ? 'text' : 'password'"
            name="repassword"
            placeholder="请输入确认密码"
            @click-right-icon="togglePwd('rereguser')"
            :right-icon="reRegToggleIcon ? 'eye-o' : 'closed-eye'"
            :rules="rules.repassword"
          />
        </van-col>
      </van-row>
      <van-row justify="end">
        <van-col span="8">
          <van-cell title="立即登录" @click="isLogin = true" />
        </van-col>
      </van-row>
      <van-row justify="center">
        <van-col span="20">
          <div class="buttonfooset">
            <van-button round block type="primary" native-type="submit">
              注册
            </van-button>
          </div>
        </van-col>
      </van-row>
    </van-form>
  </div>
</template>

<style scoped lang="less">
.bodyskrap {
  height: 100%;
  background-color: #fff;
  .inputborder {
    border-bottom: 1px solid #f3f1f2;
  }
  .title {
    padding: 30px 20px 40px 20px;
    text-align: center;
    p {
      font-size: 32px;
      letter-spacing: 3px;
    }
  }
  .buttonfooset {
    margin-top: 50px;
  }
}
</style>
