<template>
  <div id="account">
    <div class="person_header">
      <svg-icon icon-class='icondisanfangzhanghao'></svg-icon>
      <span class="tit">第三方账号</span>
    </div>
    <div class="account-content">
      <div class="account-item">
        <div class="info_lf">
          <i class="el-icon-user-solid"></i>
          <span>钉钉</span>
        </div>
        <span class="bind">去绑定</span>
      </div>
      <div class="account-item">
        <div class="info_lf">
          <i class="el-icon-user-solid"></i>
          <span>员工中心</span>
        </div>
        <span class="bind hasBind">解除绑定</span>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * @description 第三方账号
 * @author xiaomeng
 */
export default {
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.account-content {
  padding-top: 35px;
  .account-item {
    color: rgba(0, 0, 0, 0.5);
    padding: 0 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    width: 560px;
    height: 70px;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(0, 25, 49, 0.1);
    margin-bottom: 30px;

    .info_lf {
      display: flex;
      align-items: center;
      i {
        font-size: 24px;
        margin-right: 15px;
      }
    }
    .bind {
      color: #0091ff;
    }
    .hasBind {
      color: #ff4d4f;
    }
  }
}
</style>
