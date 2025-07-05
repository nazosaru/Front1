<template>
  <main>
    <!-- 背景图片层 -->
    <div class="background-image" style="background-image: url('../../public/fa.svg')"></div>

    <!-- 内容层 -->
    <div class="content-wrapper">
      <div class="content">
        <h2 class="title">Intelligent Retrieval System</h2>
        <p class="description">
          Our advanced platform leverages cutting-edge multimodal AI
          to deliver precise image-text matching. By combining deep
          learning architectures with semantic analysis, we enable
          highly accurate cross-modal search capabilities.
        </p>
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
  padding: 1rem;
  text-align: left;

  /* 标题样式 */
  & .title {
    font-family: "arial-black";
    text-transform: uppercase;
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  /* 描述文本样式 */
  & .description {
    line-height: 1.7;
    font-size: 1.2rem;
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