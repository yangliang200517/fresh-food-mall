import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCartList, getNewCartList, setDeleteCartList } from '@/api/cart'
import { useUserInfoStore } from './userinfo'

export const useCartStore = defineStore(
  'cart',
  () => {
    // 初始化购物车列表
    const cartList = ref([])
    const selCartList = ref([])
    const cartListId = ref([])

    // 从数据库获取购物车列表
    const getCartData = async () => {
      const userInfoStore = useUserInfoStore()
      console.log(userInfoStore.users.user_id)
      const res = await getCartList(userInfoStore.users.user_id)
      res.data.cartList.forEach((item) => {
        item.isChecked = true
      })

      cartList.value = res.data.cartList
      cartListId.value = cartList.value.map((item) => {
        return item.cart_id
      })

      const newList = cartList.value.filter((item) => item.isChecked === true)
      selCartList.value = newList
    }

    // 求购物车商品总数量
    const getCartCount = () => {
      return cartList.value.length
    }

    // 购物车中选中的商品
    const getSelectCartList = () => {
      return cartList.value.filter((item) => item.isChecked === true)
    }

    // 选中的总数
    const getSelectCount = () => {
      return getSelectCartList().reduce((sum, item) => {
        return sum + item.quantity
      }, 0)
    }

    // 选中的商品的总价
    const getSelectPrice = () => {
      return Number(
        getSelectCartList()
          .reduce((sum, item) => {
            return sum + item.quantity * item.price
          }, 0)
          .toFixed(2)
      )
    }

    // 点击复选框切换选中状态
    const setCartListChecked = (cartId) => {
      const cartItem = cartList.value.find((item) => item.cart_id === cartId)
      cartItem.isChecked = !cartItem.isChecked

      const newList = cartList.value.filter((item) => item.isChecked === true)
      console.log(newList)
      selCartList.value = newList
    }

    // 是否全选
    const isAllChecked = () => {
      return cartList.value.every((item) => item.isChecked)
    }

    // 切换全选
    const toogleAllChecked = (checkedType) => {
      cartList.value.forEach((item) => {
        item.isChecked = checkedType
      })
      const newList = cartList.value.filter((item) => item.isChecked === true)
      selCartList.value = newList
    }

    // 在购物车中先本地更新数据
    const changeLocalhostData = ({ cartId, productId, quantity }) => {
      const goods = cartList.value.find(
        (item) => item.cart_id === cartId || item.product_id === productId
      )
      goods.quantity = quantity
    }

    // 在购物车中修改商品数量并保存
    const changeCartItemQuantity = async (obj) => {
      const { cartId, productId, quantity } = obj
      console.log(cartId, productId, quantity)
      // 先本地存一下
      changeLocalhostData({ cartId, productId, quantity })

      const res = await getNewCartList(cartId, productId, quantity)
      console.log(res)
    }

    // 删除购物车商品
    const deleteCartItem = async () => {
      const selectCartList = getSelectCartList()
      const cartId = selectCartList.map((item) => item.cart_id)
      const res = await setDeleteCartList(cartId)

      // 删除成功后重新渲染
      getCartData()
      console.log(res)
    }

    return {
      cartList,
      selCartList,
      cartListId,
      getCartData,
      getCartCount,
      getSelectCartList,
      getSelectCount,
      getSelectPrice,
      setCartListChecked,
      isAllChecked,
      toogleAllChecked,
      changeCartItemQuantity,
      changeLocalhostData,
      deleteCartItem
    }
  },
  // {
  //   // 持久化设置
  //   persist: true
  // }
  {
    persist: {
      key: 'cartListId',
      paths: ['cartListId']
    }
  }
)
