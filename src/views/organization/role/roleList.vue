<template>
  <div class="app-container">
    <div class="shift-box">
      <div class="shift-item">
        <el-input
          v-model="listQuery.name"
          placeholder="请输入角色名称关键字查询"
          clearable
          @input="queryRole(1)"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="queryRole(1)" />
        </el-input>
      </div>
      <div class="shift-action">
        <el-button size="medium" @click="deleteRole(1)">批量删除</el-button>
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="editRole()">新增</el-button>
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
        <el-table-column label="角色名称" property="name" />
        <el-table-column label="角色描述" property="description" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="small" @click="editRole(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="deleteRole(2,scope.row.id)">删除</el-button>
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
  </div>
</template>

<script>
/**
 * @description 角色管理
 * @author xiaomeng
 */
import { queryRole, deleteRole } from '@api/organization/role'
import { queryAllResource } from '@api/organization/resource'
import { getDeletePagenum } from '@utils'

export default {
  name: 'Role',
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
        size: 10,
        name: ''
      },
      dialogStatus: 'create',
      dialogFormVisible: false,
      authFormVisible: false,
      multipleSelection: [],
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
    this.queryRole(1)
  },
  methods: {
    /**
     * @description 查询列表
     */
    queryRole(num) {
      if (num) this.listQuery.current = num
      this.listLoading = true
      queryRole(this.listQuery).then(response => {
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
      // .catch(res=>{
      //   this.list = [];
      //   this.listLoading = false;
      //   this.$message({
      //     message:res.mesg,
      //     type:'error'
      //   })
      // })
    },
    /**
     * @description 进入编辑角色
     */
    editRole(row) {
      if (row) {
        this.$router.push({ name: 'editRole', query: { id: row.id }})
      } else {
        this.$router.push({ name: 'addRole' })
      }
    },
    /**
     * @@description 修改每页显示条数
     */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.queryRole(1)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @description 跳转到指定页
     */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.queryRole()
    },
    /**
     * @description 删除角色
     */
    conformDelete(ids, type) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let num = getDeletePagenum(type, this.list, this.multipleSelection, this.listQuery.current)
        deleteRole({ ids }).then(() => {
          this.$notify({
            title: '删除成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.queryRole(num)
        })
      })
    },
    /**
     * @description 删除角色前的校验
     * @param ids
     */
    deleteRole(type, id) {
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
.shift-box {
  justify-content: space-between;
}
</style>

