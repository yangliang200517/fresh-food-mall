<script setup>
import { ref } from 'vue'
import { getArticle } from '@/api/article'

defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])

let optionList = ref([])
// 获取分类
const getArticles = async () => {
  const res = await getArticle()
  console.log(res)
  optionList.value = res.data.data
}

getArticles()
</script>
<template>
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    placeholder="请选择"
    :style="{ width }"
  >
    <el-option
      v-for="item in optionList"
      :key="item.value"
      :label="item.category_name"
      :value="item.category_id"
    ></el-option>
  </el-select>
</template>
