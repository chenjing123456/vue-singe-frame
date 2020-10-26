<template>
  <div id="appc">
    <div class="person_header">
      <svg-icon icon-class="icondisanfangzhanghao"></svg-icon>
      <span class="tit">第三方应用</span>
    </div>
    <div class="appc-content">
      <div class="appc-item" v-for="(item,index) in list" :key="index" @click="goto(item.url)">
        <span class="icon" @click="goto(item.url)">
          <i class="iconfont iconlianjie"></i>
        </span>
        <span>{{item.name}}</span>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * @description 第三方应用
 * @author xiaomeng
 */
export default {
  data() {
    return {

    }
  },
  props: {
    list: {
      type: Array
    }
  },
  methods: {
    goto(url) {
      if (!url) return
      window.open(url, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
.appc-content {
  padding-top: 35px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .appc-item {
    font-size: 20px;
    .icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #0091ff;
      color: #fff;
      font-size: 17px;
      margin-right: 10px;
      text-align: center;
      line-height: 20px;
    }
    width: 33%;
    height: 40px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
}
</style>
