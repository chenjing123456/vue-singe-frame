<template>
  <div :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <div class="app-header">
      <app-logo></app-logo>
      <navbar />
    </div>
    <div class="app-wrappers">
        <no-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, TagsView } from './components'
import  NoMain from './components/NoMain'
import  AppLogo from './components/AppLogo'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
export default {
  name: 'NoLayout', // 无菜单的全局layout
  components: {
    Navbar,
    // Sidebar,
    AppLogo,
    NoMain
    // TagsView,
    // Breadcrumb,
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader,
      showBreadCrumb: state => state.settings.showBreadCrumb
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@styles/mixin.scss";
@import "~@styles/variables.scss";
.app-header {
  height: 64px;
  display: flex;
  box-shadow: 0px 2px 8px 0px rgba(0, 61, 120, 0.12);
  //解决阴影被覆盖
  position: relative;
  z-index: 1002;
  & > .navbar {
    flex: 1;
  }
}

//height  64px + 16*2（padding） = 96
.app-wrappers {
  @include clearfix;
  display: flex;
  position: relative;
  background: #F3F4F6 ;
  padding: 16px 20px;
  min-height: calc(100vh - 96px);
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
