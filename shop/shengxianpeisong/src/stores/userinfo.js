import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo } from '@/api/user.js'

export const useUserInfoStore = defineStore(
  'userInfo',
  () => {
    // 获取用户数据
    const users = ref({})
    const getUserData = async () => {
      const res = await getUserInfo()
      console.log(res)
      users.value = res.data.data
    }
    const removeUserData = () => {
      users.value = ''
      localStorage.removeItem('userInfo')
    }

    return {
      users,
      getUserData,
      removeUserData
    }
  },
  {
    // 持久化设置
    persist: true
  }
)
