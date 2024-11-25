<script setup>
import { ref } from 'vue'
import navBar from '@/components/navBar.vue'
import startView from '@/components/startView.vue'
import { useRoute } from 'vue-router'
import { setOrderComm, setComms } from '@/api/orders'
import { showToast, showSuccessToast } from 'vant'

const route = useRoute()

// 从 commentOrder.vue 中获取的路由数据
const userId = () => {
  return route.query.userId
}
const productId = () => {
  return route.query.productId
}
const orderId = () => {
  return route.query.orderId
}
const orderTitleAndText = () => {
  return route.query.productName + ' ' + route.query.productText
}
const text = ref(orderTitleAndText())

const orderisComment = () => {
  return route.query.isComment === '1' ? '已评价' : null
}

// 子传父的方法，把点击的评价数量传递过来
const startNum = ref(0)
const userMessage = ref('')
const userMessages = ref('')
const commCount = (val) => {
  startNum.value = val
}
// 提交
const commStart = async () => {
  if (route.params.type === '0') {
    if (startNum.value === 0) {
      showToast('请选择评价')
      return
    }

    await setOrderComm(
      orderId(),
      userId(),
      productId(),
      startNum.value,
      userMessage.value
    )

    showSuccessToast('评价成功')
    history.back()
  } else if (route.params.type === '1') {
    if (userMessages.value === '') {
      showToast('请填写评价')
      return
    } else {
      await setComms(orderId(), userId(), productId(), startNum.value, userMessages.value)
      showSuccessToast('追平成功')
      history.back()
    }
  }
}
</script>
<template>
  <!-- 标题 -->
  <navBar :isShow="true">
    <template #title> {{ route.params.type === '0' ? '评价' : '追加评价' }} </template>
    <template #left>
      <van-icon name="arrow-left" size="18" />
    </template>
  </navBar>
  <!-- 评价展示 -->
  <van-row class="row_sty" v-if="route.params.type === '0'">
    <van-col span="24">
      <van-row>
        <van-col span="24">
          <van-cell title="商品服务评价" value="满意请给5星哦~" />
        </van-col>
      </van-row>
      <van-row class="comm_start">
        <van-col span="9" class="comm_text">商品综合评价</van-col>
        <van-col span="15"
          ><startView :size="20" :readonly="false" @is-start="commCount"></startView
        ></van-col>
      </van-row>
      <van-row>
        <van-col span="24">
          <van-cell-group inset>
            <van-field
              v-model="userMessage"
              rows="2"
              autosize
              label="留言"
              type="textarea"
              maxlength="50"
              placeholder="请输入留言"
              show-word-limit
            />
          </van-cell-group>
        </van-col>
      </van-row>
    </van-col>
  </van-row>

  <van-row class="row_sty" v-if="route.params.type === '1'">
    <van-col span="24">
      <van-space direction="vertical" fill :size="15">
        <!-- 追评商品 -->
        <van-row class="order_body">
          <van-col class="order_posi order_pic" span="6">
            <van-image
              width="50"
              height="50"
              fit="cover"
              position="center"
              :radius="5"
              :src="route.query.productPic"
            />
          </van-col>
          <van-col class="order_posi order_item" span="18">
            <van-row>
              <van-col span="24" class="order_text"
                ><van-text-ellipsis :content="text"
              /></van-col>
              <van-col span="24" class="order_type">{{ orderisComment() }}</van-col>
            </van-row>
          </van-col>
        </van-row>
        <!-- 追加信息 -->
        <van-row>
          <van-col span="24"><van-cell title="追加一下你的使用体验吧~" /></van-col>
          <van-col span="24">
            <van-row class="comm_start">
              <van-col span="9" class="comm_text">追加评价</van-col>
              <van-col span="15"
                ><startView :size="20" :readonly="false" @is-start="commCount"></startView
              ></van-col>
            </van-row>
          </van-col>
          <van-col span="24"
            ><van-cell-group inset>
              <van-field
                v-model="userMessages"
                rows="2"
                autosize
                label="留言"
                type="textarea"
                maxlength="50"
                placeholder="请输入留言"
                show-word-limit
              /> </van-cell-group
          ></van-col>
        </van-row>
      </van-space>
    </van-col>
  </van-row>

  <van-row class="comm_btn">
    <van-col span="24">
      <van-button type="primary" round block @click="commStart">提交</van-button>
    </van-col>
  </van-row>
</template>
<style lang="less" scoped>
.row_sty {
  .van-row {
    background-color: #fff;
  }
  .order_body {
    padding: 15px 20px 15px 0;
    border-radius: 10px;
    .order_posi {
      display: flex;
      align-items: center;
      .van-row {
        width: 100%;
        .order_text {
          font-size: 15px;
        }
        .order_type {
          font-size: 14px;
          color: brown;
        }
      }
    }
    .order_pic {
      justify-content: center;
    }
  }
}
.comm_start {
  padding: 20px 15px;
  font-size: 14px;
  .comm_text {
    display: flex;
    align-items: center;
  }
}
.comm_btn {
  margin-top: 20px;
  padding: 0 20px;
}
</style>
