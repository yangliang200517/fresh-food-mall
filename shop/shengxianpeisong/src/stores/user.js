import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // 获取本地用户数据
    const getToken = () => {
      const defaultToken = {
        token: ''
      }
      const result = localStorage.getItem('user')
      return result ? JSON.parse(result) : defaultToken
    }

    const getTokenOut = () => {
      const defaultTokenOut = {
        tokenOut: new Date(Date.now() + 60000).toISOString()
      }
      const result = localStorage.getItem('tokenOutTime')
      return result ? JSON.parse(result) : defaultTokenOut
    }

    // 用户数据初始化
    const token = ref(getToken())
    const tokenOut = ref(getTokenOut())

    // 设置用户数据
    const setToken = (newDate) => {
      token.value = newDate
      localStorage.setItem('user', JSON.stringify(newDate))
    }

    const setTokenOut = (outData) => {
      tokenOut.value = outData
      localStorage.setItem('tokenOutTime', JSON.stringify(outData))
    }

    // 删除用户数据
    const removeToken = () => {
      token.value = ''
      localStorage.removeItem('user')
    }

    const removeTokenOut = () => {
      tokenOut.value = ''
      localStorage.removeItem('tokenOutTime')
    }

    return {
      token,
      tokenOut,
      setToken,
      getToken,
      removeToken,
      getTokenOut,
      setTokenOut,
      removeTokenOut
    }
  },
  {
    // 持久化设置
    persist: true
  }
)
