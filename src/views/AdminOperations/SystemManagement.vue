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

          <!-- 饼图 -->
          <div class="card">
            <h3 class="chart-title">Pie Chart of Search Type</h3>
            <div ref="typePieRef" class="chart-container"></div>
          </div>

          <!-- 折线图 -->
          <div class="card">
            <h3 class="chart-title">Search Trend Over Time</h3>
            <div ref="trendRef" class="chart-container"></div>
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
import { API_ENDPOINTS } from '@/config/apiConfig';

const zhRef = ref(null)
const enRef = ref(null)
const typePieRef = ref(null);
const trendRef = ref(null)

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

const drawSearchTypePie = async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.search_type)
    const { code, data } = res.data
    if (code === 0 && data) {
      const chart = echarts.init(typePieRef.value);
      chart.setOption({
        color: [
          '#213448',
          '#547792',
          '#ECEFCA',
          '#adb8b1',
          '#7c97a2',
          '#E0E0E0'
        ],
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "vertical",
          left: "left",
          textStyle: {
            color: "#fff"
          }
        },
        series: [
          {
            name: "搜索类型",
            type: "pie",
            radius: "70%",
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            label: {
              color: "#fff"
            }
          }
        ]
      });
    } else {
      console.error("❌ 搜索类型分布后端错误：", res.data.message || "未知错误");
    }
  } catch (error) {
    console.error("❌ 加载搜索类型分布失败：", error);
  }
};

const drawSearchTrendLine = async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.search_trend)
    const { code, data } = res.data
    if (code === 0 && data) {
      const xData = data.map(item => item.time)
      const yData = data.map(item => item.count)

      const chart = echarts.getInstanceByDom(trendRef.value)
      if (chart) chart.dispose()

      const myChart = echarts.init(trendRef.value)
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: xData,
          axisLabel: { color: '#fff' },
          axisLine: { lineStyle: { color: '#999' } }
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#fff' },
          axisLine: { lineStyle: { color: '#999' } },
          splitLine: { lineStyle: { color: '#444' } }
        },
        series: [
          {
            name: 'Search Count',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              color: '#2f4f6b',
              width: 3
            },
            itemStyle: {
              color: '#547792',
              borderColor: '#fff',
              borderWidth: 1
            },
            areaStyle: {
              color: 'rgba(84, 119, 146, 0.25)' // 547792 的 rgba 版本
            },
            data: yData
          }
        ],
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: true
        }
      })
    } else {
      console.error("❌ 搜索趋势后端错误：", res.data.message || "未知错误")
    }
  } catch (error) {
    console.error("❌ 加载搜索趋势失败：", error)
  }
}


onMounted(async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.wordcloud)
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

      drawSearchTypePie(); // 绘制搜索类型分布饼图
      drawSearchTrendLine() // 绘制搜索趋势折线图

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

/* ✅ 饼图的容器往下挪一点 */
.card:nth-child(3) .chart-container {
  margin-top: 40px;
  /* 可调整为 30px、50px 等 */
}
</style>
