<template>

  <body>
  <main>
    <nav class="main-menu">
      <div>
        <div class="user-info">
          <img src="../assets/avatar/admin.png" alt="user" />
          <p>{{ username }}</p>
        </div>
        <ul>
          <li class="nav-item" :class="{ active: isActive('/userManagement') }"
              @click="navigateTo('/userManagement')">
            <a href="#">
              <i class="fa fa-map nav-icon"></i>
              <span class="nav-text">Users</span>
            </a>
          </li>

          <li class="nav-item" :class="{ active: isActive('/systemManagement') }"
              @click="navigateTo('/systemManagement')">
            <a href="#">
              <i class="fa fa-arrow-trend-up nav-icon"></i>
              <span class="nav-text">Word Cloud</span>
            </a>
          </li>
        </ul>
      </div>

      <ul>
        <li class="nav-item logout-item" @click="GoToLogin">
          <a href="#">
            <i class="fa fa-right-from-bracket nav-icon"></i>
            <span class="nav-text">Logout</span>
          </a>
        </li>
      </ul>
    </nav>

    <section class="content">
      <div class="left-content">
        <slot name="left-content"></slot>
      </div>
    </section>
  </main>
  </body>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { getUsername } from "@/utils/Auth";
import { ref, onMounted } from "vue";

const router = useRouter();
const route = useRoute();
const username = ref("Admin");

// 页面加载时从本地存储获取用户名
onMounted(() => {
  const name = getUsername(); // 从本地存储获取用户名
  if (name) {
    username.value = name; // 赋值给响应式变量
  }
});

// 判断当前路由是否激活
const isActive = (path) => {
  return route.path === path;
};

// 处理登出操作
const GoToLogin = () => {
  router.push("/");
};

// 导航到指定路径
const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900;1000&family=Roboto:wght@300;400;500;700&display=swap");

/* 全局样式重置 */
*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

/* 导航样式 */
nav {
  user-select: none;
  /* 禁止选择文本 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
}

nav ul,
nav ul li {
  outline: 0;
  /* 去掉列表项的轮廓 */
}

nav ul li a {
  text-decoration: none;
  /* 去掉链接下划线 */
}

img {
  width: 100%;
  /* 图片宽度填满容器 */
}

h1 {
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  /* 动态字体大小 */
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  /* 页面最小高度 */
}

/* 主菜单样式 */
main {
  display: grid;
  grid-template-columns: 15% 85%;
  /* 主菜单和内容区宽度比例 */
  width: 100%;
  height: 100vh;
  /* 高度填满视口 */
  margin: 0px;
  background: transparent;
  backdrop-filter: blur(10px);
  /* 背景模糊效果 */
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  /* 边框颜色和透明度 */
  border-radius: 15px;
  /* 圆角边框 */
  box-shadow: 0 0.5px 0 1px rgba(255, 255, 255, 0.23) inset,
  0 1px 0 0 rgba(255, 255, 255, 0.6) inset, 0 4px 16px rgba(0, 0, 0, 0.12);
  /* 阴影效果 */
  z-index: 10;
}

.main-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 15px 0 0 15px;
  /* 圆角边框 */
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  /* 右侧边框 */
  padding: 12px 0 20px;
  overflow: hidden;
  font-family: inherit;
}

.user-info img {
  padding: 24px 44px 12px;
  border-radius: 50%; /* 圆形头像 */
}

.user-info p {
  color: #fff;
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  /* 动态字体大小 */
  font-weight: 500;
  text-align: center;
  line-height: 1;
  padding: 0 6px 32px;
}

.nav-item {
  display: block;
}

.nav-item a {
  display: flex;
  align-items: center;
  /* 垂直居中 */
  justify-content: flex-start;
  /* 左对齐 */
  color: #fff;
  font-size: 1rem;
  padding: 16px 20px;
  margin: 0 8px;
  border-radius: 5px;
  height: 56px;
  /* 加一个统一高度（可调整） */
}


.nav-item.active a {
  background: rgba(106, 109, 155, 0.5);
  /* 激活菜单项背景色 */
  text-decoration: none;
}

.nav-icon {
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 12px;
  vertical-align: middle;
}

/* 图标默认颜色 */
.nav-icon {
  color: #ffffffd0;
  /* 默认颜色（浅白） */
  transition: color 0.3s ease;
  /* 平滑过渡 */
}

/* 鼠标悬停菜单项时图标变色 */
.nav-item a:hover .nav-icon {
  color: #3e3e5f;
  /* 悬停时颜色 */
}

/* Logout 默认图标颜色 */
.logout-item .nav-icon {
  color: #3e3e5f;
}

/* Logout 悬停时图标颜色变亮 */
.logout-item a:hover .nav-icon {
  color: #ffffffd0;
}

.logout-item a {
  color: #3e3e5f;
  font-weight: 600;
}

.logout-item a:hover {
  color: #ffffffd0;
}

.nav-text {
  white-space: nowrap;  /* 禁止换行 */
  overflow: hidden;  /* 超出部分隐藏 */
  text-overflow: ellipsis;  /* 超出显示省略号（可选） */
  display: inline-block;  /* 保证在一行显示 */
  margin-left: 8px;  /* 可微调图标和文字间距 */
  font-weight: 550;
}

/* 内容区样式 */
.content {
  display: grid;
  grid-template-columns: 100% 100%;
  max-height: 100%;
  max-width: 100%;
  overflow-y: scroll;
  /* 纵向滚动 */
  overflow-x: hidden;
  /* 横向隐藏滚动条 */
}

/* 左侧内容样式 */
.left-content {
  padding: 10px 30px;
  color: #e5e5e5;
}

/* 媒体查询样式，适配不同屏幕宽度 */
@media (max-width: 1500px) {
  .content {
    grid-template-columns: 100%;
    grid-template-areas: "leftContent";
  }

  .left-content {
    grid-area: leftContent;
  }
}

@media (max-width: 1310px) {
  .content {
    grid-template-columns: 100%;
    grid-template-areas: "leftContent";
  }

  .left-content {
    grid-area: leftContent;
  }
}

@media (max-width: 1100px) {
  .content {
    grid-template-columns: 100%;
    grid-template-areas: "leftContent";
  }

  .left-content {
    grid-area: leftContent;
  }
}

@media (max-width: 910px) {
  .content {
    grid-template-columns: 100%;
    grid-template-areas: "leftContent";
  }

  .left-content {
    grid-area: leftContent;
  }
}

@media (max-width: 825px) {
  .content {
    grid-template-columns: 100%;
    grid-template-areas: "leftContent";
  }

  .left-content {
    grid-area: leftContent;
  }
}

@media (max-width: 700px) {
  .content {
    grid-template-columns: 100%;
    grid-template-areas: "leftContent";
  }

  .left-content {
    grid-area: leftContent;
  }
}

@media (max-width: 450px) {
  .content {
    grid-template-columns: 100%;
    grid-template-areas: "leftContent";
  }

  .left-content {
    grid-area: leftContent;
  }
}
</style>
