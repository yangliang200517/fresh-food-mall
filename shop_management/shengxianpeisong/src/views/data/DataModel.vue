<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import echarts from '@/utils/echartsImport'
import { getData, getReviews, getProductStock } from '@/api/data'

const chartBar = ref()
const chartPie = ref()
const chartLine = ref()

let myChart = null
let myChartPie = null
let myChartLine = null

const value = ref(1)
const ratingList = ref([
  {
    value: 1,
    label: '好评'
  },
  {
    value: 2,
    label: '中评'
  },
  {
    value: 3,
    label: '差评'
  }
])
let dataModle = ref({
  category_id: 1,
  rating: value.value
})

watch(ratingList, (newVal) => {
  value.value = newVal
})
watch(value, (newValue) => {
  dataModle.value.rating = newValue
})

const BarTitle = computed(() => {
  let selectedLabel = ''
  ratingList.value.forEach((item) => {
    if (value.value === item.value) {
      selectedLabel = item.label
    }
  })
  return selectedLabel
})

// 柱状图
const echartsBar = async () => {
  const dataList = ref([])
  const res = await getData(dataModle.value)

  dataList.value = res.data.data
  dataList.value = dataList.value.map((item) => ({
    name: item.product_name,
    value: item.total_reviews
  }))

  myChart = echarts.init(chartBar.value)
  myChart.setOption({
    title: {
      text: `分类下各生鲜的${BarTitle.value}数据展示`
    },
    dataset: {
      source: [...dataList.value]
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      minInterval: 1
    },
    grid: {
      left: 30,
      top: 60,
      right: 0,
      bottom: 20
    },
    series: [
      {
        type: 'bar',
        barWidth: '20%',
        barMaxWidth: 70,
        barCategoryGap: '0%', // 设置柱状图之间的间距
        label: {
          // 设置柱状图顶部显示数值
          show: true,
          position: 'top', // 设置数值显示在柱子的顶部
          color: 'black', // 设置数值颜色
          fontSize: 14, // 设置数值字体大小
          formatter: dataList.value.value
        }
      }
    ]
  })
}

// 饼图
const echartsPie = async () => {
  const pieList = ref([])
  const count = ref(0)
  const coryName = ref('')

  const res = await getReviews(dataModle.value.category_id)
  pieList.value = res.data.data[0].data
  count.value = res.data.data[0].count
  coryName.value = res.data.data[0].name

  myChartPie = echarts.init(chartPie.value)
  myChartPie.setOption({
    title: {
      text: '分类评价占比'
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        let htmlStr = `
          分类名称：${coryName.value} <br/>
          评价名称：${params.data.name} <br/>
          评价总数：${count.value}条 <br/>
          ${params.data.name}数量：${params.data.num}条 <br/>
          占该分类的：${params.data.value}%
        `
        return htmlStr
      }
    },
    legend: {
      orient: 'vertical',
      top: '10%',
      right: '20%',
      itemGap: 15, // 设置图例间距
      textStyle: {
        fontSize: 14 // 设置图例文字大小
      }
    },
    series: [
      {
        name: pieList.value,
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10
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
        data: pieList.value
      }
    ]
  })
}

// 折线图
const echartsLine = async () => {
  const stockList = ref([])
  const res = await getProductStock(dataModle.value.category_id)
  stockList.value = res.data.data

  myChartLine = echarts.init(chartLine.value)
  myChartLine.setOption({
    title: {
      text: '生鲜库存数量'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        console.log(params)
        let htmlStr = `
          库存数量：${params[0].data.value}
        `
        return htmlStr
      }
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      type: 'value'
    },
    dataset: {
      source: [...stockList.value]
    },
    grid: {
      left: 40,
      top: 60,
      bottom: 30,
      right: 10
    },
    series: [
      {
        type: 'line',
        smooth: true,
        lineStyle: {
          shadowColor: 'rgba(0, 0 , 0, 0.3)',
          shadowBlur: 10,
          shadowOffsetY: 8
        }
      }
    ]
  })
}

// 搜索
const onSearch = () => {
  echartsBar()
  echartsPie()
  echartsLine()
}

onMounted(() => {
  echartsBar()
  echartsPie()
  echartsLine()

  const resizeObserver = new ResizeObserver(() => {
    // 在尺寸变化时调用resize方法调整echarts大小
    myChart.resize()
    myChartPie.resize()
    myChartLine.resize()
  })
  resizeObserver.observe(chartBar.value)
  resizeObserver.observe(chartPie.value)
  resizeObserver.observe(chartLine.value)
})
</script>
<template>
  <public-view title="生鲜数据分析">
    <!-- 头部 -->
    <el-row>
      <el-col :span="24">
        <el-form inline>
          <el-form-item label="生鲜分类:">
            <select-view v-model="dataModle.category_id" width="200px"></select-view>
          </el-form-item>
          <el-form-item label="评价等级:">
            <el-select v-model="value" placeholder="请选择" style="width: 100px">
              <el-option
                v-for="item in ratingList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="onSearch">查找</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 数据展示区域 -->
    <el-row class="echarts_bar_box">
      <el-col :span="24">
        <div ref="chartBar" style="height: 400px; width: 100%"></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div ref="chartPie" style="height: 400px; width: 100%"></div>
      </el-col>
      <el-col :span="12">
        <div ref="chartLine" style="height: 400px; width: 100%"></div>
      </el-col>
    </el-row>
  </public-view>
</template>
<style lang="less" scoped>
.echarts_bar_box {
  margin-bottom: 30px;
}
</style>
