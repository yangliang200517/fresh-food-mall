<script setup>
import { onMounted, ref } from 'vue'
import navBar from '@/components/navBar.vue'
import { useUserInfoStore } from '@/stores/userinfo'
import { getAddress, getAddressUser } from '@/api/address'
import { useRouter } from 'vue-router'

const userInfoStore = useUserInfoStore()
const router = useRouter()

const userId = () => {
  return userInfoStore.users.user_id
}

// 获取用户地址
const address = ref([])
const getUserAddress = async () => {
  const res = await getAddress(userId())

  // 处理后台返回的数据
  const modifiedList = res.data.addresList.map((item) => {
    item.id = item.address_id
    item.tel = item.phone
    item.address = item.state + item.city + item.region + item.street_address
    item.isDefault = item.is_default === 1 ? true : false
    return item
  })

  address.value = modifiedList
}

// 新增地址按钮
const onAdd = async () => {
  const res = await getAddressUser(userId())
  router.push({
    path: '/update/address',
    query: {
      type: 1,
      name: res.data.addresList[0].name,
      tel: res.data.addresList[0].phone
    }
  })
}
// 修改地址按钮
const onEdit = (item) => {
  router.push({
    path: '/update/address',
    query: {
      type: 0,
      addId: item.address_id,
      name: item.name,
      tel: item.tel,
      state: item.state,
      city: item.city,
      region: item.region,
      street_address: item.street_address,
      isDefault: item.isDefault
    }
  })
}

onMounted(() => {
  getUserAddress()
})
</script>
<template>
  <!-- 标题 -->
  <navBar :isShow="true">
    <template #title>地址管理</template>
    <template #left>
      <van-icon name="arrow-left" size="18" />
    </template>
  </navBar>
  <!-- 地址展示 -->
  <van-row>
    <van-col span="24">
      <van-address-list
        :list="address"
        :switchable="false"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
      />
    </van-col>
  </van-row>
</template>
<style lang="less" scoped></style>
