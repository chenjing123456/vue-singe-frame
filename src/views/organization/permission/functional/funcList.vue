<template>
  <div class="app-container">
    <div class="shift-box">
      <div class="shift-item">
        <el-input v-model="listQuery.name" placeholder="请搜索" clearable @change="queryMenu">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="queryMenu" />
        </el-input>
      </div>
      <div class="shift-action">
        <el-button size="medium">批量删除</el-button>
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="editMenu">新建</el-button>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      class="app-table"
      :data="list"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column label="功能模块" property="name" />
      <el-table-column label="ID" property="description" />
      <el-table-column label="跳转 URL" property="description" />
      <el-table-column label="可操作权限" width="300">
        <template slot-scope="scope">
          <div class="act-btns">
            <span v-for="(item,index) in scope.row.list" :key="index" class="btn-item">{{ item.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <el-button type="text" size="small" @click="editMenu(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteRole(scope.row)">删除</el-button>
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
</template>

<script>
import { queryMenu } from '@api/organization/permission'
import { queryAllResource } from '@api/organization/resource'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'RoleManagement',
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        deleted: 'info',
        ok: 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10
        // name: ''
      },
      dialogStatus: 'create',
      dialogFormVisible: false,
      authFormVisible: false,
      multipleSelection: [],
      rules: {
        code: [{ required: true, message: '角色代码必填', trigger: 'blur' }],
        name: [{ required: true, message: '角色名必填', trigger: 'blur' }]
      },
      checkAll: false,
      resources: [],
      isIndeterminate: true,
      temp: {
        code: '',
        name: '',
        description: '',
        resourceIds: []
      },
      downloadLoading: false
    }
  },
  created() {
    this.queryMenu()
  },
  methods: {
    /**
     * 查询列表
     */
    queryMenu() {
      this.listLoading = true
      queryMenu(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      }).catch(res => {
        this.listLoading = false
        this.list = []
        this.$message.error(res.error)
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.queryMenu()
    },
    editMenu(row) {
      if (row) {
        this.$router.push({ name: 'addFunc', query: { id: row.id }})
      } else {
        this.$router.push({ name: 'addFunc' })
      }
    },
    /**
     * 修改每页显示条数
     */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.queryMenu()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * 跳转到指定页
     */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.queryRole()
    },
    /**
     * 新增角色
     */
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createRole(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '创建成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.queryRole()
          })
        }
      })
    },
    /**
     * 点击授权按钮
     */
    handleAuth(id) {
      this.temp.id = id
      this.temp.resourceIds = []
      // 查询所有资源
      queryAllResource().then(response => {
        this.resources = response.data
        this.authFormVisible = true
      })
      // 查询角色详细信息，拿到已授权的角色id
      getRole(id).then(response => {
        this.temp.resourceIds = response.data.resourceIds
        this.handleCheckedChange(this.temp.resourceIds)
      })
    },
    /**
     * 全选权限选项
     */
    handleCheckAllChange(val) {
      const ids = []
      for (let i = 0; i < this.resources.length; i++) {
        ids.push(this.resources[i].id)
      }
      this.temp.resourceIds = val ? ids : []
      this.isIndeterminate = false
    },
    /**
     * 选中选项
     */
    handleCheckedChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.resources.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.resources.length
    },
    /**
     * 点击更新按钮
     */
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 更新角色
     */
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateRole(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '编辑成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            this.queryRole()
          })
        }
      })
    },
    /**
     * 删除角色
     * @param id
     */
    deleteRole(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(id).then(() => {
          this.$notify({
            title: '删除成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.queryRole()
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.shift-box {
  justify-content: space-between;
}
.act-btns {
  display: flex;
  flex-wrap: wrap;
  .btn-item {
    width: 45px;
    height: 23px;
    line-height: 23px;
    text-align: center;
    border-radius: 2px;
    background-color: rgba(247, 248, 249, 1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.5);
    margin-right: 15px;
  }
}
</style>

