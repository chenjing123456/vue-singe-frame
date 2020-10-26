<template>
  <div class="navbar">
    <div class="left-menu">
      <hamburger
        id="hamburger-container"
        :is-active="sidebar.opened"
        class="hamburger-container left_item"
        @toggleClick="toggleSideBar"
      />
      <div class="index left_item" @click="changeCurrentRoute({name:'应用台',href:'/'})">
        <i class="el-icon-s-home"></i>
        <span>首页</span>
      </div>
      <div class="left_item currentRoute">
        <el-popover placement="top-start" title width="840" trigger="hover">
          <div slot="reference">
            <span>{{currentRoute}}</span>
            <i class="el-icon-arrow-down"></i>
          </div>
          <div class="currentRoute-main">
            <div class="currentRoute-header">
              <span>应用台</span>
              <!-- <i class="iconfont iconshezhi"></i> -->
            </div>
            <div class="currentRoute-content">
              <div class="item" v-for="(item,index) in routesFilter" :key="index">
                <div class="title">
                  <span class="name">{{item.name}}</span>
                  <div class="line"></div>
                </div>
                <div class="menu_box">
                  <div
                    v-for="(temp,i) in item.sonMenu||[]"
                    class="menu-item"
                    :key="i"
                    @click="changeCurrentRoute(temp)"
                  >
                    <svg-icon v-if="filterIcons(temp.icon)" :icon-class="filterIconClass(temp)" />
                    <i v-else :class="filterIconClass(temp)"></i>
                    <span class="sub-title">{{temp.name}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-popover>
      </div>
    </div>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <div class="right-menu-item">
          <i class="iconfont icontongzhi1"></i>
        </div>
        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->
        <screenfull id="screenfull" class="right-menu-item" />
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" :hide-on-click="false">
        <div class="avatar-wrapper">
          <el-avatar :size="28" :src="avatar"></el-avatar>
          <span>{{name}}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in handList" :key="index" :divided="index!==0">
            <span style="display:block;" @click="changeCurrentRoute(item)">{{item.title}}</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出系统</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'
// import userAvatar from "@/assets/setting/user-logo.png";
import { getDeleteSomeList, getRightFloatList } from '@utils'
export default {
  data() {
    return {
      routesFilter: [],
      handList: [
        {
          name: '系统设置',
          href: '/organization/personCenter',
          title: '个人中心',
          type: 2 // 1-表示异步路由内部跳转 2-表示固定路由跳转 3-表示外部跳转
        },
        {
          name: '后台管理中心',
          href: '',
          title: '后台管理中心',
          type: 1
        }
      ]
      // userAvatar
    }
  },
  components: {
    // Breadcrumb,
    Hamburger,
    // ErrorLog,
    Screenfull
    // SizeSelect,
    // Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'name',
      'currentRoute',
      'appHeaderRoutes'
    ])
  },
  mounted() {
    // 应用台需要去除系统设置
    let list = JSON.parse(JSON.stringify(this.appHeaderRoutes))
    this.routesFilter =  getDeleteSomeList(list, 'sonMenu', 'href', '/organization') || []
    getRightFloatList(
      JSON.parse(JSON.stringify(this.appHeaderRoutes)),
      'sonMenu',
      this.handList
    )
  },
  filters: {},
  methods: {
    filterIconClass(item) {
      if (!item || !item.icon) return
      const type = item.icon.split(':')[0]
      let className = ''
      const name = item.icon.split(':')[1] || ''
      if (type === 'color') {
        className = name
      } else {
        // 线性
        className = `iconfont ${name}`
      }
      return className
    },
    filterIcons(item) {
      if (!item) return
      const type = item.split(':')[0]
      if (type === 'color') return true
      return false // 线性
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    changeCurrentRoute(item) {
      // 切换应用台
      if (!item.href || (item.sonMenu && item.sonMenu.length == 0)) {
        this.$message({ type: 'warning', message: '无该模块下的菜单权限' })
        return
      }
      this.$store.dispatch('permission/setCurrentRoue', item)
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 64px;
  overflow: hidden;
  position: relative;
  background: #fff;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left-menu {
    display: flex;
    align-items: center;
    height: 64px;
    line-height: 64px;
    .left_item {
      margin-right: 20px;
      font-size: 14px;
      display: flex;
      cursor: pointer;
      align-items: center;
    }
    .index {
      i {
        font-size: 17px;
        color: #0091ff;
        margin-right: 3px;
      }
    }
    .currentRoute {
      &:hover {
        background: rgba(0, 145, 255, 0.05);
      }
      i.el-icon-arrow-down {
        margin-left: 5px;
      }
    }
  }
  .hamburger-container {
    // line-height: 64px;
    // height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    &:hover {
      // background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    // float: right;
    height: 100%;
    line-height: 64px;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin-right: 24px;
      height: 100%;
      font-size: 18px;
      // color: #5a5e66;
      vertical-align: text-bottom;
      .icontongzhi1 {
        color: rgba(0, 0, 0, 0.65);
      }
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        &:hover {
          background: rgba(0, 145, 255, 0.05);
        }
      }
    }
    .avatar-container {
      margin-right: 24px;
      .avatar-wrapper {
        margin-top: 12px;
        position: relative;
        display: flex;
        height: 40px;
        border-radius: 50%;
        align-items: center;
        font-size: 14px;
        & >>> .el-avatar {
          margin-right: 8px;
        }
        // .el-icon-caret-bottom {
        //   cursor: pointer;
        //   position: absolute;
        //   right: -20px;
        //   top: 25px;
        //   font-size: 12px;
        // }
      }
    }
  }
}

.currentRoute-main {
  padding: 0 15px;
  .currentRoute-header {
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 550;
  }
  .currentRoute-content {
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    .item {
      width: 48%;
      margin-bottom: 16px;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5px;
        font-weight: 550;
        color: rgba(0, 0, 0, 0.85);
      }
      .name {
        display: inline-block;
            min-width: 50px;
      }
      .line {
        // width: 80%;
        flex: 1;
        margin-left: 15px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      &:nth-child(2n-1) {
        margin-right: 4%;
      }
      .menu_box {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .menu-item {
          min-width: 23%;
          height: 35px;
          display: flex;
          cursor: pointer;
          align-items: center;
          margin-bottom: 16px;
          .svg-icon {
            font-size: 21px;
          }
          i {
            display: inline-block;
            width: 21px;
            height: 21px;
          }
          .sub-title {
            margin-left: 3px;
            color: rgba(0, 0, 0, 0.65);
          }
          margin-right: 2%;
          &:nth-child(4n){
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
