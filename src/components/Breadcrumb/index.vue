<template>
  <el-breadcrumb class="app-breadcrumb" separator="/" v-show="isShow">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
// import data from '../../views/pdf/content'
export default {
  data() {
    return {
      levelList: null,
      isShow: true,
      whiteList: ['dataPermission', 'dataType']// 不显示面包屑的菜单{name}列表
    }
  },
  watch: {
    $route(route) {
      this.filterShowBreadcrumb(route.name)

      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.filterShowBreadcrumb(this.$route.name)
    this.getBreadcrumb()
  },
  methods: {
    filterShowBreadcrumb(name) {
      if (this.whiteList.includes(name)) {
        this.isShow = false
      } else {
        this.isShow = true
      }
      this.$store.dispatch('settings/changeSetting', {// 改变面包屑配置
        key: 'showBreadCrumb',
        value: this.isShow
      })
    },
    getBreadcrumb() {
      // only show routes with meta.title
      const matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      // const first = matched[0]
      // 去除首页
      // if (!this.isDashboard(first)) {
      //   matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      // }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left:24px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
