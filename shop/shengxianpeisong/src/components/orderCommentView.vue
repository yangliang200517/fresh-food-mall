<script setup>
import commStart from '@/components/startView.vue'
const props = defineProps({
  commItem: Object
})
</script>
<template>
  <van-row class="detail_data_style">
    <!-- 头像-用户名 -->
    <van-col span="24">
      <van-row>
        <van-col class="user_pic" span="3">
          <van-image
            round
            width="27"
            height="27"
            fit="cover"
            position="center"
            :src="props.commItem.user_pic"
          />
        </van-col>
        <van-col class="user_name" span="15">
          <span>{{ props.commItem.full_name }}</span>
        </van-col>
        <van-col class="user_date" span="6">
          <span>{{ props.commItem.review_date }}</span>
        </van-col>
      </van-row>
    </van-col>
    <!-- 评价等级 -->
    <van-col class="detail_oker" span="23" offset="1">
      <commStart :start="props.commItem.rating" :size="13"></commStart>
    </van-col>
    <!-- 评价内容 -->
    <van-col class="detail_msg" span="23" offset="1">
      <span>{{
        props.commItem.comment ? props.commItem.comment : '此用户未填写任何评价'
      }}</span>
    </van-col>
  </van-row>
</template>
<style lang="less" scoped>
.detail_data_style {
  padding: 20px 15px;
  margin-bottom: 12px;
  background-color: #fff;
  border-radius: 8px;
  &:first-child {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .user_pic,
  .user_name,
  .user_date {
    display: flex;
    align-items: center;
  }
  .user_name {
    font-size: 15px;
    font-weight: 700;
  }
  .user_date {
    font-size: 13px;
    justify-content: end;
    color: #999;
  }
  .detail_oker {
    margin-top: 10px;
  }
  .detail_msg {
    margin-top: 6px;
    font-size: 13px;
  }
}
</style>
