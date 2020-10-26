<template>
  <div id="info">
    <div class="person_header">
      <svg-icon icon-class='person'></svg-icon>
      <span class="tit">个人基本信息</span>
    </div>
    <div class="person_content">
      <el-form ref="form" class="info-form" :model="userInfo" label-width="0">
        <div class="forml-item" style="display:flex;align-items:center;">
          <div>用户名：</div>
          <div>{{userInfo.username}}</div>
        </div>
        <div class="forml-item">
          <div class="label">姓名</div>
          <el-form-item prop="name">
            <el-input v-model="userInfo.name" type="text" placeholder="请输入姓名" />
          </el-form-item>
        </div>
        <div class="forml-item">
          <div class="label">昵称</div>
          <el-form-item prop="nickName">
            <el-input v-model="userInfo.nickName" type="text" placeholder="请输入昵称" />
          </el-form-item>
        </div>
        <div class="forml-item">
          <div class="label">角色</div>
          <el-form-item prop="roleText">
            <el-input disabled v-model="userInfo.roleText" type="text" placeholder="请输入角色" />
          </el-form-item>
        </div>
        <div class="forml-item">
          <div class="label">行政单位</div>
          <el-form-item prop="administrationText">
            <el-input disabled v-model="userInfo.administrationText" placeholder="请输入行政单位" />
          </el-form-item>
        </div>
        <div class="forml-item">
          <div class="label">部门</div>
          <el-form-item prop="departmentText">
            <el-input disabled v-model="userInfo.departmentText" placeholder="请输入部门" />
          </el-form-item>
        </div>
      </el-form>
      <div class="info-img">
        <el-avatar
          :size="56"
          :src="userInfo.avar"
        ></el-avatar>
        <el-upload
          class="avatar-uploader"
          :on-preview="handlePreview"
          :limit="1"
          :show-file-list="false"
          :http-request="httpRequest"
          action="#"
          accept=".jpg, .png, .jpeg"
        >
          <el-button size="small" type="primary">更换头像</el-button>
        </el-upload>
      </div>
    </div>
    <div class="person_footer">
      <el-button size="small" @click="closeForm('ruleForm')">取消</el-button>
      <el-button size="small" type="primary" @click="submitForm('ruleForm')">提交</el-button>
    </div>
  </div>
</template>
<script>
/**
 * @description 个人信息
 * @author xiaomeng
 */
import {
  uploadHeaderLogo,
  changeBasicInfo
} from '@api/organization/person'
export default {
  name: 'Info',
  data() {
    return {

    }
  },
  props: ['userInfo'],
  mounted() {

  },
  methods: {
    closeForm() {},
    submitForm() {
      changeBasicInfo(this.userInfo).then(res => {
        if (res.code == '000000') {
          this.$store.dispatch('user/getInfo')
        }
      })
    },
    handlePreview(file) {
      console.log(file)
    },
    httpRequest(file) {
      const that = this
      const fd = new FormData()
      const fileObj = file.file
      fd.append('file', fileObj)
      uploadHeaderLogo(fd).then(res => {
        if (res.code === '000000') {
          that.userInfo.avar = res.data
        } else {
          that.$message({ type: 'error', message: res.data })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.forml-item {
  height: 80px;
  .label {
    margin-bottom: 10px;
  }
}
.person_content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .info-form {
    width: 342px;
  }
  .info-img {
    width: 100px;
    padding-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    & >>> .avatar-uploader {
      margin-top: 15px;
    }
  }
}
.person_footer {
  display: flex;
  justify-content: center;
  margin-top: 70px;
}
</style>
