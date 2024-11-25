<script setup>
import { ref } from 'vue'

const props = defineProps({
  start: {
    type: Number,
    default: 0
  },
  size: {
    type: Number,
    default: 14
  },
  readonly: {
    type: Boolean,
    default: true
  },
  gutter: {
    type: Number,
    default: 4
  }
})

const emit = defineEmits(['isStart'])

const onChange = (value) => {
  emit('isStart', value)
}
const value = ref(props.start)
</script>
<template>
  <van-rate
    v-model="value"
    :size="props.size"
    :readonly="props.readonly"
    :gutter="props.gutter"
    @change="onChange"
  />
</template>
<style lang="less" scoped></style>
