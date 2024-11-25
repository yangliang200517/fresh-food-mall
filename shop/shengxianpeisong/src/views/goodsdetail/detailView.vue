<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getGoodsDetail, getGoodsDetailComment } from '@/api/home'
import { setCartGoods } from '@/api/cart'
import stepperBox from '@/components/stepperBox.vue'
import startview from '@/components/startView.vue'
import { useUserStore } from '@/stores/user'
import { useUserInfoStore } from '@/stores/userinfo'
import { showConfirmDialog, showSuccessToast } from 'vant'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const route = useRoute()
const cartNumber = ref(1)

// 返回上一级
const onClickLeft = () => history.back()

// 权益弹窗
const show = ref(false)
const isShowSheet = () => {
  show.value = true
}

// 获取动态路由传递的参数id
const getCategoryId = () => {
  return Number(route.params.id)
}

// 详情数据初始化
const goods = ref([])
const goodsDetailList = ref([])

// 获取详情页数据
const getCategoryDatas = async () => {
  const res = await getGoodsDetail(getCategoryId())
  goods.value = res.data.goods
  goodsDetailList.value = res.data.goodsItemPic
}

// 获取详情页评论
const commentList = ref([])
const getComment = async () => {
  const res = await getGoodsDetailComment(getCategoryId())
  commentList.value = res.data.commentList
}

// 加入购物车或立即购买弹窗
const showGoods = ref(false)
// 加入购物车或立即购买按钮
const buttonType = ref()
const userStore = useUserStore()

const addiSLogin = () => {
  if (!userStore.token) {
    showConfirmDialog({
      message: '还没有登录，请先登录！',
      confirmButtonText: '去登陆',
      cancelButtonText: '再逛逛'
    })
      .then(() => {
        router.push('/login')
      })
      .catch(() => {})

    return false
  }
  return true
}

const showCart = () => {
  if (addiSLogin()) {
    showGoods.value = true
    buttonType.value = 'cart'
  }
}

const showMenu = () => {
  if (addiSLogin()) {
    showGoods.value = true
    buttonType.value = 'menu'
  }
}

const userInfoStore = useUserInfoStore()
const cartStore = useCartStore()
// 加入购物车或立即购买中的确定按钮
const goodsRunWhere = async () => {
  const userId = userInfoStore.users.user_id
  const quantity = cartNumber.value

  if (buttonType.value === 'cart') {
    const res = await setCartGoods(userId, getCategoryId(), quantity)
    console.log(res)
    cartStore.getCartData()
    showSuccessToast('添加成功')
    showGoods.value = false
  } else if (buttonType.value === 'menu') {
    router.push({
      path: '/order',
      query: {
        type: 'menu',
        productId: getCategoryId(),
        quantity: quantity
      }
    })
  }
}

// 子传父
const newNumber = (newNumbers) => {
  cartNumber.value = newNumbers
}
const isLogin = () => {
  return userStore.token
}
const isBadge = () => {
  if (!isLogin()) {
    return null
  } else {
    if (cartStore.cartListId.length === 0) {
      return null
    } else {
      return cartStore.cartListId.length
    }
  }
}

onMounted(() => {
  getCategoryDatas()
  getComment()
})
</script>
<template>
  <!-- 返回 -->
  <van-row class="header_title_fixed">
    <van-col span="24">
      <van-nav-bar :border="false" left-arrow @click-left="onClickLeft" />
    </van-col>
  </van-row>

  <van-space direction="vertical" fill :size="10">
    <!-- 商品详情轮播 -->
    <van-row>
      <van-col span="24">
        <van-swipe
          v-if="goodsDetailList.length > 0"
          class="my-swipe"
          :height="360"
          :autoplay="3000"
          indicator-color="white"
        >
          <van-swipe-item v-for="item in goodsDetailList" :key="item.detail_id">
            <img class="detail_img" :src="item.detail_img"
          /></van-swipe-item>
          <template #indicator="{ active, total }">
            <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
          </template>
        </van-swipe>
        <van-empty class="imgErr" v-else image="error" description="暂无图片"></van-empty>
      </van-col>
    </van-row>
    <!-- 商品信息 -->
    <van-row class="goods_style_padd">
      <van-col span="24">
        <van-space direction="vertical" fill :size="10">
          <van-row>
            <van-col span="24">
              <van-cell-group inset>
                <van-cell v-for="item in goods" :key="item.category_id">
                  <template #title>
                    <span class="money_price">￥</span>
                    <span class="custom-title">{{ item.price.toFixed(2) }}</span>
                    <span class="old_price">{{
                      item.old_price ? '￥' + item.old_price.toFixed(2) : null
                    }}</span>
                  </template>
                  <template #label>
                    <span class="label_style">{{ item.description }}</span>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-col>
          </van-row>
          <!-- 权益 -->
          <van-row>
            <van-col span="24">
              <van-cell-group inset>
                <van-cell is-link @click="isShowSheet">
                  <template #title>
                    <ul class="oker_list van-ellipsis">
                      <li class="oker_list_item">
                        <span class="oker_list_icon van-cell-icon"
                          ><van-icon name="passed"
                        /></span>
                        <span>七天无理由退货</span>
                      </li>
                      <li class="oker_list_item">
                        <span class="oker_list_icon van-cell-icon"
                          ><van-icon name="passed"
                        /></span>
                        <span>24小时内发货</span>
                      </li>
                    </ul>
                    <div></div>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-col>
          </van-row>
          <!-- 评论 -->
          <van-row class="bottom_margin">
            <van-col span="24">
              <van-cell-group inset>
                <!-- 评论标题 -->
                <van-cell
                  value="查看更多"
                  is-link
                  :to="{ name: 'goodsComment', params: { id: getCategoryId() } }"
                >
                  <template #title>
                    <span class="sink-title">评价</span>
                    <span v-if="commentList.length !== 0">{{
                      `(${
                        commentList.length > 100
                          ? commentList.length + '+'
                          : commentList.length
                      })`
                    }}</span>
                  </template>
                </van-cell>
                <!-- 评论数据 -->
                <van-row>
                  <van-col span="24" style="padding: 8px 15px" v-if="commentList.length">
                    <van-space direction="vertical" :size="20" fill>
                      <van-row
                        v-for="item in commentList.slice(0, 2)"
                        :key="item.category_id"
                        @click="router.push(`/goods/comment/${getCategoryId()}`)"
                      >
                        <!-- 头像 -->
                        <van-col span="24">
                          <van-row>
                            <van-col class="user_pic_style" span="3">
                              <van-image
                                round
                                width="27"
                                height="27"
                                fit="cover"
                                position="center"
                                :src="item.user_pic"
                              />
                            </van-col>
                            <van-col span="21">
                              <van-row>
                                <van-col class="username_style" span="24">
                                  <span>{{ item.full_name }}</span>
                                </van-col>
                              </van-row>
                              <!-- 好评指数 -->
                              <van-row>
                                <van-col class="user_start_style" span="24">
                                  <startview
                                    :start="item.rating"
                                    :size="10"
                                    :gutter="5"
                                  ></startview>
                                </van-col>
                              </van-row>
                            </van-col>
                          </van-row>
                        </van-col>
                        <!-- 评论内容 -->
                        <van-col class="ellipsis_size" span="24">
                          <van-text-ellipsis
                            rows="2"
                            :content="
                              item.comment ? item.comment : '此用户没有发表任何评价'
                            "
                          />
                        </van-col>
                      </van-row>
                    </van-space>
                  </van-col>
                  <van-col v-else span="24">
                    <van-empty
                      image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
                      image-size="80"
                      description="暂无评价"
                    />
                  </van-col>
                </van-row>
              </van-cell-group>
            </van-col>
          </van-row>
        </van-space>
      </van-col>
    </van-row>
  </van-space>
  <!-- 权益弹窗 -->
  <van-action-sheet v-model:show="show" title="服务">
    <van-row>
      <van-col span="24">
        <van-cell-group>
          <van-cell title="七天无理由退货" label="享受此权益必须满足条件">
            <template #icon>
              <span class="sheet_icon_style van-cell-icon"
                ><van-icon name="passed"
              /></span>
            </template>
          </van-cell>
        </van-cell-group>
      </van-col>
      <van-col span="24">
        <van-cell-group>
          <van-cell title="24小时内发货" label="享受此权益必须满足条件">
            <template #icon>
              <span class="sheet_icon_style van-cell-icon"
                ><van-icon name="passed"
              /></span>
            </template>
          </van-cell>
        </van-cell-group>
      </van-col>
    </van-row>
  </van-action-sheet>

  <!-- 底部 -->
  <van-row>
    <van-col span="24">
      <van-action-bar>
        <van-action-bar-icon icon="wap-home-o" text="首页" to="/" color="#ee0a24" />
        <van-action-bar-icon icon="cart-o" text="购物车" to="/cart" :badge="isBadge()" />
        <van-action-bar-button type="warning" text="加入购物车" @click="showCart" />
        <van-action-bar-button type="danger" text="立即购买" @click="showMenu" />
      </van-action-bar>
    </van-col>
  </van-row>

  <!-- 加入购物车弹出层 -->
  <van-action-sheet v-model:show="showGoods">
    <!-- 头部关闭按钮 -->
    <van-row>
      <van-col span="20"></van-col>
      <van-col class="title" span="4" @click="showGoods = false">
        <van-icon name="cross" size="20" />
      </van-col>
    </van-row>

    <!-- 内容 -->
    <van-row class="content">
      <van-col span="24">
        <van-space direction="vertical" :size="20" fill>
          <van-row>
            <van-col span="24">
              <van-row>
                <van-col span="24">
                  <van-card
                    v-for="item in goods"
                    :key="item.category_id"
                    :price="item.price.toFixed(2)"
                    :num="item.stock === 0 ? '该商品已售空' : item.stock"
                    :thumb="item.product_pic"
                  >
                    <template #tags>
                      <van-tag round type="danger" size="large">{{
                        `预估到手${item.price.toFixed(2)}`
                      }}</van-tag>
                    </template>
                  </van-card>
                </van-col>
              </van-row>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="24">
              <stepperBox
                :cartNumber="cartNumber"
                :stock="goods[0].stock"
                @change-number="newNumber"
              ></stepperBox>
            </van-col>
          </van-row>
          <van-row>
            <van-col v-if="goods[0].stock > 0" span="24">
              <van-button
                round
                block
                color="linear-gradient(to right, #ff6034, #ee0a24)"
                @click="goodsRunWhere"
              >
                确定
              </van-button>
            </van-col>
            <van-col v-else span="24">
              <van-button
                disabled
                round
                block
                color="linear-gradient(to right, #ff6034, #ee0a24)"
              >
                该商品以售馨
              </van-button>
            </van-col>
          </van-row>
        </van-space>
      </van-col>
    </van-row>
  </van-action-sheet>
</template>
<style lang="less" scoped>
.van-nav-bar {
  /deep/.van-icon {
    color: #000;
  }
}
.header_title_fixed {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  .van-nav-bar {
    background-color: hsla(0, 0%, 0%, 0);
  }
}
.goods_style_padd {
  padding: 0 8px;
  .van-cell-group--inset {
    margin: 0;
  }
}
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}
.custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 2px 5px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.1);
}
.money_price,
.custom-title {
  color: red;
}
.money_price {
  font-size: 12px;
  line-height: 1;
  margin-bottom: -3px;
}
.custom-title {
  font-size: 20px;
  font-weight: 700;
  margin-right: 7px;
  vertical-align: middle;
}
.sink-title {
  font-weight: 700;
  margin-right: 3px;
}
.old_price {
  font-size: 12px;
  text-decoration: line-through;
  color: #959595;
  margin-right: 5px;
  margin-bottom: -2px;
}
.label_style {
  color: #000;
}
.oker_list {
  display: flex;
  justify-items: center;
  width: 300px;
  .oker_list_item {
    font-size: 12px;
    margin-right: 10px;
    .oker_list_icon {
      font-size: 13px;
      margin-right: 3px;
    }
  }
}
.van-cell-icon {
  color: #fa2209;
}
.sheet_icon_style {
  margin-right: 5px;
}
.username_style {
  font-size: 13px;
}
.user_pic_style {
  display: flex;
  align-items: center;
}
.user_start_style {
  display: flex;
  margin-top: 3px;
}
.ellipsis_size {
  font-size: 13px;
  margin-top: 10px;
  .van-text-ellipsis {
    line-height: 17px;
  }
}
.bottom_margin {
  margin-bottom: 60px;
}
.content {
  padding: 0 16px 30px 16px;
  .van-card {
    background-color: #fff;
  }
  .stepper_style {
    display: flex;
    justify-content: end;
  }
}

.title {
  display: flex;
  height: 45px;
  justify-content: center;
  align-content: center;
  .van-badge__wrapper {
    display: flex;
    align-items: center;
  }
}

.imgErr {
  width: 100%;
  height: 360px;
  background-color: #34754f;
}
.van-empty {
  :deep(.van-empty__description) {
    color: #fff;
  }
}
.detail_img {
  width: 100%;
  height: 100%;
}
</style>
