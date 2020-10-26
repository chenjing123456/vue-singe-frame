<template>
  <div class="login-container">
    <div class="login-main">
      <div class="login-box">
        <section class="login-header">
          <svg-icon icon-class="logo" />
          <div class="sperate">|</div>
          <div class="title">运营端</div>
        </section>
        <section class="login-footer">
          <el-tabs v-model="loginType" @tab-click="changeType">
            <el-tab-pane label="密码登录" name="first">
              <el-form :model="loginForm" ref="loginForm" label-width="0px" class="ruleForm">
                <el-form-item label prop="username" :rules="[notEmpty('您的账号')]">
                  <el-input v-model="loginForm.username" placeholder="账号" clearable>
                    <i class="iconfont iconyonghuming" slot="prefix"></i>
                  </el-input>
                </el-form-item>
                <el-form-item label prop="password" :rules="[notEmpty('密码')]">
                  <el-input
                    v-model="loginForm.password"
                    placeholder="密码"
                    type="password"
                    show-password
                    @keyup.enter.native="handleLogin"
                  >
                    <i class="iconfont iconmima" slot="prefix"></i>
                  </el-input>
                </el-form-item>
                <el-form-item class="el-form-item-pwdOperate">
                  <div class="flex-between">
                    <el-checkbox v-model="isCheck">记住密码</el-checkbox>
                    <div class="flx">
                      <el-button type="text" @click="$router.push({path:'/login/forgetPwd'})">忘记密码？</el-button>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item class="el-form-item-login">
                  <el-button class="submit-btn" type="primary" @click="handleLogin()">登 录</el-button>
                </el-form-item>
                <!-- <div class="item-treaty">
                  <el-checkbox v-model="isCheckTreaty">
                    已阅读并同意
                    <span class="treaty" @click.stop="showTreaty =true">《用户使用协议》</span>
                  </el-checkbox>
                </div> -->
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="验证码登录" name="second">
              <el-form :model="codeForm" ref="codeForm" label-width="0px" class="ruleForm">
                <el-form-item label prop="username" :rules="[notEmpty('您的手机号')]">
                  <el-input
                    v-model="codeForm.username"
                    class="input-with-select"
                    placeholder="请输入您的手机号"
                    clearable
                  >
                    <el-select v-model="selectCity" slot="prepend" placeholder="请选择">
                      <el-option
                        :label="item.cn+'+'+item.prefix"
                        :value="item.cn+'+'+item.prefix"
                        v-for="(item,index) in prefixs"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
                <el-form-item label prop="password" :rules="[notEmpty('验证码')]">
                  <el-input
                    v-model="codeForm.password"
                    placeholder="验证码"
                    type="password"
                    show-password
                  >
                    <template slot="append">
                      <span class="getCode">获取验证码</span>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item class="el-form-item-pwdOperate">
                  <div class="flex-between">
                    <el-checkbox v-model="isCheck">记住密码</el-checkbox>
                    <div class="flx">
                      <el-button type="text" @click="$router.push({path:'/login/forgetPwd'})">忘记密码？</el-button>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item class="el-form-item-login">
                  <el-button class="submit-btn" type="primary">登 录</el-button>
                </el-form-item>
                <!-- <div class="item-treaty">
                  <el-checkbox v-model="isCheckTreaty">
                    已阅读并同意
                    <span class="treaty" @click.stop="showTreaty =true">《用户使用协议》</span>
                  </el-checkbox>
                </div> -->
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <section class="other-login">
            <span>其他登录方式</span>
            <div class="login-list">
              <el-popover
                popper-class="entMyPoper"
                ref="popover"
                placement="right"
                width="40"
                trigger="hover"
                content="扫码"
              ></el-popover>
              <div class="item dd" @click="$router.push({path:'/login/ddLogin'})">
                <div class="center" v-popover:popover>
                  <svg-icon icon-class="iconpinpaibiaoshi-dingding"></svg-icon>
                </div>
                <span class="sub-tit">钉钉</span>
              </div>
            </div>
          </section>
        </section>
      </div>
    </div>
    <login-bg></login-bg>
  </div>
</template>

<script>
/**
 * @description 登录
 * @author xiaomeng
 */
import {
  validUsername,
  onlyNumEng,
  notEmpty,
  fhwfroms,
  fhwton,
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage
} from '@utils'
import { prefixs } from '@constant'
import LoginBg from './components/LoginBg'

export default {
  name: 'Login',
  components: { LoginBg },
  data() {
    return {
      loginType: 'first',
      prefixs,
      selectCity: '中国+86',
      loginForm: {
        username: undefined,
        password: undefined
      },
      showTreaty: false,
      notEmpty,
      isCheck: false,
      isCheckTreaty: false,
      ruleForm: {
        username: undefined,
        password: undefined
      },
      codeForm: {
        username: undefined,
        password: undefined
      },
      UK: 'fhwgrji5huh',
      SPLIT_STR: 'c3e3f79853lfnh43ge',
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // console.log(43);
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    this._getPsd()
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    submitBtn() {},
    changeType() {},
    /**
     * @description 记住密码的信息保存到本地
     * @author xiaomeng
     */
    _remPsd(username, password, type) {
      if (!type) return removeLocalStorage(this.UK)
      setLocalStorage(
        this.UK,
        fhwton(username) + this.SPLIT_STR + fhwton(password)
      )
    },
    /**
     * @description 获取记住密码的信息
     */
    _getPsd() {
      const str = getLocalStorage(this.UK) || ''
      const u = str.split(this.SPLIT_STR)[0]
      const p = str.split(this.SPLIT_STR)[1]
      if (u && p) {
        this.loginForm.username = fhwfroms(u)
        this.loginForm.password = fhwfroms(p)
        this.isCheck = true
      }
    },
    goto() {
      this.$router.push({ path: '/register' })
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= 'a' && key <= 'z') ||
          (!shiftKey && key >= 'A' && key <= 'Z')
        ) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      // if (!this.isCheckTreaty) {
      //   this.$message({ type: 'error', message: '请阅读并同意用户协议' })
      //   return
      // }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 记住密码
          this._remPsd(
            this.loginForm.username,
            this.loginForm.password,
            this.isCheck
          )
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then((res) => {
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery
              })
              this.loading = false
            })
            .catch((error) => {
              let data = error
              this.loading = false
              this.$message({ type: 'error', message: data })
            })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@styles/variables.scss";

.login-container {
  .login-box {
    & >>> .el-tabs {
      .el-tabs__item {
        font-size: 0.16rem;
      }
      .el-tabs__nav-wrap::after {
        display: none;
      }
      .el-tabs__active-bar {
        height: 4px;
        border-radius: 2px;
      }
      .el-tabs__nav {
        margin-bottom: 0.36rem;
      }
      .el-tabs__header {
        margin: 0 !important;
      }
      #tab-first::after {
        content: "";
        height: 9px;
        border: 1px solid rgba(212, 220, 233, 0.85);
        position: absolute;
        top: 15px;
        right: 0;
      }
      .el-tabs__item {
        &.is-active {
          color: rgba(0, 0, 0, 0.85);
        }
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
  .ruleForm {
    .el-form-item {
      margin-bottom: 0.25rem;
      font-size: 0.16rem;
      & >>> .el-input-group__append {
        background-color: #fff !important;
        color: #0080ff;
      }
    }
    .el-input >>> .el-input__prefix {
      left: 9px !important;
    }
    .el-form-item__content {
      line-height: 0.5rem;
      & >>> .el-form-item__error {
        padding-top: 0.04rem !important;
      }
    }

    .el-input input {
      height: 0.5rem;
      border-radius: 0.02rem;
      background-color: rgba(227, 234, 239, 0.1);
      border: 0.01rem solid rgba(0, 0, 0, 0.1);
      // font-size: 0.14rem;
    }
    .el-form-item-pwdOperate {
      & >>> .el-form-item__content {
        .el-checkbox__label {
          color: rgba(0, 0, 0, 0.45) !important;
        }
        .el-checkbox.is-checked {
          .el-checkbox__label {
            color: #0080ff !important;
          }
        }
      }
      .flex-between {
        display: flex;
        justify-content: space-between;
        .flx {
          display: flex;
          align-items: center;
          .spe {
            color: rgba(212, 220, 233, 0.85);
          }
          .reg {
            margin-left: 10px !important;
          }
        }
      }
    }
    .el-form-item-login {
      margin-bottom: 0.16rem !important;
      .submit-btn {
        width: 100%;
      }
    }
  }
  .item-treaty {
    & >>> .el-checkbox {
      .el-checkbox__label {
        color: rgba(0, 0, 0, 0.3) !important;
        vertical-align: middle;
        .treaty {
          color: #0080ff;
          cursor: pointer;
        }
      }
    }
  }
}
.input-with-select {
  & >>> .el-input-group__prepend {
    background-color: #fff !important;
    width: 110px !important;
  }
}
</style>
