<template>
  <component :is="currentThemeComponent" />
  <Dashboard>
    <template #left-content>

      <div class="main">
        <h2 style="color: #353535;">About us</h2>

        <div class="card">
          <div class="card-body">
            <table>
              <tbody>
              <!-- 团队信息 -->
              <tr>
                <td>Team Name</td>
                <td>:</td>
                <td>Xiaohongshu Image-Text Group</td>
              </tr>
              <tr>
                <td>Team Members</td>
                <td>:</td>
                <td>Lyu Shanshan, Xiao Mengcen, Chen Guo, Wang Zhouying, Tan Li</td>
              </tr>
              <tr>
                <td>Technical Focus</td>
                <td>:</td>
                <td>Multimodal AI/Cross-modal Retrieval</td>
              </tr>
              <tr>
                <td>Contact</td>
                <td>:</td>
                <td>2661697757@qq.com</td>
              </tr>

              <!-- 项目信息 -->
              <tr>
                <td>Project Name</td>
                <td>:</td>
                <td>LoveIT Cross-modal Image-Text Retrieval System</td>
              </tr>
              <tr>
                <td>Project Type</td>
                <td>:</td>
                <td>Cross-modal Image-Text Retrieval</td>
              </tr>
              <tr>
                <td>Core Technology</td>
                <td>:</td>
                <td>CLIP Model/Transformer Architecture</td>
              </tr>
              <tr>
                <td>Project Features</td>
                <td>:</td>
                <td>Multilingual Support/High-precision Matching</td>
              </tr>
              <tr>
                <td>Application Fields</td>
                <td>:</td>
                <td>Self-media/E-commerce/Social Media</td>
              </tr>
              <!-- GitHub链接 -->
              <tr>
                <td>GitHub Project</td>
                <td>:</td>
                <td>
                  <a href="https://github.com/your-repository-link" target="_blank">
                    <i class="fab fa-github" style="margin-right: 8px;"></i>Find us in GitHub
                  </a>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </template>
  </Dashboard>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getUsername } from "@/utils/Auth.js";
import Edit from "../components/Edit.vue";
import Snowfall from "../components/Snowfall.vue";
import Dashboard from "../components/Dashboard.vue";

import { defineEmits } from "vue";


const router = useRouter();
const goHome = () => router.push("/home");


const currentTheme = ref("Snowfall");

const currentThemeComponent = computed(() => {
  return Snowfall;
});


onMounted(() => {
  const username = getUsername();

  if (!username) {
    router.push("/");
  } else {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      currentTheme.value = savedTheme;
    }
  }
});
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Dancing+Script);

* {
  margin: 0;
}

a {
  color: white;
  text-decoration: none;
}

/* 鼠标悬停时改变颜色 */
a:hover {
  color: #353535;
  /* 改为你想要的颜色，例如蓝色 */
}

body {
  /* 设置字体和布局 */
  overflow: hidden;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}


.main {
  font-size: 28px;
  padding: 60px 10px;
  /* 减少顶部内边距 */
  width: auto;
  height: auto;
  /* 改为自动高度 */
  align-items: center;
  margin-left: 28px;
  /* 添加左边距向右移动 */
  white-space: nowrap;
  /* 防止内容换行 */
}

.main h2 {
  color: rgba(255, 255, 255, 0.9);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 28px;
  /* 增大标题字号 */
  margin-bottom: 30px;
  width: 80%;
  font-weight: 600;
  letter-spacing: 1px;
  /* 添加字母间距 */
}

.main .card {
  border-radius: 18px;
  background-color: rgba(0, 0, 0, 0.2);
  /* 半透明背景 */
  backdrop-filter: blur(8px);
  /* 毛玻璃效果 */
  border: 1px solid rgba(255, 255, 255, 0.15);
  /* 半透明边框 */
  height: auto;
  margin-bottom: 20px;
  padding: 30px 40px;
  /* 调整内边距 */
  width: 60%;
  color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  /* 增强阴影效果 */
  transition: all 0.3s ease;
  /* 添加过渡效果 */
}

.main .card:hover {
  transform: translateY(-5px);
  /* 向下移动 */
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  /* 增强阴影效果 */
}


.main .card table {
  border: none;
  font-size: 16px;
  height: auto;
  width: 100%;
  /* 使用全宽 */
  border-collapse: separate;
  border-spacing: 0 12px;
  /* 行间距 */
}

.main .card td {
  padding: 8px 5px;
  vertical-align: middle;
}

.main .card td:first-child {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  width: 120px;
  /* 固定第一列宽度 */
}

.main .card td:nth-child(2) {
  padding: 0 10px;
  color: rgba(255, 255, 255, 0.7);
  width: 10px;
  /* 冒号列宽度 */
}

.main .card td:nth-child(3) {
  color: rgba(255, 255, 255, 0.85);
  padding-left: 15px;
  font-weight: 400;
}
</style>
