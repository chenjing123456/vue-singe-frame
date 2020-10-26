<template>
  <div id="circleDiff" class="container">
    <div class="dot" :style="{backgroundColor:mainColor}"></div>
    <div class="pulse" :style="{borderColor:mainColor}"></div>
  </div>
</template>
<script>
export default {
  name: 'CricleDiff',
  data() {
    return {}
  },
  props: {
    mainColor: {
      type: String,
      default: '#1890FF'
    }
  }
}
</script>
<style lang="scss" scoped>
@keyframes warn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  25% {
    transform: scale(0.2);
    opacity: 0.3;
  }
  50% {
    transform: scale(0.4);
    opacity: 0.5;
  }
  // 75% {
  //   transform: scale(0.7);
  //   opacity: 0.3;
  // }
  100% {
    transform: scale(0.7);
    opacity: 0;
  }
}
@-webkit-keyframes "warn" {
  0% {
    -webkit-transform: scale(0);
    opacity: 0;
  }
  25% {
    -webkit-transform: scale(0);
    opacity: 0.1;
  }
  50% {
    -webkit-transform: scale(0.1);
    opacity: 0.3;
  }
  75% {
    -webkit-transform: scale(0.5);
    opacity: 0.5;
  }
  100% {
    -webkit-transform: scale(1);
    opacity: 0;
  }
}

.container {
  position: relative;
  width: 30px;
  height: 30px;
  display: inline-block;
  // border: 1px solid #000;
}
/* 保持大小不变的小圆圈  */
.dot {
  position: absolute;
  width: 6px;
  height: 6px;
  left: 50%;
  top: 50%;
  margin-top: -3px;
  margin-left: -3px;
  // -webkit-border-radius: 20px;
  // -moz-border-radius: 20px;
  // border: 2px solid red;
  // border-radius: 20px;
  background: #1890ff;
  border-radius: 50%;
  z-index: 2;
}
/* 产生动画（向外扩散变大）的圆圈  */
.pulse {
  position: absolute;
  width: 24px;
  height: 24px;
  left: 50%;
  top: 50%;
  margin-left: -12px;
  margin-top: -12px;
  border: 3px solid #1890ff;
  -webkit-border-radius: 30px;
  -moz-border-radius: 30px;
  border-radius: 30px;
  z-index: 1;
  opacity: 0;
  -webkit-animation: warn 2s ease-out;
  -moz-animation: warn 2s ease-out;
  animation: warn 2s ease-out;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}
</style>
