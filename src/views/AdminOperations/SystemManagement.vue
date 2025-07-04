<template>
  <Starfield />
  <Dashboard>
    <template #left-content>
      <div class="visualization-page">
        <h2 class="title">System Data Visualization</h2>

        <div class="grid-container">
          <!-- 词云图 -->
          <div class="card">
            <h3>Word Cloud</h3>
            <img src="@/assets/bg1.png" alt="Word Cloud" class="chart-img" />
          </div>

          <!-- 柱状图 -->
          <div class="card">
            <h3>Bar Chart</h3>
            <img src="@/assets/bg1.png" alt="Bar Chart" class="chart-img" />
          </div>

          <!-- 饼图 -->
          <div class="card full-width">
            <h3>Pie Chart</h3>
            <img src="@/assets/bg1.png" alt="Pie Chart" class="chart-img" />
          </div>
        </div>
      </div>
    </template>
  </Dashboard>
</template>

<script setup>
import Starfield from '@/components/Snowfall.vue';
import Dashboard from '@/components/DashboardAdmin.vue';
</script>

<style scoped>
.main-content h2 {
  color: #ffffff;       /* 设置为白色 */
  font-size: 26px;      /* 字体大小可根据需要调整 */
  font-weight: 600;     /* 加粗，可选 */
  margin-bottom: 20px;  /* 与下方表格保持距离 */
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
</style>
