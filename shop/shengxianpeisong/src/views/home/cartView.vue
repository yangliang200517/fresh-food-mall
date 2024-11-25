<script setup>
import { onMounted, ref, watch } from 'vue'
import stepperBox from '@/components/stepperBox.vue'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const cartStore = useCartStore()
const userStore = useUserStore()
const router = useRouter()
const toggleType = ref(true)

// 结算按钮
const onSubmit = () => {
  const selCartList = cartStore.getSelectCartList()
  // 选中商品跳转
  if (selCartList.length > 0) {
    const stockCartItem = selCartList.filter((item) => item.stock === 0)

    if (stockCartItem.length > 0) {
      showToast('无法购买已售完的商品')
    } else {
      router.push({
        path: '/order',
        query: {
          type: 'cart',
          cartId: cartStore.selCartList.map((item) => item.cart_id).join(',')
        }
      })
    }
  } else {
    return showToast({
      message: '请选择商品'
    })
  }
}

// 删除商品按钮
const onDelete = () => {
  if (cartStore.getSelectCount() === 0) {
    return
  } else {
    cartStore.deleteCartItem()
    toggleType.value = true
  }
}

// 切换商品选中状态
const toggleCheckType = (cartId) => {
  cartStore.setCartListChecked(cartId)
}

// 切换全选状态
const toogleAllCheckCartItem = () => {
  cartStore.toogleAllChecked(!cartStore.isAllChecked())
}

// 更新本地数据
const setNewNumber = (quantity, cartId, productId) => {
  console.log(quantity)
  cartStore.changeCartItemQuantity({ cartId, productId, quantity })
}

// 管理按钮--删除购物车商品
const deleteCartItem = () => {
  toggleType.value = !toggleType.value
}

watch(toggleType, (value) => {
  if (value) {
    cartStore.toogleAllChecked(true)
  } else {
    cartStore.toogleAllChecked(false)
  }
})

const isLogin = () => {
  return userStore.token
}

onMounted(() => {
  if (isLogin()) {
    cartStore.getCartData()
  }
})
</script>

<template>
  <!-- 标题 -->
  <navBar :isShow="false">
    <template #title> 购物车 </template>
  </navBar>
  <van-row v-if="isLogin() && cartStore.cartList.length > 0">
    <van-col span="24">
      <!-- 中间展示部分 -->
      <van-row>
        <van-col span="24">
          <!-- 头部 -->
          <van-row>
            <van-col span="24">
              <van-cell
                :title="`共(${cartStore.getCartCount()})件商品`"
                icon="location-o"
              >
                <template #extra>
                  <van-row @click="deleteCartItem">
                    <van-col span="24"> <van-icon name="list-switch" />管理 </van-col>
                  </van-row>
                </template>
              </van-cell>
            </van-col>
          </van-row>
          <!-- 购物车商品 -->
          <van-row>
            <van-col span="24">
              <van-row
                class="cart_goods"
                v-for="item in cartStore.cartList"
                :key="item.cart_id"
              >
                <van-col class="cart_goods_item cart_goods_check" span="3">
                  <van-checkbox
                    @click="toggleCheckType(item.cart_id)"
                    :checked="item.isChecked"
                  ></van-checkbox>
                </van-col>
                <van-col class="cart_goods_item cart_goods_pic" span="6">
                  <van-image
                    width="80"
                    height="80"
                    fit="cover"
                    position="center"
                    :radius="7"
                    :src="item.product_pic"
                  />
                </van-col>
                <van-col class="cart_goods_item cart_goods_data" span="15">
                  <van-row justify="end" class="cart_goods_item_row">
                    <van-col class="cart_goods_item_font item_font_title" span="23">
                      <van-text-ellipsis :rows="2" :content="item.description" />
                    </van-col>
                    <van-col span="23">
                      <van-row class="cart_goods_item_price_btn_box">
                        <van-col class="cart_goods_item_price" span="12"
                          >￥{{ item.price.toFixed(2) }}</van-col
                        >
                        <van-col span="12" class="cart_goods_item_btn">
                          <stepperBox
                            :cartNumber="item.quantity"
                            :stock="item.stock"
                            @change="
                              (value) =>
                                setNewNumber(value, item.cart_id, item.product_id)
                            "
                          ></stepperBox>
                        </van-col>
                      </van-row>
                    </van-col>
                  </van-row>
                </van-col>
              </van-row>
            </van-col>
          </van-row>
        </van-col>
      </van-row>

      <!-- 底部结算 -->
      <van-row>
        <van-col span="24">
          <van-submit-bar
            :label="
              cartStore.getSelectCount()
                ? `已选${cartStore.getSelectCount()}件，合计:`
                : `合计：`
            "
            :price="cartStore.getSelectPrice() * 100"
          >
            <template #button>
              <van-button v-if="toggleType" type="danger" round @click="onSubmit"
                >结算</van-button
              >
              <van-button v-else type="danger" round @click="onDelete">{{
                `删除(${cartStore.getSelectCount()})`
              }}</van-button>
            </template>
            <van-checkbox
              @click="toogleAllCheckCartItem"
              :checked="cartStore.isAllChecked()"
              >全选</van-checkbox
            >
          </van-submit-bar>
        </van-col>
      </van-row>
    </van-col>
  </van-row>
  <van-row v-else>
    <van-col span="24">
      <van-empty description="购物车空空如也~~快去逛逛吧" />
      <van-row justify="center">
        <van-col span="14" offset="10">
          <van-button round type="success" to="/">去逛逛~</van-button>
        </van-col>
      </van-row>
    </van-col>
  </van-row>
</template>

<style lang="less" scoped>
.van-submit-bar {
  bottom: 50px;
}

.cart_goods {
  background-color: #fff;
  padding: 20px 5px;
  border-radius: 8px;
  margin: 7px 0;
  .cart_goods_item {
    display: flex;
    .cart_goods_item_row {
      width: 100%;
      .cart_goods_item_font {
        font-size: 13px;
      }
      .cart_goods_item_price_btn_box {
        height: 100%;
        .cart_goods_item_price {
          font-size: 15px;
          color: red;
        }
        .cart_goods_item_btn {
          display: flex; /* 将按钮容器设置为 Flex 容器 */
          align-items: flex-end; /* 垂直对齐到容器底部 */
          justify-content: flex-end; /* 水平对齐到容器右侧 */
          padding-right: 10px;
        }
      }
      .item_font_title {
        font-weight: 400;
      }
    }
  }
  .cart_goods_check,
  .cart_goods_pic {
    justify-content: center;
  }
}
</style>
