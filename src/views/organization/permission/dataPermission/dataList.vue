<template>
  <div class="app-container">
    <div class="shift-box">
      <div class="shift-item">
        <el-input v-model="listQuery.name" placeholder="请搜索" clearable @change="queryUser">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="queryUser" />
        </el-input>
      </div>
      <div class="shift-action">
        <el-button size="medium" @click="deleteData(1)">批量删除</el-button>
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="addData()">新建</el-button>
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
        <el-table-column prop="name" label="权限名称" />
        <el-table-column prop="name" label="数据库 / 数据表" />
        <el-table-column prop="dataType" label="过滤条件">
          <template slot-scope="scope">{{ scope.row.dataLimit }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="small" @click="addData(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="deleteData(2,scope.row.id)">删除</el-button>
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
import { domianList, batchDeleteDomain } from '@api/organization/permission'

export default {
  name: 'DataList',
  data() {
    return {
      listQuery: {
        name: '',
        current: 1,
        size: 10
      },
      listLoading: false,
      list: [],
      total: 0,
      multipleSelection: []
    }
  },
  created() {
    this.queryUser()
  },
  methods: {
    queryUser() {
      domianList(this.listQuery).then(res => {
        const data = res.data
        this.list = data.data.records || []
        this.total = data.data.total
      })
    },
    handleChange(value) {
      this.queryUser()
    },
    addData(row) {
      if (row) {
        this.$router.push({ name: 'editData', query: { id: row.id }})
      } else {
        this.$router.push({ name: 'addData' })
      }
    },
    /**
     * 删除用户
     * @param ids
     */
    deleteData(type, id) {
      let ids = []
      if (type === 1) {
        // 批量删除
        if (this.multipleSelection.length > 0) {
          ids =
            this.multipleSelection
              .map(v => {
                return v.id
              })
              .join(',') || ''
          this.conformDelete(ids)
        } else {
          this.$message({
            type: 'warning',
            message: '请至少选择一项'
          })
        }
      } else if (type === 2) {
        this.conformDelete(id)
      }
    },
    conformDelete(ids) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDeleteDomain({ ids }).then(response => {
          const res = response.data
          if (res.code === '000000') {
            this.$notify({
              title: '删除成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.queryUser()
          } else {
            this.$notify({
              title: '删除失败',
              message: '删除失败',
              type: 'warning',
              duration: 2000
            })
          }
        })
      })
    },
    /**
     * 修改每页显示条数
     */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.queryUser()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.shift-box {
  justify-content: space-between;
}
</style>
