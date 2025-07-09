<template>
  <body>
    <main>
      <nav class="main-menu">
        <div>
          <div class="user-info">
            <img :src="avatarSrc" alt="user" />
            <div class="user-details">
              <p>{{ username }}</p>
              <i class="fa fa-pen-to-square nav-icon" @click="showEditForm"></i>  <!-- 编辑图标 -->
            </div>
          </div>



          <ul>
            <li
              class="nav-item"
              :class="{ active: isActive('/framework') }"
              @click="navigateTo('/framework')"
            >
              <a href="#">
                <i class="fa fa-house nav-icon"></i>
                <span class="nav-text">Home</span>
              </a>
            </li>

            <li
              class="nav-item"
              :class="{ active: isActive('/textSearch') }"
              @click="navigateTo('/textSearch')"
            >
              <a href="#">
                <i class="fa fa-image nav-icon"></i>
                <span class="nav-text">Image</span>
              </a>
            </li>

            <li
              class="nav-item"
              :class="{ active: isActive('/imageSearch') }"
              @click="navigateTo('/imageSearch')"
            >
              <a href="#">
                <i class="fa fa-file-lines nav-icon"></i>
                <span class="nav-text">Text</span>
              </a>
            </li>

            <li
              class="nav-item"
              :class="{ active: isActive('/history') }"
              @click="navigateTo('/history')"
            >
              <a href="#">
                <i class="fas fa-clock nav-icon"></i>
                <span class="nav-text">History</span>
              </a>
            </li>

          </ul>
        </div>

        <ul>
          <li
            class="nav-item1"
            :class="{ active: isActive('/contact') }"
            @click="navigateTo('/contact')"
          >
            <a href="#">
              <i class="fa fa-address-card nav-icon"></i>
              <span class="nav-text1">Contact</span>
            </a>
          </li>

          <li class="nav-item1" @click="GoToLogin">
            <a href="#">
              <i class="fa fa-right-from-bracket nav-icon"></i>
              <span class="nav-text1" >Logout</span>
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

  <!-- 各种对话框组件 -->
  <Edit :isVisible="isEditVisible" @update:isVisible="isEditVisible = $event" />

</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import {ref, computed, onMounted, defineEmits} from "vue";
import { getUsername, clearUsername } from "../utils/Auth";
import Edit from "../components/Edit.vue";
import edit from "@/components/Edit.vue";



const router = useRouter();
const route = useRoute();
const username = getUsername();
const avatarSrc = ref("public/user.svg"); // 默认头像

// 定义对话框的显示状态
const isEditVisible = ref(false);   // 编辑对话框



onMounted(() => {
  // 从 localStorage 或其他地方获取头像文件路径
  const storedAvatar = localStorage.getItem(`avatar_${username}`);
  if (storedAvatar) {
    avatarSrc.value = storedAvatar;
  }
});

// 定义一个函数，判断当前路由是否匹配
const isActive = (path) => {
  return route.path === path;
};

const GoToLogin = () => {
  router.push("/");
  clearUsername();
};

// 定义一个导航函数
const navigateTo = (path) => {
  router.push(path);
};


const showEditForm = () => {
  isEditVisible.value = true;
};

// 其他处理函数...

// 组件挂载时执行
onMounted(() => {
  const username = getUsername();  // 获取当前用户名

  if (!username) {
    router.push("/");  // 未登录则跳转到首页
  } else {
    // 从本地存储加载保存的主题
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      currentTheme.value = savedTheme;
    }
  }

});




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

/* 导航菜单样式 */
nav {
  user-select: none; /* 禁止选择文本 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
}

nav ul,
nav ul li {
  outline: 0; /* 去掉列表项的轮廓 */
}

nav ul li a {
  text-decoration: none; /* 去掉链接下划线 */
}

img {
  width: 100%; /* 图片宽度填满容器 */
}

h1 {
  font-size: clamp(1.2rem, 3vw, 1.5rem); /* 动态字体大小 */
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* 页面最小高度 */
}

/* 主菜单样式 */
main {
  display: grid;
  grid-template-columns: 15% 85%; /* 主菜单和内容区宽度比例 */
  width: 100%;
  height: 100vh; /* 高度填满视口 */
  margin: 0px;
  background: transparent;
  backdrop-filter: blur(10px); /* 背景模糊效果 */
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5); /* 边框颜色和透明度 */
  border-radius: 15px; /* 圆角边框 */
  box-shadow: 0 0.5px 0 1px rgba(255, 255, 255, 0.23) inset,
    0 1px 0 0 rgba(255, 255, 255, 0.6) inset, 0 4px 16px rgba(0, 0, 0, 0.12); /* 阴影效果 */
  z-index: 10;
}

.main-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 15px 0 0 15px; /* 圆角边框 */
  border-right: 1px solid rgba(255, 255, 255, 0.5); /* 右侧边框 */
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
  font-size: clamp(0.8rem, 5vw, 1.5rem); /* 动态字体大小 */
  font-weight: 500;
  text-align: center;
  line-height: 1;
  padding: 0 6px 32px;
}

.user-details {
  display: flex;          /* 使用 flex 布局 */
  align-items: center;    /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  gap: 10px;              /* 元素间距 */
  margin-top: 10px;
  width: 100%;            /* 确保容器宽度足够 */
}


.user-details ul li a {
  color: #ffffffd0;       /* 图标颜色 */
  font-size: 1.2rem; /* 图标大小 */
}

/* 使用相对定位微调 */
.fa-pen-to-square.nav-icon {
  position: relative;
  left: 5px;
  top: -13px;
  color: #3e3e5f;
}

/* 悬停状态 */
.fa-pen-to-square.nav-icon:hover {
  color: #ffffffd0;   /* 悬停时颜色 */
  transform: scale(1.1); /* 轻微放大（可选） */
}

.nav-item {
  display: block;
}

.nav-item a {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: flex-start; /* 左对齐 */
  color: #fff;
  font-size: 1rem;
  padding: 16px 20px; /* 增加左右内边距 */
  margin: 0 8px;
  border-radius: 5px;
  height: 56px; /* 统一高度 */
}

.nav-item a i {
  display: -ms-inline-flexbox;
  color: #ffffffd0; /* 图标颜色 */
}

.nav-item a i:hover {
  color: #3e3e5f; /* 图标悬停颜色 */
}

.nav-item.active a {
  background: rgba(106, 109, 155, 0.5); /* 活动菜单项背景色 */
  text-decoration: none;
}

.nav-item1 {
  display: block;
}

.nav-item1 a {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: flex-start; /* 左对齐 */
  color: #fff;
  font-size: 1rem;
  padding: 16px 20px; /* 增加左右内边距 */
  margin: 0 8px;
  border-radius: 5px;
  height: 56px; /* 统一高度 */
}

.nav-item1 a i {
  display: -ms-inline-flexbox;
  color: #3e3e5f; /* 图标颜色 */
}

.nav-item1 a i:hover {
  color: #ffffffd0; /* 图标悬停颜色 */
}

.nav-item1.active a {
  background: rgba(106, 109, 155, 0.5); /* 活动菜单项背景色 */
  text-decoration: none;
}


.nav-icon {
  font-size: 1.2rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px; /* 固定宽度 */
  height: 24px; /* 固定高度 */
  margin-right: 12px; /* 图标与文字间距 */
}

.nav-text {
  display: block;
  width: 70px;
  height: 20px;
  letter-spacing: 0;
}

.nav-text1 {
  white-space: nowrap; /* 禁止换行 */
  text-overflow: ellipsis; /* 超出显示省略号 */
  display: inline-block; /* 保证在一行显示 */
  line-height: 1.2;
  color: #191919;
}


/* 内容区样式 */
.content {
  display: grid;
  grid-template-columns: 100% 100%;
  max-height: 100%;
  max-width: 100%;
  overflow-y: scroll; /* 纵向滚动 */
  overflow-x: hidden; /* 横向隐藏滚动条 */
}

/* 左侧内容样式 */
.left-content {
  padding: 10px 30px;
  color: #e5e5e5;
}




.formVision {
  border: 0.1px solid #ffffff58;  /* 半透明边框 */
  display: none;  /* 默认隐藏 */
  background-color: #658694;  /* 背景 */
  padding: 30px;
  border-radius: 18px;  /* 圆角 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);  /* 阴影效果 */
  position: absolute;
  z-index: 10;  /* 确保在最上层 */
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
