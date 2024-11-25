<script setup>
import { onMounted, ref } from 'vue'
import { useUserInfoStore } from '@/stores/userinfo'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useSearchStore } from '@/stores/search'
import { useOrderStore } from '@/stores/order'
import { showImagePreview, showConfirmDialog, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
import img_pic11 from '@/assets/images/cat.jpeg'

const userInfoStore = useUserInfoStore()
const userStore = useUserStore()
const cartStore = useCartStore()
const SearchStore = useSearchStore()
const orderStore = useOrderStore()
const loading = ref(false)
const router = useRouter()

/*
 * 初次进入我的页面时会先请求，而请求会带token权限，所以会先获取权限，导致一进页面就会提示授权问题
 * 所以先判断有没有登录，登录了就直接获取用户信息，同时也会获取token权限，没有登录就不用获取，也就
 * 不会每次进页面提示token权限。
 */
if (userStore.token) {
  onMounted(() => {
    userInfoStore.getUserData()
    orderStore.getNotCommentorders()
  })
}

// 下拉刷新
const onRefresh = () => {
  setTimeout(() => {
    loading.value = false
    userInfoStore.getUserData()
  }, 1000)
}

// 点击头像显示图片
const showImage = (imgSrc) => {
  showImagePreview([imgSrc])
}
const isLogin = () => {
  return userStore.token
}

const showBadge = () => {
  if (!isLogin()) {
    return null
  } else {
    if (orderStore.orderLengths.length === 0) {
      return null
    } else {
      return orderStore.orderLengths.length
    }
  }
}

// 退出登录
const isBack = () => {
  showConfirmDialog({
    message: '确定要退出登录吗？'
  })
    .then(() => {
      // 删除 token 和 用户信息 还有 购物车数据还有搜索纪录
      userStore.removeToken()
      userStore.removeTokenOut()
      userInfoStore.removeUserData()
      cartStore.cartList = []
      cartStore.selCartList = []
      cartStore.cartListId = []
      orderStore.orderLengths = []
      SearchStore.clearSearchData()
      showSuccessToast('退出成功')
      router.push('/')
    })
    .catch(() => {
      console.log('no')
    })
}

const userIsLogin = (routerPath) => {
  if (!isLogin()) {
    showConfirmDialog({
      message: '您还没有登录！请登录'
    })
      .then(() => {
        router.push('/login')
      })
      .catch(() => {})
    return false
  } else {
    router.push(routerPath)
  }
}
</script>

<template>
  <van-pull-refresh class="pullHeight" v-model="loading" @refresh="onRefresh">
    <div class="user_view">
      <!-- 用户头部信息 -->
      <van-row class="user_info">
        <van-col class="user_info_msg" span="6">
          <van-image
            position="center"
            fit="cover"
            radius="5"
            width="55"
            height="55"
            :src="userInfoStore.users.user_pic || img_pic11"
            @click="showImage(userInfoStore.users.user_pic || img_pic11)"
          />
        </van-col>
        <van-col class="user_info_msg" span="18">
          <van-cell
            center
            :title="
              userStore.token
                ? userInfoStore.users.full_name || userInfoStore.users.name
                : '游客'
            "
            :label="`帐号：${userInfoStore.users.email}`"
          />
        </van-col>
      </van-row>
      <!-- 服务信息展示 -->
      <van-row class="user_msg_tok">
        <van-col span="24">
          <van-space :size="10" direction="vertical" fill>
            <!-- 活动信息 -->
            <van-row>
              <van-col span="24">
                <div class="user_msg_tok_div notice">
                  <van-notice-bar
                    left-icon="volume-o"
                    text="生鲜商城新品上线，满足你的生活所需，快去抢购吧！"
                  />
                </div>
              </van-col>
            </van-row>
            <!-- 订单状态 -->
            <van-row>
              <van-col span="24">
                <div class="user_msg_tok_div notice_marg">
                  <van-grid :border="false">
                    <van-grid-item icon="photo-o" text="我的订单" to="/order/type/0" />
                    <van-grid-item icon="photo-o" text="待发货/使用" to="/order/type/1" />
                    <van-grid-item
                      icon="photo-o"
                      :badge="showBadge()"
                      text="待评价"
                      to="/order/start"
                    />
                    <van-grid-item icon="photo-o" text="退换/售后" to="/order/sevice" />
                  </van-grid>
                </div>
              </van-col>
            </van-row>
            <!-- 用户个人信息列表 -->
            <van-row>
              <van-col span="24">
                <div class="user_msg_tok_div notice_marg">
                  <van-cell
                    title="编辑头像"
                    is-link
                    icon="enlarge"
                    @click="userIsLogin('/user/userimage')"
                  />
                  <van-cell
                    title="修改密码"
                    is-link
                    icon="eye-o"
                    @click="userIsLogin('/user/userpwd')"
                  />
                  <van-cell
                    title="个人信息"
                    is-link
                    icon="records"
                    @click="userIsLogin('/user/usermessage')"
                  />
                  <van-cell
                    title="地址管理"
                    is-link
                    icon="location"
                    @click="userIsLogin('/address')"
                  />
                </div>
              </van-col>
            </van-row>
          </van-space>
        </van-col>
      </van-row>
      <!-- 退出登录 -->
      <van-row justify="center" style="margin-top: 20px" v-if="userStore.token">
        <van-col span="23">
          <van-button round color="#FF5252" type="primary" block @click="isBack"
            >退出登录</van-button
          >
        </van-col>
      </van-row>
      <van-row justify="center" style="margin-top: 20px" v-else>
        <van-col span="23">
          <van-button round type="primary" block @click="router.push('/login')"
            >去登录</van-button
          >
        </van-col>
      </van-row>
    </div>
  </van-pull-refresh>
</template>

<style lang="less" scoped>
.pullHeight {
  height: 100%;
}
.user_view {
  overflow: hidden;
  .user_info {
    height: 130px;
    background-color: #fffbe8;
    overflow: hidden;

    .user_info_msg {
      display: flex;
      justify-content: center;
      align-items: center;
      .van-cell {
        padding-left: 0;
        background-color: transparent;
      }
      .van-image {
        border: 3px solid #f5deb3;
      }
    }
  }
  .user_msg_tok {
    position: relative;
    top: -10px;
    background-color: #eff2f5;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    .user_msg_tok_div {
      border-radius: 10px;
      background-color: #fff;
      overflow: hidden;
    }
    .notice {
      background-color: #fffbe8;
      padding: 5px 0;
    }
    .notice_marg {
      margin: 0 8px;
    }
  }
}
</style>
