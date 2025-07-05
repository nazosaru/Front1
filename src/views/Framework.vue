<template>
  <!-- 动态渲染当前主题组件 -->
  <component :is="currentThemeComponent" />
  <!-- 使用 Dashboard 组件，并通过插槽传递左侧内容 -->
  <dashboard>
    <template #left-content>
      <show />
    </template>
  </dashboard>
</template>

<script setup>
import { onMounted, ref, computed } from "vue"; // 导入 Vue 的响应式 API 和生命周期钩子
import { useRouter } from "vue-router"; // 导入 Vue Router 的 useRouter 函数，用于路由跳转
import Snowfall from "@/components/Snowfall.vue"; // 导入 Snowfall 组件
import Show from "@/components/Show.vue"; // 导入 Show 组件
import { getUsername } from "@/utils/Auth"; // 导入 getUsername 函数，用于获取用户名
import Dashboard from "@/components/Dashboard.vue"; // 导入 Dashboard 组件
import { useThemeStore } from "../stores/themeStore"; // 导入主题状态管理 store

const router = useRouter(); // 创建路由器实例

// 定义路由处理函数
const handleTextSearch = () => router.push("/textSearch"); // 导航到文本搜索页面
const handleImageSearch = () => router.push("/imageSearch"); // 导航到图像搜索页面
const recommendation = () => router.push("/recommendation"); // 导航到推荐页面
const logout = () => router.push("/"); // 导航到登录页面
const userCenter = () => router.push("/userCenter"); // 导航到用户中心页面
const goHome = () => router.push("/framework"); // 导航到主页

const handlePersonal = () => router.push("/recommendation"); // 导航到个人推荐页面
const handleOther = () => router.push("/other"); // 导航到其他页面

const currentTheme = ref("Snowfall"); // 定义当前主题，默认为 "Snowfall"

// 根据当前主题计算要显示的组件
const currentThemeComponent = computed(() => {
      return Snowfall; // 其他情况下显示 Snowfall 组件
});

// 页面加载时检查用户名
onMounted(() => {
  const username = getUsername(); // 获取用户名

  if (!username) {
    router.push("/"); // 如果用户名不存在，导航到登录页面
  } else {
    const savedTheme = localStorage.getItem("theme"); // 从 localStorage 获取保存的主题

    if (savedTheme) {
      currentTheme.value = savedTheme; // 如果存在保存的主题，则更新 currentTheme
    }
  }
});
</script>

<style scoped>
/* 设置全局样式 */
body {
  margin: 0; /* 去除默认的外边距 */
  font-family: "Montserrat", sans-serif; /* 设置字体为 Montserrat */
  color: #d3d3d3; /* 设置文本颜色 */
  display: flex; /* 设置为弹性布局 */
  flex-direction: column; /* 设置主轴方向为垂直 */
}

/* 设置管理面板的样式 */
.admin-panel {
  display: flex; /* 设置为弹性布局 */
  height: calc(100vh - 10px); /* 设置高度为视口高度减去 10px */
  margin: 5px; /* 设置外边距 */
  border-radius: 5px; /* 设置圆角 */
  overflow: hidden; /* 隐藏溢出内容 */
  box-sizing: border-box; /* 设置盒模型为 border-box */
  flex-direction: column; /* 设置主轴方向为垂直 */
}

/* 设置非头部区域的样式 */
.non-header {
  display: flex; /* 设置为弹性布局 */
  height: calc(100% - 60px); /* 设置高度为父容器高度减去 60px */
  flex-direction: row; /* 设置主轴方向为水平 */
}

/* 设置主要内容区域的样式 */
.main-content {
  display: flex; /* 设置为弹性布局 */
  flex: 1; /* 占据剩余空间 */
  flex-direction: column; /* 设置主轴方向为垂直 */
  padding: 10px; /* 设置内边距 */
  align-items: center; /* 设置子元素在主轴上的对齐方式为居中 */
  overflow-y: auto; /* 设置垂直方向可滚动 */
  justify-content: space-between; /* 设置子元素在交叉轴上的分布为两端对齐 */
  box-sizing: border-box; /* 设置盒模型为 border-box */
  height: calc(100%); /* 设置高度为父容器高度的 100% */
}
</style>
