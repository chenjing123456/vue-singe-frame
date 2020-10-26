<template>
  <div class="app-card">
    <div class="card-item">
      <div class="card-head">填写信息</div>
      <div class="card-basic">
        <el-form ref="form" :model="user" label-width="0" :rules="rules">
          <div class="forml-item">
            <div class="label">
              用户名
              <span class="required">*</span>
            </div>
            <el-form-item prop="username">
              <el-input minlength="3" maxlength="16" show-word-limit v-model="user.username" type="text" placeholder="请输入用户名" />
            </el-form-item>
          </div>
          <div class="forml-item">
            <div class="label">姓名<span class="required">*</span></div>
            <el-form-item prop="name">
              <el-input v-model="user.name" placeholder="请输入用户姓名" />
            </el-form-item>
          </div>
          <div class="forml-item">
            <div class="label">昵称</div>
            <el-form-item prop="nickName">
              <el-input v-model="user.nickName" placeholder="请输入用户昵称" />
            </el-form-item>
          </div>
          <div class="forml-item">
            <div class="label">职位</div>
            <el-form-item prop="position">
              <el-input v-model="user.position" placeholder="请输入职位" />
            </el-form-item>
          </div>
          <div class="forml-item">
            <div class="label">手机号码</div>
            <el-form-item prop="mobile">
              <el-input v-model="user.mobile" placeholder="请输入手机号码" />
            </el-form-item>
          </div>
          <div class="forml-item">
            <div class="label">邮箱地址</div>
            <el-form-item prop="mail">
              <el-input v-model="user.mail" placeholder="请输入邮箱地址" />
            </el-form-item>
          </div>
          <div class="forml-item">
            <div class="label">组织架构</div>
            <el-form-item prop="groupIds">
              <el-cascader
                :options="groupList"
                v-model="user.groupIds"
                :props="props"
                clearable
              ></el-cascader>
            </el-form-item>
          </div>
          <div class="forml-item">
            <div class="label">所属角色</div>
            <el-form-item prop="role">
              <el-select multiple v-model="user.roleIds" placeholder="请选择">
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="submit-box">
      <el-button size="small" @click="$router.go(-1)">取消</el-button>
      <el-button type="primary" size="small" @click="submitRole('form')">提交</el-button>
    </div>
  </div>
</template>

<script>
/**
 * @description 用户管理新增/编辑
 * @author xiaomeng
 */
import { getList } from '@api/organization/group'
import { getAllRole, getUserDetail, addUser } from '@api/organization/user'
import { notEmpty, onlyNumEng, isPhone, isEmail } from '@utils'
export default {
  name: 'AddUser',
  data() {
    return {
      props: {
        value: 'id',
        checkStrictly: true,
        label: 'name',
        children: 'sonList',
        multiple: true
      },
      roleList: [],
      user: {
        name: '',
        username: '',
        mail: '',
        mobile: '',
        position: '',
        nickName: '',
        groupIds: [],
        roleIds: []
      },
      id: '', // 用户id
      groupList: [],
      rules: {
        username: [notEmpty('用户名'), onlyNumEng('用户名')],
        name: [notEmpty('姓名')],
        mobile: [isPhone('手机号码')],
        mail: [isEmail('邮箱')]
      }
    }
  },
  created() {
    this.getList()
    this.getAllRole()
    if (this.$route.query.id) {
      this.id = this.$route.query.id || ''
      this.getUserDetail()
    }
  },
  methods: {
    /**
     * @description 获取用户详情
    */
    getUserDetail() {
      getUserDetail({ userId: this.id }).then(response => {
        const that = this
        const res = response.data
        if (res.code == '000000') {
          const { user, groups, roles } = res.data
          const groupIds  = groups.map(v => {
            return v.map(val => { return val.id }).reverse()
          })
          const { name, username, mail, mobile, position, nickName } = user
          const roleIds = roles && roles.length > 0 ? roles.map(v => { return v.id }) : []
          this.user = { ...this.user, name, username, mail, mobile, position, nickName, groupIds, roleIds }
        } else {
          this.$message({
            message: res.mesg,
            type: 'error'
          })
        }
      })
    },
    /**
     * @description 获取所有角色
    */
    getAllRole() {
      getAllRole().then(response => {
        const res = response.data
        if (res.code == '000000') {
          this.roleList = res.data || []
        } else {
          this.roleList = []
          this.$message({
            message: res.mesg,
            type: 'error'
          })
        }
      })
    },
    /**
     * @description 获取全部组织架构
    */
    getList() {
      getList({ id: 0 }).then(response => {
        const res = response.data
        if (res.code == '000000') {
          this.groupList = res.data || []
        } else {
          this.groupList = []
          this.$message({
            message: res.mesg,
            type: 'error'
          })
        }
      })
    },
    /**
     * @description 新增用户
    */
    addUser() {
      let groupIds = []
      const arr = this.user.groupIds || []
      if (arr.length > 0) {
        groupIds = arr.map(v => {
          return v[v.length - 1]
        }) || []
      }
      let con = { ...this.user, groupIds }
      if (this.id) con = { ...con, id: this.id }
      addUser(con).then(response => {
        const that = this
        const { data } = response
        if (data.code == '000000') {
          this.$message({
            message: data.mesg,
            type: 'success'
          })
          this.$router.push({ name: 'userList' })
        } else {
          this.$message({
            message: data.data,
            type: 'error'
          })
        }
      })
    },
    /**
     * @description 提交校验
    */
    submitRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addUser()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@styles/variables.scss";
.app-card{
  @include bottomCom;
}
.card-basic {
  height: calc(100% - 124px);
  .el-form {
    display: flex;
    flex-wrap: wrap;
  }
  .forml-item {
    width: 50%;
    & >>> .el-form-item__content {
      width: 363px;
    }
    & >>> .el-select,
    & >>> .el-cascader {
      width: 100%;
    }
  }
}
.required {
  color: red;
  vertical-align: sub;
}
</style>
