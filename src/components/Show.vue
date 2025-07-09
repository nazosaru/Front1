<template>
  <main>
    <!-- 背景图片层 -->
    <div class="background-image" style="background-image: url('../../public/fa.svg')"></div>

    <!-- 内容层 -->
    <div class="content-wrapper">
      <div class="content">
        <div class="title-box">
          <h2 class="title">Intelligent Retrieval System</h2>
          <p class="description">
            Our advanced platform leverages cutting-edge multimodal AI
            to deliver precise image-text matching. By combining deep
            learning architectures with semantic analysis, we enable
            highly accurate cross-modal search capabilities.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  // 不需要脚本逻辑
};
</script>

<style scoped>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 主体样式 */
body, html {
  height: 100%;
  width: 100%;
}

/* 主内容区 */
main {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 背景图片样式 */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.5; /* 只作用于背景图片 */
  z-index: 1;
}

/* 内容容器 */
.content-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 2; /* 确保在背景图片上方 */
}

/* 内容区域样式 */
.content {
  width: min(50vw, 600px);
  margin-left: 3rem;
  font: 400 0.85rem helvetica, sans-serif;
  color: white;
  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
  padding: 2rem;
  text-align: left;
  background-color: rgba(255, 255, 255, 0.1); /* 半透明背景 */
  backdrop-filter: blur(5px); /* 背景模糊效果 */
  border-radius: 15px; /* 圆角 */

  /* 3D立体效果 */
  transform-style: preserve-3d;
  transform: perspective(500px) translateZ(20px);
  box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.3),
      0 15px 20px rgba(0, 0, 0, 0.2),
      inset 0 0 15px rgba(255, 255, 255, 0.1);

  /* 平滑过渡效果 */
  transition: all 0.3s ease-out;

  /* 标题样式 */
  & .title {
    font-family: "arial-black";
    text-transform: uppercase;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    transform: translateZ(30px); /* 增强3D效果 */
  }

  /* 描述文本样式 */
  & .description {
    line-height: 1.7;
    font-size: 1.2rem;
    transform: translateZ(20px); /* 增强3D效果 */
  }

  /* 悬停效果 */
  &:hover {
    transform: perspective(500px) translateZ(30px) scale(1.015);
    box-shadow:
        0 15px 40px rgba(0, 0, 0, 0.4),
        0 20px 30px rgba(0, 0, 0, 0.3),
        inset 0 0 20px rgba(255, 255, 255, 0.15);
  }
}

/* 响应式设计 */
@media (width < 900px) {
  .content {
    width: 70%;
    margin-left: 2rem;

    & .title {
      font-size: 1.5rem;
    }
    & .description {
      font-size: 1rem;
    }
  }
}

@media (width < 650px) {
  .content {
    width: 80%;
    margin-left: 1rem;

    & .title {
      font-size: 1.3rem;
    }
    & .description {
      font-size: 0.9rem;
    }
  }
}
</style>
