<template>
  <div id="personCenter">
    <el-tabs tab-position="left" class="personTab" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="item" v-for="(item,index) in tabList" :name="item" :key="index">
        <component v-bind:is="componentId" :userInfo="userInfo" :list="list"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
/**
 * @description 个人中心
 * @author xiaomeng
 */
import { thirdPlatList } from '@api/organization/person'
import Info from './page/info.vue'
import Security from './page/security.vue'
import Application from './page/application.vue'
import Account from './page/account.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'PersonCenter',
  data() {
    return {
      activeName: '个人信息',
      componentId: Info,
      list: [],
      tabList: ['个人信息', '安全设置', '第三方账号', '第三方应用']
    }
  },
  computed: {
    ...mapGetters(['username', 'userInfo'])
  },
  mounted() {
    this.thirdPlatList()
    if (!this.username) {
      this.$store.dispatch('user/getInfo')
    }
  },
  components: {
    Info,
    Account,
    Security,
    Application
  },
  methods: {
    handleClick(tab) {
      let tabs = null
      if (tab.name === '个人信息') tabs = Info
      if (tab.name === '安全设置') tabs = Security
      if (tab.name === '第三方账号') tabs = Account
      if (tab.name === '第三方应用') tabs = Application
      this.componentId = tabs
    },
    thirdPlatList() {
      thirdPlatList().then(res => {
        const data = res.data
        if (data.code === '000000') {
          this.list = data.data
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@styles/variables.scss";
#personCenter {
  background: #fff;
  width: 100%;
  //   display: flex;
  .personTab {
    // width: 185px;
    height: 100%;
  }
  & >>> .el-tabs {
    .el-tabs__header {
      width: 185px;
    }
    .el-tabs__item {
      // margin-bottom: 20px;
    }
    .el-tabs__item.is-active {
      background: #e6f7ff;
    }
    &.el-tabs--left .el-tabs__item.is-left {
      text-align: center !important;
    }
    .el-tabs__nav-wrap.is-left::after {
      width: 1px !important;
    }
    .el-tabs__nav-scroll {
      padding-top: 40px;
    }
    .el-tabs__content {
      height: 100%;
      padding: 40px 50px;
      @include bottomCom;
    }
  }
}

</style>
