<template>
  <div id="security">
    <div class="person_header">
      <div v-if="showForm==='info'">
        <svg-icon icon-class="iconanquanshezhi"></svg-icon>
        <span class="tit">安全设置</span>
      </div>
      <el-page-header @back="backInfo" v-else>
        <template slot="title">
          <svg-icon icon-class="iconanquanshezhi"></svg-icon>
          <span class="tit">安全设置</span>
        </template>
        <template slot="content">
          <span class="subTit">{{subTitle}}</span>
        </template>
      </el-page-header>
    </div>
    <div class="person_content">
      <el-form ref="form" class="info-form" v-if="showForm==='info'" :model="userInfo" label-width="0">
        <div class="forml-item">
          <div class="label">邮箱</div>
          <div class="forml_main">
            <el-input disabled v-model="userInfo.mail" type="text" />
            <span class="btns" @click="showForm = 'emailForm'">修改邮箱</span>
          </div>
        </div>
        <div class="forml-item">
          <div class="label">手机号</div>
          <div class="forml_main">
            <el-input disabled v-model="userInfo.mobile" type="text" />
            <span class="btns" @click="showForm = 'phoneForm'">修改手机号</span>
          </div>
        </div>
        <div class="forml-item">
          <div class="label">密码</div>
          <div class="forml_main">
            <el-input disabled v-model="userInfo.password" type="password" />
            <span class="btns" @click="showForm = 'psdForm'">修改密码</span>
          </div>
        </div>
      </el-form>
      <el-form
        ref="emailForm"
        class="update-form"
        :model="role"
        label-width="0"
        v-if="showForm === 'emailForm'"
        :rules="rules"
      >
        <div class="form-content">
          <div class="forml-item">
            <div class="label">新邮箱</div>
            <el-form-item prop="mail">
              <el-input v-model="role.mail" type="text" placeholder="请输入新邮箱" />
            </el-form-item>
          </div>
          <div class="forml-item">
            <div class="label">手机号</div>
            <el-form-item prop="mobile">
              <el-input v-model="role.mobile" type="text" placeholder="请输入手机号" />
            </el-form-item>
          </div>
          <div class="forml-item">
            <div class="label">验证码</div>
            <el-form-item prop="verifyCode">
              <el-input v-model="role.verifyCode" placeholder="请输入验证码">
                <el-button slot="append" :style="cursorStyle" @click="getCode">{{codeMsg}}</el-button>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-item">
          <div class="btns">
            <el-button @click="backInfo">取消</el-button>
            <el-button type="primary" @click="submitForm('emailForm')">提交</el-button>
          </div>
        </div>
      </el-form>
      <el-form
        ref="psdForm"
        class="update-form"
        :model="role"
        label-width="0"
        v-if="showForm === 'psdForm'"
        :rules="rules"
      >
        <div class="form-content">
          <div class="forml-item">
            <div class="label">旧密码</div>
            <el-form-item prop="oldPassword">
              <el-input
                :type="ifOldDisplay?'text':'password'"
                v-model="role.oldPassword"
                autocomplete="new-password"
                placeholder="请输入旧密码"
                v-popover:popover2
              >
                <i
                  v-show="!ifOldDisplay&&role.oldPassword"
                  slot="suffix"
                  class="iconfont iconyincang"
                  @click="ifOldDisplay=!ifOldDisplay"
                ></i>
                <i
                  v-show="ifOldDisplay"
                  slot="suffix"
                  class="el-icon-view"
                  @click="ifOldDisplay=!ifOldDisplay"
                ></i>
              </el-input>
            </el-form-item>
          </div>
          <div class="forml-item">
            <div class="label">新密码</div>
            <el-form-item prop="password">
              <el-input
                :type="ifDisplay?'text':'password'"
                v-model="role.password"
                autocomplete="new-password"
                placeholder="请输入新密码"
                v-popover:popover2
              >
                <i
                  v-show="!ifDisplay&&role.password"
                  slot="suffix"
                  class="iconfont iconyincang"
                  @click="ifDisplay=!ifDisplay"
                ></i>
                <i
                  v-show="ifDisplay"
                  slot="suffix"
                  class="el-icon-view"
                  @click="ifDisplay=!ifDisplay"
                ></i>
              </el-input>
            </el-form-item>
          </div>
          <div class="forml-item">
            <div class="label">重复新密码</div>
            <el-form-item prop="checkPass">
              <el-input
                :type="ifDisplayCek?'text':'password'"
                autocomplete="new-password"
                v-model="role.checkPass"
                placeholder="请二次确认密码"
              >
                <i
                  v-show="!ifDisplayCek&&role.checkPass"
                  slot="suffix"
                  class="iconfont iconyincang"
                  @click="ifDisplayCek=!ifDisplayCek"
                ></i>
                <i
                  v-show="ifDisplayCek"
                  slot="suffix"
                  class="el-icon-view"
                  @click="ifDisplayCek=!ifDisplayCek"
                ></i>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-item">
          <div class="btns">
            <el-button @click="backInfo">取消</el-button>
            <el-button type="primary" @click="submitForm('psdForm')">提交</el-button>
          </div>
        </div>
      </el-form>

      <el-form
        ref="phoneForm"
        class="update-form"
        :model="role"
        label-width="0"
        v-if="showForm === 'phoneForm'"
        :rules="rules"
      >
        <div class="form-content">
          <!-- <div class="forml-item">
            <div class="label">旧手机号</div>
            <el-form-item prop="oldPhone">
              <el-input v-model="role.oldPhone" disabled type="text" placeholder="请输入角色名称" />
            </el-form-item>
          </div> -->
          <div class="forml-item">
            <div class="label">新手机号</div>
            <el-form-item prop="mobile">
              <el-input v-model="role.mobile" type="text" placeholder="请输入新手机号" />
            </el-form-item>
          </div>
          <div class="forml-item">
            <div class="label">验证码</div>
            <el-form-item prop="verifyCode">
              <el-input v-model="role.verifyCode" placeholder="请输入验证码">
                <el-button slot="append" :style="cursorStyle" @click="getCode">{{codeMsg}}</el-button>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-item">
          <div class="btns">
            <el-button @click="backInfo">取消</el-button>
            <el-button type="primary" @click="submitForm('phoneForm')">提交</el-button>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { notEmpty, isPhone, checkPhone, isEmail } from '@utils'
import {
  changeMail,
  changeMobile,
  thirdPlatList,
  changePassword,
  getCodeReq
} from '@api/organization/person'
export default {
  name: 'Info',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (value.length < 6) {
          callback(new Error('请至少输入6个字符'))
        }
        if (this.role.checkPass !== '') {
          this.$refs.psdForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.role.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ifDisplay: false,
      ifOldDisplay: false,
      ifDisplayCek: false,
      role: {
        name: '',
        username: '',
        mail: '',
        mobile: '',
        oldPassword: '',
        password: '',
        checkPass: '',
        verifyCode: '',
        oldPhone: ''
      },
      codeMsg: '获取验证码',
      rules: {
        mobile: [notEmpty('手机号码'), isPhone('手机号码')],
        mail: [notEmpty('邮箱'), isEmail('邮箱')],
        verifyCode: [notEmpty('验证码')],
        oldPassword: [notEmpty('旧密码')],
        password: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      },
      cursorStyle: {
        cursor: 'pointer'
        // background: "#1B68FD",
        // color: "#fff"
      },
      showForm: 'info',
      componentId: null
    }
  },
  props: ['userInfo'],
  computed: {
    subTitle() {
      let title = ''
      if (this.showForm == 'emailForm') title = '修改邮箱'
      if (this.showForm == 'phoneForm') title = '修改手机号'
      if (this.showForm == 'psdForm') title = '修改密码'
      return title
    }
  },
  methods: {
    getCode() {
      // 获取验证码
      const mobile = this.role.mobile
      if (mobile == '') {
        this.$refs[this.showForm].validateField('mobile')
        return
      } else if (!checkPhone(mobile)) {
        this.$refs[this.showForm].validateField('mobile')
        return
      }
      if (this.cursorStyle.cursor === 'pointer') {
        this.getCodeReq()
        this.cursorStyle = {
          cursor: 'not-allowed'
          // background: "#DCDFE6",
          // color: "#999"
        }
        this.setDelay(60)
      }
    },
    // 发送短信验证码
    getCodeReq() {
      getCodeReq({ mobile: this.role.mobile }).then(response => {
        const res  = response.data
        if (res.code === '000000') {
          this.$message({ type: 'success', message: '发送成功' })
        } else {
          this.$message({ type: 'error', message: res.data })
        }
      })
    },
    setDelay(time) {
      // 倒计时
      this.codeMsg = '请' + time + '秒后再试'
      const that = this
      setTimeout(function() {
        time--
        if (time > 0) {
          that.setDelay(time)
        } else {
          that.cursorStyle = {
            cursor: 'pointer'
            // background: "#1B68FD",
            // color: "#fff"
          }
          that.codeMsg = '获取验证码'
        }
      }, 1000)
    },
    backInfo() {
      this.showForm = 'info'
      this.role = {
        name: '',
        username: '',
        mail: '',
        mobile: '',
        oldPassword: '',
        password: '',
        checkPass: '',
        verifyCode: '',
        oldPhone: ''
      }
    },
    submit(formName) {
      let api = null
      const { mail, mobile, verifyCode, password, oldPassword } = this.role
      let con = {}
      if (formName == 'emailForm') {
        api = changeMail
        con = { mail, verifyCode }
      } else if (formName == 'phoneForm') {
        api = changeMobile
        con = { verifyCode, mobile }
      } else if (formName == 'psdForm') {
        api = changePassword
        con = { password, oldPassword }
      }
      if (!api) return
      api(con).then(response => {
        const res  = response.data
        if (res.code === '000000') {
          this.$store.dispatch('user/getInfo')
          this.$message({ type: 'success', message: '修改成功' })
        } else {
          this.$message({ type: 'error', message: res.data })
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submit(formName)
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.person_content {
  padding-top: 40px;
}

.forml-item {
  height: 80px;
  width: 100%;
  .label {
    margin-bottom: 10px;
  }
  & >>> .el-input {
    width: 342px;
    margin-right: 20px;
  }
  .btns {
    color: #1890ff;
    font-size: 14px;
    cursor: pointer;
  }
}
.update-form {
  // display: flex;
  i.el-icon-back {
    cursor: pointer;
    font-size: 23px;
    width: 50px;
    height: 35px;
    line-height: 35px;
  }
  .form-content {
    .forml-item {
      width: 50%;
      margin: 0 auto;
    }
  }
  .form-item {
    width: 50%;
    margin: 0 auto;
    .btns {
      width: 342px;
      display: flex;
      justify-content: center;
      margin-top: 40px;
    }
  }
}
</style>
