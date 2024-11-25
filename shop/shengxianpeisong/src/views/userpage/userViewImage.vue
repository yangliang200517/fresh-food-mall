<script setup>
import { ref } from 'vue'
import navBar from '@/components/navBar.vue'
import { userAvater } from '@/api/user'
import { useUserInfoStore } from '@/stores/userinfo'
import { showSuccessToast } from 'vant'

const userInfoStore = useUserInfoStore()
const show = ref(false)
const userPic = ref('')
const avater = ref('')

// 图片上传
const afterRead = (file) => {
  console.log(file.file)
  if (file) {
    show.value = true
    userPic.value = file.objectUrl
    avater.value = file.file
  }
}
// 头像处理
const convertToImg = async (avater) => {
  const formDatas = new FormData()
  formDatas.append('user_pic', avater)

  const res = await userAvater(formDatas)
  await userInfoStore.getUserData()

  showSuccessToast(res.data.message)
  show.value = false
}
</script>
<template>
  <!-- 标题 -->
  <navBar :isShow="true">
    <template #title> 编辑头像 </template>
    <template #left>
      <van-icon name="arrow-left" size="18" />
    </template>
  </navBar>

  <!-- 头像展示 -->
  <van-row>
    <van-col span="24">
      <van-image
        class="pic"
        fit="cover"
        position="center"
        radius="3"
        :src="userInfoStore.users.user_pic"
      />
    </van-col>
  </van-row>

  <!-- 选择上传图片 -->
  <van-row class="uploader">
    <van-col span="24" class="uploader_item">
      <van-uploader :after-read="afterRead"> 从相册选一张 </van-uploader></van-col
    >
    <van-col span="24" class="uploader_item">
      <van-uploader :after-read="afterRead"> 从系统选一张 </van-uploader></van-col
    >
    <van-col span="24" class="uploader_item">
      <van-uploader :after-read="afterRead"> 设置头像 </van-uploader></van-col
    >
  </van-row>
  <!-- 遮罩层 -->
  <van-overlay :show="show" z-index="100">
    <div class="wrapper">
      <van-row justify="space-between" class="wrapper_btn_box">
        <van-col class="wrapper_btn_box_item" span="6" @click="show = false"
          >取消</van-col
        >
        <van-col class="wrapper_btn_box_item" span="6" @click="convertToImg(avater)"
          >使用</van-col
        >
      </van-row>
      <div class="wrapper_pic_box">
        <div class="wrapper_pic_box_img">
          <van-image position="center" fit="cover" :src="userPic" />
        </div>
      </div>
    </div>
  </van-overlay>
</template>
<style lang="less" scoped>
.pic {
  width: 100%;
  height: 100%;
}
.uploader {
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: #fff;
  .uploader_item {
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
    &:last-child {
      border-bottom: 0;
    }
    .van-uploader {
      position: relative; /* 添加相对定位 */
      display: block;
      /deep/.van-uploader__wrapper {
        .van-uploader__input-wrapper {
          width: 100%;
          height: 100%;
          cursor: pointer;
          padding: 15px 0;
        }
      }
    }
  }
}
.wrapper {
  height: 100%;
  .wrapper_btn_box {
    background-color: #fff;
    text-align: center;
    .wrapper_btn_box_item {
      padding: 12px 0;
      font-size: 17px;
    }
  }
  .wrapper_pic_box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #000;
    .wrapper_pic_box_img {
      width: 100%;
      height: 360px;
      background-color: #fff;
      .van-image {
        display: flex;
        justify-content: center;
        vertical-align: middle;
      }
    }
  }
}
</style>
