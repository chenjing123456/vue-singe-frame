<template>
  <div class="app-container">
    <div class="shift-box">
      <div style="display:flex">
        <div class="shift-item">
          <el-input v-model="listQuery.name" placeholder="请输入姓名关键字查询" clearable @input="queryUser(1)">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="queryUser(1)" />
          </el-input>
        </div>
        <div class="shift-item">
          <span>组织架构：</span>
          <el-cascader
            :options="groupList"
            :show-all-levels="false"
            v-model="listQuery.groupId"
            @change="handleChange"
            :props="props"
            clearable
          ></el-cascader>
        </div>
      </div>

      <div class="shift-action">
        <el-button size="medium" @click="deleteUser(1)">批量删除</el-button>
        <el-button size="medium" @click="isShowUpload = true;">批量导入</el-button>
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="addUser()">新增</el-button>
      </div>
    </div>
    <div class="app-table">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column label="用户名" property="username" />
        <el-table-column label="姓名" property="name" />
        <el-table-column label="昵称" property="nickName" />
        <el-table-column label="角色" property="roleText" />
        <el-table-column label="手机号" property="mobile" />
        <el-table-column label="行政单位" property="administrationText" />
        <el-table-column label="部门" property="departmentText" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="small" @click="addUser(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="deleteUser(2,scope.row.id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--翻页工具条-->
      <div class="pagination-container">
        <el-pagination
          background
          :current-page="listQuery.current"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="listQuery.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <el-drawer
      :visible.sync="isShowUpload"
      :close-on-press-escape="false"
      :wrapperClosable="false"
      custom-class="group_drawer"
      :with-header="false"
    >
      <header class="drawer_header">
        <div class="flxc">
          <svg-icon icon-class="icongongnengmokuai" style="font-size:20px;margin-right:5px;" />
          <span>批量导入</span>
        </div>
        <i class="el-icon-close" @click="isShowUpload = false;"></i>
      </header>
      <article class="drawer_main">
        <div class="drawer_upload">
          <div class="drawer_head">上传数据</div>
          <el-upload
            class="upload-demo"
            ref="upload"
            drag
            :show-file-list="false"
            :limit="1"
            :file-list="fileList"
            :http-request="httpRequest"
            action="#"
            accept=".xls, .xlsx"
          >
            <div class="preview">
              <div
                class="fail_icon"
                v-if="uploadStatus == 'fail'&&isShowText"
                @click.stop="shuan()"
              >
                <i class="el-icon-circle-close"></i>
                <span>上传失败</span>
              </div>
              <i
                :class="['iconfont', 'iconyulan',isPreview?'isPreview':'']"
                @click.stop="previewOnHtml"
              ></i>
            </div>
            <div v-if="uploadStatus == 'wait'" class="wait">
              <i class="iconfont iconshangchuanwenjian" />
              <div class="el-upload__text">
                <span class="status_cen">将文件拖拽至此</span>
                <div class="status">
                  或
                  <span style="color:#0091FF">点击上传</span>
                </div>
              </div>
            </div>
            <div v-if="uploadStatus == 'success'" class="success">
              <i class="iconfont iconexcelbiaodan" />
              <div class="el-upload__text">
                <span class="status_cen">{{fileName}}</span>
                <div class="status">
                  <span style="color:#0091FF">重新上传</span>
                </div>
              </div>
            </div>
            <div v-if="uploadStatus == 'uploading'">
              <i class="iconfont iconexcelbiaodan" />
              <div class="el-upload__text">
                <el-progress class="progress" :show-text="false" :percentage="progressPercent"></el-progress>
                <div class="status">
                  <span>正在上传...</span>
                </div>
              </div>
            </div>
            <div v-if="uploadStatus == 'fail'" class="fail">
              <i class="iconfont iconexcelbiaodan fail_icon" />
              <div class="el-upload__text">
                <span class="status_cen">{{fileName}}</span>
                <div class="status">
                  <span style="color:#0091FF">重新上传</span>
                </div>
              </div>
            </div>
            <div class="el-upload__tip" slot="tip">
              <ul>
                <li>支持 2MB 以内的 xls、xlsx 格式文件</li>
                <li>文件中数据能超过 10000 行</li>
                <li>默认识别 excel 文件的第一个sheet</li>
              </ul>
            </div>
          </el-upload>
          <span>如何填写规范的表格？</span>
          <div class="download">
            <i class="iconfont iconxiazai"></i>
            <span @click="downUserModel()">下载模板</span>
          </div>
        </div>
      </article>
    </el-drawer>
  </div>
</template>

<script>
/**
 * @description 用户管理列表
 * @author xiaomeng
 */
import {
  queryUser,
  deleteUser,
  downUserModel,
  userUpload,
  previewOnHtml
} from '@api/organization/user'
import { getList } from '@api/organization/group'
import { getToken, getDeletePagenum } from '@utils'

export default {
  name: 'UserList',
  data() {
    return {
      isShowUpload: false,
      list: [],
      fileList: [],
      fileName: '', // 文件名
      uploadStatus: 'wait',
      isPreview: false,
      total: 0,
      isShowText: true,
      listLoading: true,
      fileId: '', // 预览id
      props: {
        value: 'id',
        label: 'name',
        checkStrictly: true,
        children: 'sonList'
      },
      token: getToken(),
      listQuery: {
        current: 1,
        size: 10,
        name: '',
        groupId: []
      },
      downUserModel,
      progressPercent: 0,
      multipleSelection: [],
      groupList: [],
      jobnumberKey: +new Date()
    }
  },
  created() {
    this.getList()
    this.queryUser(1)
  },
  methods: {
    handleChange(value) {
      this.queryUser(1)
    },
    /**
     * @description 强制刷新
    */
    shuan() {
      this.isShowText = false
      this.jobnumberKey = +new Date()
    },
    /**
     * @description 预览（暂不可用）
    */
    previewOnHtml() {
      // 预览
      if (!this.fileId) {
        this.$message({
          type: 'warning',
          message: '无可预览文件请上传'
        })
        return
      }
      // previewOnHtml({fileId:this.fileId }).then(res=>{
      //   console.log(res);
      // })
      window.location.href =
        process.env.VUE_APP_BASE_API +
        '/organization/user/previewOnHtml?fileId=' +
        this.fileId
    },
    /**
     * @description 批量导入
     * param是自带参数。 this.$refs.upload.submit() 会自动调用 httpRequest方法.在里面取得file
    */
    httpRequest(file) {
      const that = this
      that.uploadStatus = 'uploading' // 上传中
      const fd = new FormData()
      const fileObj = file.file
      fd.append('file', fileObj)
      that.fileName = file.file.name
      const config = {
        headers: { Authorization: that.token },
        onUploadProgress: progressEvent => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          this.progressPercent = Number(
            ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2)
          )
        }
      }
      userUpload(fd, config)
        .then(res => {
          // debugger;
          if (res.code === '000000') {
            that.uploadStatus = 'success'
            that.fileId = res.data
            that.fileList = []
            that.queryUser()
            that.isPreview = true
          } else {
            that.uploadStatus = 'fail'
            that.fileList = []
            that.isPreview = false
            that.isShowText = true
          }
        })
        .catch(res => {
          that.uploadStatus = 'fail'
          that.fileList = []
          that.isPreview = false
          that.isShowText = true
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
     * @description 查询列表
     */
    queryUser(num) {
      if (num) this.listQuery.current = num
      this.listLoading = true
      let groupId = this.listQuery.groupId
      if (groupId && groupId.length > 0) {
        groupId = groupId[groupId.length - 1]
      } else {
        groupId = ''
      }
      queryUser({ ...this.listQuery, groupId }).then(response => {
        const res = response.data
        if (res.code == '000000') {
          this.list = res.data.records
          this.total = res.data.total
        } else {
          this.$message({
            message: res.mesg,
            type: 'error'
          })
        }
        this.listLoading = false
      })
    },
    /**
     * @description 进入编辑页面
    */
    addUser(row) {
      if (row) {
        this.$router.push({ name: 'editUser', query: { id: row.id }})
      } else {
        this.$router.push({ name: 'addUser' })
      }
    },
    /**
     * 修改每页显示条数
     */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.queryUser(1)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * 跳转到指定页
     */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.queryUser()
    },
    conformDelete(ids, type) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let num = getDeletePagenum(type, this.list, this.multipleSelection, this.listQuery.current)
        deleteUser({ ids }).then(() => {
          this.$notify({
            title: '删除成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.queryUser(num)
        })
      })
    },
    /**
     * @description 删除用户
     * @param {String} ids 删除的id拼接字符串
     */
    deleteUser(type, id) {
      let ids = []
      if (type === 1) {
        // 批量删除
        if (this.multipleSelection.length > 0) {
          ids = this.multipleSelection.map(v => {
            return v.id
          })
          this.conformDelete(ids, type)
        } else {
          this.$message({
            type: 'warning',
            message: '请至少选择一项'
          })
        }
      } else if (type === 2) {
        ids = [id]
        this.conformDelete(ids, type)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@styles/index.scss";
.shift-box {
  justify-content: space-between;
}
.drawer_upload {
  & >>> .el-upload-dragger {
    padding: 5px;
  }
}
</style>

