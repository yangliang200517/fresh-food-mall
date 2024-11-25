<script setup>
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>
<template>
  <el-card class="box-card">
    <!-- 头部内容 -->
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
        <slot name="btnbox"></slot>
      </div>
    </template>
    <!-- 主题内容 -->
    <slot></slot>
  </el-card>
</template>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
.box-card {
  min-height: 100%;
  box-sizing: border-box;
}
</style>
