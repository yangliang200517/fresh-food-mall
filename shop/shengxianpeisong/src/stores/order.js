import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserInfoStore } from '@/stores/userinfo'
import { useUserStore } from '@/stores/user'
import { getCommOrderItem } from '@/api/orders'

export const useOrderStore = defineStore(
  'orders',
  () => {
    const userInfoStore = useUserInfoStore()
    const userStore = useUserStore()
    const userId = () => {
      return userInfoStore.users.user_id
    }

    const isLogin = () => {
      return userStore.token
    }

    // 获取未评价和已评价的订单
    const orderList = ref([])
    const getNoCommOrderItem = async (productStatus, isComment) => {
      if (!isLogin()) {
        orderList.value = []
      } else {
        const res = await getCommOrderItem(userId(), productStatus, isComment)
        orderList.value = res.data.orderList
        console.log(res)
      }
    }

    // 获取未评价的订单数量
    const orderLengths = ref(0)
    const getNotCommentorders = async () => {
      const res = await getCommOrderItem(userId(), 2, 0)
      orderLengths.value = res.data.orderList.map((item) => {
        return item.order_detail_id
      })
    }

    return {
      orderList,
      orderLengths,
      getNoCommOrderItem,
      getNotCommentorders
    }
  },
  {
    persist: {
      key: 'orderListId',
      paths: ['orderLengths']
    }
  }
)
