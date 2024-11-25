<script setup>
import { ref } from 'vue'
import { areaList } from '@vant/area-data'
import navBar from '@/components/navBar.vue'
import { useUserInfoStore } from '@/stores/userinfo'
import { useRoute, useRouter } from 'vue-router'
import { setAddress, delAddress, insNewAddress } from '@/api/address'
import { showConfirmDialog, showSuccessToast } from 'vant'

const route = useRoute()
const router = useRouter()
const userInfoStore = useUserInfoStore()

const userId = () => {
  return userInfoStore.users.user_id
}
const addressId = () => {
  return Number(route.query.addId)
}
const addType = () => {
  return Number(route.query.type)
}
const isDefault = () => {
  return route.query.isDefault === undefined ? false : JSON.parse(route.query.isDefault)
}

// 默认地址数据 此数据格式和vant官网上一致，是固定格式不可修改
const addressInfo = ref({
  addressId: addressId(),
  name: route.query.name,
  tel: route.query.tel,
  province: route.query.state,
  city: route.query.city,
  county: route.query.region,
  addressDetail: route.query.street_address,
  isDefault: isDefault()
})

// 保存按钮
const onSave = (info) => {
  if (addType() === 1) {
    console.log(info)
    // 新增地址
    showConfirmDialog({
      message: '您确定要新增地址吗？'
    })
      .then(async () => {
        await insNewAddress({
          userId: userId(),
          name: info.name,
          state: info.province,
          city: info.city,
          region: info.county,
          streetAddress: info.addressDetail,
          isDefault: info.isDefault
        })
        showSuccessToast('新增地址成功')
        setTimeout(() => {
          router.push('/address')
        }, 1500)
      })
      .catch(() => {})
  } else if (addType() === 0) {
    // 修改地址
    showConfirmDialog({
      message: '您确定要修改吗？'
    })
      .then(async () => {
        await setAddress({
          addressId: info.addressId,
          userId: userId(),
          name: info.name,
          phone: info.tel,
          state: info.province,
          city: info.city,
          region: info.county,
          streetAddress: info.addressDetail,
          isDefault: info.isDefault
        })
        showSuccessToast('修改成功')
        setTimeout(() => {
          history.back()
        }, 1500)
      })
      .catch(() => {})
  }
}

// 删除按钮
const onDelete = (info) => {
  showConfirmDialog({
    message: '您确定要删除吗？'
  })
    .then(async () => {
      await delAddress(Number(info.addressId), userId())
      showSuccessToast('删除成功')
      setTimeout(() => {
        router.push('/address')
      }, 1500)
    })
    .catch(() => {})
}

// 默认地址按钮
const onChangeDefault = (isDefault) => {
  console.log(isDefault)
}
</script>
<template>
  <!-- 标题 -->
  <navBar :isShow="true">
    <template #title>{{ addType() === 1 ? '新增地址' : '编辑地址' }}</template>
    <template #left>
      <van-icon name="arrow-left" size="18" />
    </template>
  </navBar>
  <!-- 编辑区域 -->
  <van-row>
    <van-col span="24">
      <van-address-edit
        :area-list="areaList"
        :show-delete="addType() === 0 ? true : false"
        :address-info="addressInfo"
        :show-set-default="true"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @delete="onDelete"
        @change-default="onChangeDefault"
      />
    </van-col>
  </van-row>
</template>
<style lang="less" scoped></style>
