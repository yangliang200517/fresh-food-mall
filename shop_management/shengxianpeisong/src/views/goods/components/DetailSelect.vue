<script setup>
import { ref, onMounted, watch } from 'vue'
import { getGoods } from '@/api/goodsdetail'
const emit = defineEmits(['handleSelectChange'])
const selectedValue = ref()
const optionList = ref([])

// 获取商品数据
const getGoodsData = async () => {
  const res = await getGoods()
  optionList.value = res.data.data.map((item) => ({
    value: item.product_id,
    label: item.product_name
  }))
  selectedValue.value = optionList.value[0].value
}

// 监听选择值的变化，将选择的值传递给父组件
const handleSelectChange = () => {
  emit('handleSelectChange', selectedValue.value)
}

/**
 * 这里监听是因为在初始化时，由于父组件渲染时子组件尚未完全准备好，导致无法直接获取子组件的默认值
 * 因为 getGoodsData 是一个异步操作，需要一定时间才能完成。
 * 所以设置监听，当 selectedValue 有值时再发送事件
 */
watch(selectedValue, (value) => {
  if (value !== null) {
    emit('handleSelectChange', selectedValue.value)
  }
})

onMounted(() => {
  getGoodsData() // 获取选项数据
})
</script>
<template>
  <el-row>
    <el-col :span="24">
      <span>生鲜商品：</span>
      <el-select
        class="select_width"
        v-model="selectedValue"
        placeholder="请选择"
        @change="handleSelectChange"
      >
        <el-option
          v-for="item in optionList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-col>
  </el-row>
</template>
<style scoped>
.select_width {
  width: 160px;
}
</style>
