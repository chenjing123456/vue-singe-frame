<template>
  <div :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <div class="app-header">
      <app-logo></app-logo>
      <navbar />
    </div>
    <div class="app-wrapper">
      <sidebar class="sidebar-container" />
      <div :class="{hasTagsView:needTagsView,'main-notbreadcrumb':!showBreadCrumb}" class="main-container">
        <div :class="{'fixed-header':fixedHeader}">
          <!-- <navbar /> -->
          <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
          <!-- <tags-view v-if="needTagsView" /> -->
        </div>
        <app-main />
        <right-panel v-if="showSettings">
          <settings />
        </right-panel>
      </div>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import  AppLogo from './components/AppLogo'
import Breadcrumb from '@/components/Breadcrumb'
export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    AppLogo,
    Settings,
    Sidebar,
    // TagsView,
    Breadcrumb
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
.app-wrapper {
  @include clearfix;
  display: flex;
  position: relative;
  // height: 100%;
  min-height: calc(100vh - 64px);
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
