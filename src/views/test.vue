<template>
  <!-- 动态主题背景组件，根据currentThemeComponent的值切换不同背景 -->
  <component :is="currentThemeComponent" />

  <!-- 主仪表盘容器 -->
  <Dashboard>
    <!-- 左侧内容插槽 -->
    <template #left-content>
      <!-- HTML头部信息 -->
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Profile Page</title>
        <!-- 引入本地样式和Font Awesome图标库 -->
        <link rel="stylesheet" href="style.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css" />
      </head>

      <!-- 页面主体内容 -->
      <body>
      <!-- 顶部导航栏 -->
      <div class="navbar-top">
        <!-- 页面标题 -->
        <div class="title">
          <h1>Profile</h1>
        </div>

        <!-- 右侧功能图标列表 -->
        <ul>
          <!-- 消息图标 -->
          <li
              @mouseover="showForm('form1Vision')"  <!-- 鼠标悬停显示消息面板 -->
          @mouseleave="startHideTimer('form1Vision')"  <!-- 鼠标离开延迟隐藏 -->
          >
          <a href="#message">
            <i class="fa fa-envelope fa-2x"></i>  <!-- 信封图标 -->
          </a>
          <!-- 消息面板 -->
          <div class="form1Vision">
            <Official :isVisible="isForm1Visible"></Official>
          </div>
          </li>

          <!-- 通知图标 -->
          <li
              @mouseover="showForm('form2Vision')"
              @mouseleave="startHideTimer('form2Vision')"
          >
            <a href="#notification">
              <i class="fa fa-bell fa-2x"></i>  <!-- 铃铛图标 -->
            </a>
            <!-- 通知面板 -->
            <div class="form2Vision">
              <Activity :isVisible="isForm2Visible"></Activity>
            </div>
          </li>

          <!-- 编辑图标 -->
          <li
              @mouseover="showForm('form3Vision')"
              @mouseleave="startHideTimer('form3Vision')"
          >
            <a href="#edit">
              <i class="fa fa-pen fa-2x"></i>  <!-- 笔图标 -->
            </a>
            <!-- 编辑面板 -->
            <div class="form3Vision">
              <PersonContent
                  :isVisible="isForm3Visible"
                  @hide="hideForm"
                  @toggleForm="handleToggleForm"
                  @answer="handleAnswer"
                  @feedBack="handleFeedBack"
                  @pay="handlePay"
                  @delete="handleDelete"
                  @personalization="handlePersonalization"
              ></PersonContent>
            </div>
          </li>
        </ul>
      </div>

      <!-- 主内容区 -->
      <div class="main">
        <h2>IDENTITY</h2>  <!-- 身份信息标题 -->

        <!-- 个人信息卡片 -->
        <div class="card">
          <div class="card-body">
            <!-- 个人信息表格 -->
            <table>
              <tbody>
              <tr>
                <td>Name</td>
                <td>:</td>
                <td>ImDezCode</td>
              </tr>
              <!-- 其他个人信息行... -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </body>
    </template>
  </Dashboard>

  <!-- 各种对话框组件 -->
  <Edit :isVisible="isEditVisible" @update:isVisible="isEditVisible = $event" />
  <Answer :isVisible="isAnswerVisible" @update:isVisible="isAnswerVisible = $event" />
  <FeedBack :isVisible="isFeedBackVisible" @update:isVisible="isFeedBackVisible = $event" />
  <Pay :isVisible="isPayVisible" @update:isVisible="isPayVisible = $event" />
  <Personalization :isVisible="isPersonalizationVisible" @update:isVisible="isPersonalizationVisible = $event" />
  <Delete :isVisible="isDeleteVisible" @update:isVisible="isDeleteVisible = $event" />
</template>

<script setup>
// 导入Vue相关功能
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

// 导入工具函数和组件
import { getUsername } from "@/utils/Auth.js";
import PersonContent from "../components/PersonContent.vue";
// 导入其他组件...

// 初始化路由
const router = useRouter();

// 定义各种对话框的显示状态
const isForm1Visible = ref(false);  // 消息面板
const isForm2Visible = ref(false);  // 通知面板
const isForm3Visible = ref(false);  // 编辑面板
const isEditVisible = ref(false);   // 编辑对话框
const isAnswerVisible = ref(false); // 回答对话框
const isFeedBackVisible = ref(false); // 反馈对话框
const isPayVisible = ref(false);    // 支付对话框
const isDeleteVisible = ref(false); // 删除对话框
const isPersonalizationVisible = ref(false); // 个性化对话框

// 当前主题状态
const currentTheme = ref("Starfield");

// 计算当前主题对应的组件
const currentThemeComponent = computed(() => {
  switch (currentTheme.value) {
    case "Neural":
      return Neural;
    case "CrossStar":
      return CrossStar;
    default:
      return Starfield;
  }
});

// 用于存储隐藏定时器的对象
const hideTimers = ref({});

/**
 * 显示指定表单
 * @param {string} formName - 表单名称(form1Vision/form2Vision/form3Vision)
 */
const showForm = (formName) => {
  clearTimeout(hideTimers.value[formName]);  // 清除之前的隐藏定时器
  // 根据表单名称显示对应的面板
  if (formName === "form1Vision") {
    document.querySelector(".form1Vision").style.display = "block";
  } else if (formName === "form2Vision") {
    document.querySelector(".form2Vision").style.display = "block";
  } else if (formName === "form3Vision") {
    document.querySelector(".form3Vision").style.display = "block";
  }
};

/**
 * 隐藏指定表单
 * @param {string} formName - 表单名称
 */
const hideForm = (formName) => {
  hideTimers.value[formName] = setTimeout(() => {
    // 根据表单名称隐藏对应的面板
    if (formName === "form1Vision") {
      document.querySelector(".form1Vision").style.display = "none";
    } else if (formName === "form2Vision") {
      document.querySelector(".form2Vision").style.display = "none";
    }
    if (formName === "form3Vision") {
      document.querySelector(".form3Vision").style.display = "none";
    }
  }, 100);  // 100毫秒后隐藏
};

// 启动隐藏定时器(与hideForm类似)
const startHideTimer = (formName) => {
  hideTimers.value[formName] = setTimeout(() => {
    // 同上...
  }, 100);
};

// 处理支付按钮点击
const handlePay = () => {
  document.querySelector(".form3Vision").style.display = "none";
  isPayVisible.value = true;
};

// 处理编辑表单切换
const handleToggleForm = () => {
  document.querySelector(".form3Vision").style.display = "none";
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
/* 全局样式重置 */
* {
  margin: 0;
}

/* 页面基础样式 */
body {
  font-family: Arial;
  overflow: hidden;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏样式 */
.navbar-top {
  width: 100%;
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);  /* 半透明底部边框 */
  padding: 5px 20px;
  align-items: center;
  justify-content: space-between;  /* 左右分布 */
  box-sizing: border-box;
  height: 80px;
  display: flex;
}

/* 标题样式 */
.title {
  font-family: "Dancing Script", cursive;  /* 手写字体 */
  color: #fff;
  align-items: center;
}

/* 功能图标列表样式 */
ul {
  position: relative;
  align-items: center;
  display: flex;
  padding: 10px 0;
}

/* 图标悬停效果 */
ul li a i:hover {
  color: #3e3e5f;
}

/* 三个功能面板的公共样式 */
.form1Vision,
.form2Vision,
.form3Vision {
  border: 0.1px solid #ffffff58;  /* 半透明边框 */
  display: none;  /* 默认隐藏 */
  background-color: rgba(128, 128, 128, 0.05);  /* 半透明背景 */
  padding: 30px;
  border-radius: 18px;  /* 圆角 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);  /* 阴影效果 */
  position: absolute;
  z-index: 10;  /* 确保在最上层 */
}

/* 主内容区样式 */
.main {
  font-size: 28px;
  padding: 100px 10px;
  width: auto;
  height: 636px;
  align-items: center;
}

/* 卡片样式 */
.main .card {
  border-radius: 18px;
  box-shadow: 1px 1px 8px 0 grey;  /* 卡片阴影 */
  height: 85%;
  margin-bottom: 20px;
  padding: 20px 0 20px 50px;
  width: 60%;
  color: rgba(255, 255, 255, 0.8);  /* 半透明白色文字 */
}
</style>