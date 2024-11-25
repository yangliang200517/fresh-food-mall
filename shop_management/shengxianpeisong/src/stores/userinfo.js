import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserData } from '@/api/user'

export const useUserInfoStore = defineStore(
  'userinfo',
  () => {
    const user = ref({})

    // 获取用户信息
    const getUserInfo = async () => {
      const res = await getUserData()
      user.value = res.data.data
    }

    // 删除用户信息
    const setUserInfo = (newObj) => {
      user.value = newObj
    }
    return {
      user,
      getUserInfo,
      setUserInfo
    }
  },
  {
    persist: true
  }
)
