<template>
  <!-- 背景层（单独图层），使用SVG图片作为背景 -->
  <img class="background-layer" src="../assets/background.svg" alt="background" />

  <!-- 雪花层（单独图层），使用canvas标签绘制雪花效果 -->
  <canvas ref="canvas" class="snow-layer"></canvas>
</template>

<script>
export default {
  name: "Snowfall",
  data() {
    return {
      SNOWFLAKE_COLOR: "#FFF", // 雪花颜色，白色
      SNOWFLAKE_SIZE: 6, // 雪花的基本大小
      SNOWFLAKE_MIN_SCALE: 0.5, // 雪花最小缩放比例
      OVERFLOW_THRESHOLD: 50, // 雪花超出视窗后重置的位置阈值
      SNOWFLAKE_COUNT: 100, // 雪花数量
      scale: 1, // 设备像素比，用于处理高分辨率屏幕
      width: 0, // canvas宽度
      height: 0, // canvas高度
      snowflakes: [], // 存储所有雪花对象
      velocity: { // 雪花的速度参数
        x: 0, // 水平方向速度
        y: 2, // 垂直方向速度
        tx: 0,
        ty: 3,
        z: 0.0005 // 雪花的z轴速度，用于模拟不同大小雪花的飘落速度差异
      }
    };
  },
  mounted() {
    // 组件挂载后初始化
    this.initialize();
    // 添加窗口大小改变时的监听事件，以调整canvas大小
    window.addEventListener("resize", this.resize);
  },
  beforeDestroy() {
    // 组件销毁前移除窗口大小改变事件监听
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    async initialize() {
      // 等待DOM更新后再进行初始化操作
      await this.$nextTick();
      // 检查canvas元素是否存在
      if (!this.$refs.canvas) {
        console.error("Canvas element not found");
        return;
      }
      // 根据窗口大小调整canvas尺寸
      this.resize();
      // 生成雪花
      this.generate();
      // 开始雪花动画循环
      this.step();
    },
    generate() {
      // 清空雪花数组
      this.snowflakes = [];
      // 根据SNOWFLAKE_COUNT生成相应数量的雪花，每朵雪花的位置和大小随机
      for (let i = 0; i < this.SNOWFLAKE_COUNT; i++) {
        this.snowflakes.push({
          x: Math.random() * this.width, // 随机水平位置
          y: Math.random() * this.height, // 随机垂直位置
          z: this.SNOWFLAKE_MIN_SCALE + Math.random() * (1 - this.SNOWFLAKE_MIN_SCALE) // 随机缩放大小，最小值为SNOWFLAKE_MIN_SCALE
        });
      }
    },
    resize() {
      // 获取设备像素比
      this.scale = window.devicePixelRatio || 1;
      // 根据窗口大小和像素比设置canvas宽度和高度
      this.width = window.innerWidth * this.scale;
      this.height = window.innerHeight * this.scale;
      const canvas = this.$refs.canvas;
      if (canvas) {
        canvas.width = this.width;
        canvas.height = this.height;
      }
    },
    step() {
      // 获取canvas节点
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      // 获取绘图上下文
      const context = canvas.getContext("2d");
      if (!context) return;

      // 清除canvas上的内容，以实现雪花移动的效果
      context.clearRect(0, 0, this.width, this.height);

      // 更新雪花位置
      this.update();
      // 渲染雪花
      this.render();
      // 使用requestAnimationFrame创建动画帧
      requestAnimationFrame(this.step);
    },
    update() {
      // 遍历每朵雪花并更新其位置
      this.snowflakes.forEach((snowflake) => {
        // 水平方向位置更新，受到时间和其他雪花属性的影响，使其看起来更自然
        snowflake.x += Math.sin(Date.now() * 0.001 * snowflake.z) * 0.5;
        // 垂直方向位置更新，模拟雪花下落
        snowflake.y += this.velocity.y * snowflake.z;
        // 检查雪花是否超出视窗范围，如果是，则将其重置到视窗上方的随机位置
        if (snowflake.y > this.height + this.OVERFLOW_THRESHOLD) {
          snowflake.y = -this.OVERFLOW_THRESHOLD;
          snowflake.x = Math.random() * this.width;
        }
      });
    },
    render() {
      // 获取canvas节点
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      // 获取绘图上下文
      const context = canvas.getContext("2d");
      if (!context) return;

      // 绘制每朵雪花
      this.snowflakes.forEach((snowflake) => {
        // 开始新的绘制路径
        context.beginPath();
        // 使用arc方法绘制圆形（雪花）
        context.arc(
            snowflake.x, // 雪花x坐标
            snowflake.y, // 雪花y坐标
            this.SNOWFLAKE_SIZE * snowflake.z * this.scale, // 根据雪花缩放比例和设备像素比计算出的雪花大小
            0, // 起始角度
            Math.PI * 2 // 结束角度，绘制完整的圆形
        );
        // 设置填充颜色为白色
        context.fillStyle = this.SNOWFLAKE_COLOR;
        // 填充绘制的圆形
        context.fill();
      });
    }
  }
};
</script>

<style scoped>
/* 背景层样式，固定在视窗底部，铺满整个视窗，确保图片覆盖整个区域且不影响交互 */
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1; /* 确保背景层在主内容下方 */
  object-fit: cover; /* 确保背景图片按比例缩放填满整个背景层 */
  pointer-events: none; /* 确保背景层不影响页面交互 */
}

/* 雪花层样式，固定在视窗底部，铺满整个视窗，置于背景层之上，主内容之下 */
.snow-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0; /* 确保雪花层在背景层上方，主内容下方 */
  pointer-events: none; /* 确保雪花层不影响页面交互 */
  background-color: transparent; /* 设置背景为透明，使雪花可以覆盖在背景图上 */
}
</style>
