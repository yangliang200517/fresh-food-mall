<script setup>
import { onMounted, ref, watch } from 'vue'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import echarts from '@/utils/echartsImport.js'
import { getProductRviews } from '@/api/goods'

defineProps({
  productData: Object
})

const centerDialogVisible = ref(false)
const productRowVal = ref({})
const picCart = ref()
const productDatas = ref([])
let myChart = null

const changeProduct = (data) => {
  centerDialogVisible.value = true
  console.log(data)
  productRowVal.value = data
  getProductCommit()
}

const getProductCommit = async () => {
  const res = await getProductRviews(productRowVal.value.product_id)
  console.log(res)
  productDatas.value = res.data.data
}

// 在 productDatas 变化时更新图表数据
watch(productDatas, (newVal) => {
  if (myChart) {
    myChart.setOption({
      series: [
        {
          data: newVal
        }
      ]
    })
  }
})
const option = ref({
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      const count = params.data.count + '条'
      const seriesName = params.name
      const percentage = params.percent + '%'
      const percentValue = params.value + '条'
      // 自定义提示框显示内容
      return `
        总条数：${count}<br>
        ${seriesName}条数：${percentValue}<br>
        占比：${percentage}
      `
    }
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: productDatas.value
    }
  ]
})

// 这里因为在父组件点击编辑按钮时对话框显示后图表数据还没初始化，所以这里监听一下，获取图标容器dom元素更新
watch(picCart, (newVal) => {
  if (newVal) {
    myChart = echarts.init(picCart.value)
    // 在这里设置图表的数据和配置
    myChart.setOption(option.value)
  }
})

defineExpose({
  changeProduct
})

onMounted(() => {
  window.addEventListener('resize', () => {
    myChart.resize()
  })
  if (picCart.value) {
    myChart = echarts.init(picCart.value)
    // 在这里设置图表的数据和配置
    myChart.setOption(option.value)
  } else {
    console.log('aaaa')
  }
})
</script>
<template>
  <el-dialog
    v-model="centerDialogVisible"
    width="1000"
    :show-close="false"
    align-center
    v-if="centerDialogVisible"
  >
    <!-- 自定义头部 -->
    <template #header="{ titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">
          {{ productRowVal.product_name }}的数据看板
        </h4>
        <el-button type="danger" @click="centerDialogVisible = false">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          关闭
        </el-button>
      </div>
    </template>
    <!-- 内容部分 -->
    <el-row>
      <el-col :span="12">
        <el-card style="max-width: 380px">
          <template #header>
            <el-space :size="20">
              <el-tag type="primary" size="large"
                >生鲜名称：{{ productRowVal.product_name }}</el-tag
              >
              <el-tag type="primary" size="large"
                >生鲜分类：{{ productRowVal.category_name }}</el-tag
              >
            </el-space>
          </template>
          <img :src="productRowVal.product_pic" style="width: 100%" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <div ref="picCart" style="width: 100%; height: 100%"></div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<style scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>
