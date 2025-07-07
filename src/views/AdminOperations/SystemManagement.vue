<template>
  <Snowfall />
  <Dashboard>
    <template #left-content>
      <div class="visualization-page">
        <h2 class="title">System Data Visualization</h2>

        <div class="grid-container">
          <!-- 中文词云 -->
          <div class="card">
            <h3 class="chart-title">Chinese Word Cloud</h3>
            <div ref="zhRef" class="chart-container"></div>
          </div>

          <!-- 英文词云 -->
          <div class="card">
            <h3 class="chart-title">English Word Cloud</h3>
            <div ref="enRef" class="chart-container"></div>
          </div>

          <!-- 柱状图 -->
          <div class="card">
            <h3 class="chart-title">Bar Chart</h3>
            <img src="@/assets/bg1.png" alt="Bar Chart" class="chart-img" />
          </div>

          <!-- 饼图 -->
          <div class="card full-width">
            <h3 class="chart-title">Pie Chart</h3>
            <img src="@/assets/bg1.png" alt="Pie Chart" class="chart-img" />
          </div>
        </div>
      </div>
    </template>
  </Dashboard>
</template>


<script setup>
import Snowfall from '@/components/Snowfall.vue';
import Dashboard from '@/components/DashboardAdmin.vue';
import { ref, onMounted } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts'
import 'echarts-wordcloud'

const zhRef = ref(null)
const enRef = ref(null)

const renderWordCloud = (el, data) => {
  const chart = echarts.getInstanceByDom(el)
  if (chart) {
    chart.dispose()  // 避免重复挂载
  }

  const myChart = echarts.init(el)
  const option = {
    tooltip: { show: true },
    series: [{
      type: 'wordCloud',
      gridSize: 6,
      sizeRange: [14, 50],  // 适当扩大词汇大小
      rotationRange: [-30, 30],  // 避免文字太倾斜
      shape: 'star',  // 词云形状（可选：'circle', 'diamond', 'triangle-forward', 'star', 'pentagon'）
      textStyle: {
        fontFamily: 'Microsoft YaHei, sans-serif',  // 中文友好字体
        fontWeight: 'bold',
        color: () => {
          // 颜色从柔和色系中挑选
          // const colors = [
          //   '#ff7675', '#74b9ff', '#ffeaa7', '#55efc4',
          //   '#a29bfe', '#fd79a8', '#fab1a0', '#81ecec'
          // ];
          const colors = [
            '#213448',
            '#547792',
            // '#94B4C1',
            '#ECEFCA',
            '#adb8b1',
            '#7c97a2',
            // '#CCCCCC',
            '#E0E0E0',
            // '#FFFFFF'
          ];
          return colors[Math.floor(Math.random() * colors.length)];
        }
      },
      data
    }]
  };

  myChart.setOption(option)
}

onMounted(async () => {
  try {
    const res = await axios.get('api/wordcloud')  // 👈 与 Flask 保持一致
    const { code, data } = res.data
    if (code === 0 && data) {
      const { chinese, english } = res.data.data

      if (chinese && chinese.length > 0) {
        renderWordCloud(zhRef.value, chinese)
      } else {
        console.warn("⚠️ 中文词云为空，跳过渲染")
      }

      if (english && english.length > 0) {
        renderWordCloud(enRef.value, english)
      } else {
        console.warn("⚠️ 英文词云为空，跳过渲染")
      }

    } else {
      console.error("❌ 后端返回错误：", res.data.message || "未知错误")
    }

  } catch (error) {
    console.error("❌ 词云图加载失败：", error)
  }
})
</script>


<style scoped>
.main-content h2 {
  color: #ffffff;
  /* 设置为白色 */
  font-size: 26px;
  /* 字体大小可根据需要调整 */
  font-weight: 600;
  /* 加粗，可选 */
  margin-bottom: 20px;
  /* 与下方表格保持距离 */
}

.visualization-page {
  padding: 20px 30px;
  color: #e5e5e5;
}

.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.6rem;
  color: #fff;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.card {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.chart-img {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  margin-top: 10px;
  border-radius: 8px;
}

.full-width {
  grid-column: span 2;
}

.chart-title {
  text-align: center;
  color: #fff;
  margin-bottom: 10px;
}

.chart-container {
  width: 100%;
  height: 400px;
  margin-top: 10px;
  border-radius: 8px;
}
</style>
