import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const dataToken = ref('')

    const setToken = (newToken) => {
      token.value = newToken
    }

    const setDataToken = (newDataToken) => {
      dataToken.value = newDataToken
    }

    const removeToken = () => {
      token.value = ''
    }
    const removeDataToken = () => {
      dataToken.value = ''
    }

    return {
      token,
      dataToken,
      setToken,
      removeToken,
      setDataToken,
      removeDataToken
    }
  },
  {
    persist: true
  }
)
