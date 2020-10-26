<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*117= navbar+breadcrumb =  64 +53 */
  height: calc(100vh - 117px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 20px;
  background: #F7F8F9;
  display: flex;
}

.fixed-header + .app-main {
  padding-top: 64px;
}

.hasTagsView {
  .app-main {
    /* 117px = navbar + breadcrumb + tags-view = 64 + 53 +0 */
    max-height: calc(100vh - 117px);
    // min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
.main-notbreadcrumb{//没有面包屑状态时
  .app-main{
    min-height: 100%!important;
    padding:0;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
