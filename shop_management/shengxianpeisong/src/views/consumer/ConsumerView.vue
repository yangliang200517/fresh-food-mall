<script setup>
import { onMounted, ref } from 'vue'
import { getConsumer } from '@/api/consumer'
import dayjs from 'dayjs'

const consumerList = ref([])

const getUsers = async () => {
  const res = await getConsumer()
  consumerList.value = res.data.data.map((element) => ({
    ...element,
    user_time: dayjs(element.user_time).format('YYYY-MM-DD')
  }))
}

onMounted(() => {
  getUsers()
})
</script>
<template>
  <public-view title="消费者管理">
    <el-row>
      <el-col :span="24">
        <el-table :data="consumerList" height="520" style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="80" />
          <el-table-column prop="name" label="消费者姓名" align="center" />
          <el-table-column prop="full_name" label="消费者昵称" align="center" />
          <el-table-column prop="sex" label="消费者性别" align="center" />
          <el-table-column prop="age" label="消费者年龄" align="center" />
          <el-table-column prop="phone" label="消费者电话" align="center" />
          <el-table-column prop="email" label="消费者邮箱" align="center" />
          <el-table-column prop="user_time" label="消费者创建日期" align="center" />
          <template #empty>
            <el-empty description="还没有消费者~" />
          </template>
        </el-table>
      </el-col>
    </el-row>
  </public-view>
</template>
