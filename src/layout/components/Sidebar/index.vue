<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="side-nav">
        <div class="m-side-nav">
          <div class="m-side-title" v-show="sidebar.opened">{{currentRoute}}</div>
          <div class="m-side-body">
            <el-menu
              :default-active="activeMenu"
              :collapse="isCollapse"
              :background-color="variables.menuBg"
              :text-color="variables.menuText"
              :unique-opened="false"
              :active-text-color="variables.menuActiveText"
              :collapse-transition="false"
              mode="vertical"
            >
              <sidebar-item v-for="route in getFilterRoutes(currentRoute)" :key="route.path" :item="route" :base-path="route.path" />
            </el-menu>
          </div>
        </div>
      </div>
      <!-- <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in (permission_routes)" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu> -->
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {

    }
  },
  mounted() {
    // console.log(this.permission_routes)
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar',
      'currentRoute',
      'currentPath'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      // console.log(this.$route, meta.activeMenu, path)
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    getFilterRoutes(activeName) { // sons是根据后台菜单权限筛选后的菜单
      let filterRoutes = []
      filterRoutes = this.permission_routes.find(item => !item.hidden && item.meta && (item.meta.title === activeName || item.path === this.$route.path))
      console.log(filterRoutes);
      return filterRoutes ? filterRoutes.sons : []
    }
  }
}
</script>
<style lang="scss" scoped>
.side-nav {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  .m-side-nav {
    .m-side-title {
      padding: 18px 24px;
      color: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
