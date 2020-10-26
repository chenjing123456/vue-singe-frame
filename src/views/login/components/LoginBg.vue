<template>
  <div class="bg-box">
    <div class="arrow arrow--top">
      <svg-icon icon-class="circle-sq" class="item-to bounce-3 circle-sq"></svg-icon>
    </div>
    <div class="arrow arrow--bottom">
      <svg-icon icon-class="circle-sqb" class="item-to bounce-3 circle-sq"></svg-icon>
    </div>
    <div class="main">
      <div class="main__text-wrapper">
        <svg-icon icon-class="dotted-sq" class="dotted-circle"></svg-icon>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LoginBg'
}
</script>
<style lang="scss" scoped>
$purple: #8a15ff;
$blue: #3800e7;
$ltblue: #15e0ff;
$magenta: #d000c5;
$basisBg: #fff;
$mainBg: #e0edf9;

$F2: #f2f5f8;
$FC: #fcfcfc;

// This is an example of animations & svgs... I completely understand that the amount of absolute positioning in this file is insane... ;) <3

.bg-box {
  width: 100%;
  background: linear-gradient($F2, $FC);
  position: absolute;
  z-index: -1;
  //   height: 100vh;
  //   font-size: calc(14px + (26 - 14) * ((100vw - 300px) / (1600 - 300)));
  //   font-family: "DM Mono", monospace;
  //   font-weight: 300;
  overflow: hidden;
  color: white;
  text-align: center;
}

h1 {
  font-size: 3em;
  margin-bottom: 0.2em;
}

h2 {
  font-size: 2em;
}

.main {
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  position: relative;
  justify-content: center;
  align-items: center;

  &:before,
  &:after {
    content: "";
    display: block;
    position: absolute;
    z-index: -3;
  }
  &:before {
    right: -1.5rem;
    top: -4rem;
    height: 10rem;
    width: 10rem;
    border-radius: 30em;
    background: linear-gradient($basisBg,$mainBg);
    align-self: flex-end;
    animation: gradient-fade 5s ease-in-out 3s infinite alternate;
  }
  &:after {
    $circle-unit: 10em;
    top: 2rem;
    left: 6.3rem;
    height: 2rem;
    width: 2rem;
    border-radius: $circle-unit;
    background: linear-gradient($basisBg, $mainBg);
    // animation: gradient-fade-alt 6s ease-in-out 3s infinite alternate;
    animation: rotation 7s linear infinite;
  }

  &__text-wrapper {
    position: relative;
    padding: 2em;

    &:before,
    &:after {
      content: "";
      display: block;
      position: absolute;
    }

    &:before {
      z-index: -1;
      top: -3.5rem;
      right: -48em;
      width: 3.5rem;
      height: 3.5rem;
      opacity: 0.7;
      border-radius: 13em;
      background: linear-gradient($basisBg, $mainBg);
      animation: rotation 7s linear infinite;
    }

    &:after {
      $circle-unit: 20em;
      z-index: -1;
      bottom: -8rem;
      width: 6rem;
      height: 6rem;
      left: -6rem;
      border-radius: $circle-unit;
      background: linear-gradient($mainBg, $basisBg);
      animation: rotation 7s linear infinite;
    }
  }
}

.circle-sq {
  height: 8rem;
  width: 3rem;
}
.arrow {
  z-index: 1000;
  opacity: 0.5;
  position: absolute;
  &--top {
    top: 0.5rem;
    left: -1.5rem;
  }

  &--bottom {
    bottom: 0.5rem;
    right: -0.5rem;
  }
}

.circle {
  transform: translate(50%, -50%) rotate(0deg);
  transform-origin: center;
  &--ltblue {
    $circle-unit: 20em;
    height: $circle-unit;
    width: $circle-unit;
    border-radius: $circle-unit;
    background: linear-gradient($ltblue, $blue);
  }
}

.backdrop {
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: block;
  background-color: pink;
}

.dotted-circle {
  position: absolute;
  width: 3.2rem;
  height: 3.2rem;
  top: -2rem;
  right: -5.7rem;
  animation: rotation 38s linear infinite;
}

// animations
.draw-in {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 15s ease-in-out alternate infinite;
}

@keyframes draw {
  from {
    stroke-dashoffset: 1000;
  }

  to {
    stroke-dashoffset: 0;
  }
}

.item-to {
  animation-duration: 5s;
  animation-iteration-count: infinite;
  transform-origin: bottom;
}

.bounce-1 {
  animation-name: bounce-1;
  animation-timing-function: ease;
}

.bounce-2 {
  animation-name: bounce-2;
  animation-timing-function: ease;
}

.bounce-3 {
  animation-name: bounce-3;
  animation-timing-function: ease;
}

@keyframes bounce-1 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(50px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes bounce-2 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-30px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes bounce-3 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(30px);
  }
  100% {
    transform: translateY(0);
  }
}

// gradient fade

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes gradient-fade {
  from {
    transform: translate(0%, 0%) rotate(0deg);
  }
  to {
    transform: translate(50%, -50%) rotate(360deg);
  }
}

@keyframes gradient-fade-alt {
  from {
    transform: translate(-20%, 20%) rotate(0deg);
  }
  to {
    transform: translate(-60%, 60%) rotate(360deg);
  }
}
</style>
