<template>
  <div class="app-container">
    <div class="shift-box">
      <div class="shift-item">
        <el-input v-model="listQuery.name" placeholder="请输入用户名称关键字查询" clearable @input="queryRole(1)">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="queryRole(1)" />
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
      <div class="shift-item">
        <span>操作时间：</span>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="queryRole(1)"
        ></el-date-picker>
      </div>
    </div>
    <div class="app-table">
      <el-table ref="multipleTable" v-loading="listLoading" :data="list" style="width: 100%">
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column label="用户名称" property="userName" />
        <el-table-column label="IP" property="ipAddress" />
        <el-table-column label="操作时间" property="happenedTime" />
        <el-table-column label="登录地" property="address" />
        <el-table-column label="页面" property="requestPage" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="status">
              <cricle-diff :mainColor="scope.row.content=='登录'?'#1890FF':'#FA541C'"></cricle-diff>
              <span>{{scope.row.content}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="异常说明" property="errorContent">
          <template slot-scope="scope">
            <span>{{scope.row.errorContent||'-'}}</span>
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
 * @description 日志管理
 * @author xiaomeng
*/
import { getList } from '@api/organization/group'
import { search } from '@api/organization/log'
import cricleDiff from '@/components/cricleDiff'
export default {
  name: 'Log',

  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      groupList: [],
      date: [],
      listQuery: {
        current: 1,
        size: 10,
        name: '',
        groupId: []
      },
      props: {
        value: 'id',
        label: 'name',
        checkStrictly: true,
        children: 'sonList'
      }
    }
  },
  created() {
    this.getList()
    this.queryRole(1)
  },
  components: {
    cricleDiff
  },
  methods: {
    handleChange(value) {
      this.queryRole(1)
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
    queryRole(num) {
      if (num === 1) this.listQuery.current = 1
      this.listLoading = true
      let createdTimeStart = ''
      let createdTimeEnd = ''
      // console.log(this.date)

      if (this.date && this.date.length > 0) {
        createdTimeStart = this.date[0]
        createdTimeEnd = this.date[1]
      }
      const ids = this.listQuery.groupId
      const groupId = ids && ids.length > 0 ? ids[ids.length - 1] : ''
      search({ ...this.listQuery, createdTimeStart, createdTimeEnd, groupId }).then(
        response => {
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
        }
      )
    },
    /**
     * @description 修改每页显示条数
     */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.queryRole(1)
    },
    /**
     * @description 跳转到指定页
     */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.queryRole()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@styles/variables.scss";
.shift-box {
  // justify-content: space-between;
  .shift-item {
    min-width: 0;
    & >>> .el-range-separator{
      width: 7%;
    }
  }
  & >>> .el-cascader {
    .el-input {
      width: 210px;
    }
  }
}
.status {
  display: flex;
  align-items: center;
}
</style>
