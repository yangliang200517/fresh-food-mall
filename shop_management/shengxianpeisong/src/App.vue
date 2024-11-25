<script setup>
import { RouterView } from 'vue-router'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <div>
      <RouterView />
    </div>
  </el-config-provider>
</template>

<style scoped></style>
