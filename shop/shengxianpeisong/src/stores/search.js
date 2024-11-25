import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore(
  'search',
  () => {
    // 定义初始化数据 历史搜索
    const searchText = ref([])

    // 添加历史搜索
    const addSearchData = (value) => {
      const valueId = searchText.value.indexOf(value)
      if (valueId !== -1) {
        // 存在数组中
        searchText.value.splice(valueId, 1)
      }
      searchText.value.unshift(value)
    }

    // 清空历史搜索
    const clearSearchData = () => {
      searchText.value = []
    }

    // 返回历史搜索数据长度
    const searchLength = () => {
      return searchText.value.length
    }

    return {
      searchText,
      addSearchData,
      clearSearchData,
      searchLength
    }
  },
  {
    // 持久化设置
    persist: true
  }
)
