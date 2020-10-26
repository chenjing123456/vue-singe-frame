<template>
  <div class="app-logo">
    <svg-icon :icon-class="logoIcon"></svg-icon>
    <span class="sperate">|</span>
    <span>{{logoTitle || '运营中心'}}</span>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      logoIcon: state => state.settings.logoIcon,
      logoTitle: state => state.settings.logoTitle
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~@styles/variables.scss";
.app-logo {
  min-width: $sideBarWidth;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
  .svg-icon {
    font-size: 70px;
  }
  color: rgba(0, 0, 0, 0.3);
  font-size: 14px;
  .sperate {
    margin: 0 7px;
  }
}
</style>
