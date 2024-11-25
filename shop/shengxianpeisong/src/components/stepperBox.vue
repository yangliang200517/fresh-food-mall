<script setup>
import { computed } from 'vue'

const props = defineProps({
  cartNumber: {
    type: Number,
    default: 1
  },
  stock: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['changeNumber'])

const propsShow = computed({
  get() {
    return props.cartNumber
  },
  set(value) {
    emit('changeNumber', value)
  }
})

const addNumber = () => {
  const newNumber = props.cartNumber + 1
  emit('changeNumber', newNumber)
}
const subNumber = () => {
  const newNumber = props.cartNumber - 1
  emit('changeNumber', newNumber)
}
</script>
<template>
  <van-stepper
    class="stepper_style"
    v-model="propsShow"
    theme="round"
    button-size="22"
    disable-input
    :max="props.stock"
    @plus="addNumber"
    @minus="subNumber"
  />
</template>
<style lang="less" scoped></style>
