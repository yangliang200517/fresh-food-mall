<script setup>
import navBar from '@/components/navBar.vue'
import { ref } from 'vue'
import { useUserInfoStore } from '@/stores/userinfo'
import { updateUserData } from '@/api/user'
import { showSuccessToast } from 'vant'

// 结构pinia中的用户数据
const {
  users: { user_id, name, full_name, sex, age, email },
  getUserData
} = useUserInfoStore()

// 用户数据初始化，跟结构的数据一样
const userMessage = ref({
  user_id,
  full_name,
  sex,
  age,
  email,
  name
})

// 昵称自定义规则
const fullNameIsValidator = (value) => {
  const valLength = value.length

  if (valLength < 2 || valLength > 10) {
    return '昵称长度只能在2-10位之间'
  }
  if (!/^[\u4e00-\u9fa5A-Za-z0-9]|[\u4e00-\u9fa5]|[A-Za-z]|\d$/.test(value)) {
    return '只能包含中英文和数字'
  }
}

// 性别自定义规则
const sexIsValidator = (value) => {
  if (!/^(男|女)$/.test(value)) {
    return '请输入正确的性别'
  }
}

// 年龄自定义规则
const ageIsValidator = (value) => {
  if (value > 100) {
    return '请输入正确的年龄'
  }
}

// 邮箱自定义规则
const emailIsValidator = (value) => {
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    return '请输入正确的邮箱'
  }
}

// 自定义校验规则
const rules = {
  full_name: [
    {
      required: true,
      message: '昵称不能为空',
      trigger: 'onSubmit'
    },
    {
      validator: fullNameIsValidator,
      message: '',
      trigger: 'onSubmit'
    }
  ],
  sex: [
    {
      required: true,
      message: '性别不能为空',
      trigger: 'onSubmit'
    },
    {
      validator: sexIsValidator,
      message: '',
      trigger: 'onSubmit'
    }
  ],
  age: [
    {
      required: true,
      message: '年龄不能为空',
      trigger: 'onSubmit'
    },
    {
      validator: ageIsValidator,
      message: '',
      trigger: 'onSubmit'
    }
  ],
  email: [
    {
      required: true,
      message: '邮箱不能为空',
      trigger: 'onSubmit'
    },
    {
      validator: emailIsValidator,
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
  const res = await updateUserData(userMessage.value)
  if (res.data.status === 200) {
    showSuccessToast(res.data.message)
  }
  setTimeout(() => {
    getUserData()
  }, 800)
}

// 下拉刷新
const loading = ref(false)
const onRefresh = () => {
  setTimeout(() => {
    getUserData()
    loading.value = false
  }, 1000)
}
</script>
<template>
  <!-- 标题 -->
  <navBar :isShow="true">
    <template #title> 个人信息 </template>
    <template #left>
      <van-icon name="arrow-left" size="18" />
    </template>
  </navBar>

  <van-pull-refresh class="pullHeight" v-model="loading" @refresh="onRefresh">
    <!-- 信息展示 -->
    <van-row>
      <van-col span="24">
        <van-form class="pullHeight" ref="forms" @submit="onSubmit">
          <van-field
            v-model="userMessage.name"
            name="name"
            label="姓名"
            placeholder="姓名"
            label-align="top"
            readonly
          />
          <van-field
            v-model="userMessage.full_name"
            name="full_name"
            label="昵称(网名)"
            placeholder="昵称"
            label-align="top"
            :rules="rules.full_name"
          />
          <van-field
            v-model="userMessage.sex"
            name="sex"
            label="性别"
            placeholder="性别"
            label-align="top"
            :rules="rules.sex"
          />
          <van-field
            v-model="userMessage.age"
            type="digit"
            name="age"
            label="年龄"
            placeholder="年龄"
            label-align="top"
            :rules="rules.age"
          />
          <van-field
            v-model="userMessage.email"
            type="email"
            name="email"
            label="邮箱"
            placeholder="邮箱"
            label-align="top"
            :rules="rules.email"
          />
          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit">
              确认修改
            </van-button>
          </div>
        </van-form>
      </van-col>
    </van-row>
  </van-pull-refresh>
</template>
<style lang="less" scoped>
.pullHeight {
  height: 100%;
}
</style>
