<template>
  <div class="app-card">
    <div class="card-item">
      <div class="card-head">人员列表</div>
      <div class="card-permission">
        <div class="card-center">
          <div class="func-lf">
            <div class="lf-top topCom">
              <div class="flxc">
                <svg-icon icon-class="structure" style="font-size:22px;margin-right:10px;" />
                <span>组织架构</span>
              </div>
              <div>
                <el-popover
                  placement="bottom"
                  width="173"
                  height="105"
                  trigger="click"
                  popper-class="menu-popper"
                >
                  <div class="node-act">
                    <div
                      @click="addType = 'high',reset(),groupItem.parentId = [0],groupItem.name = '自定义节点',isShowProp = true"
                    >
                      <i class="el-icon-circle-plus-outline" />
                      <span>添加下级组织</span>
                    </div>
                  </div>
                  <i slot="reference" class="el-icon-circle-plus-outline add-icon" />
                </el-popover>
              </div>
            </div>
            <div class="lf-bottom">
              <el-tree
                :data="list"
                :props="defaultProps"
                accordion
                :highlight-current="true"
                @node-click="(node,n,v)=>{clickNode(node,1)}"
                class="menu-tree"
              >
                <div slot-scope="{ node, data }" class="custom-tree-node">
                  <span>{{ node.label }}</span>
                  <div>
                    <el-popover
                      placement="bottom"
                      width="174"
                      height="105"
                      trigger="hover"
                      popper-class="menu-popper"
                    >
                      <div class="node-act">
                        <div @click.stop="()=>addDefaultMenu(data,1)">
                          <i class="el-icon-circle-plus-outline" />
                          <span>添加下级组织</span>
                        </div>
                        <div @click.stop="()=>addDefaultMenu(data,2)">
                          <i class="el-icon-edit" />
                          <span>编辑</span>
                        </div>
                        <div @click.stop="() => deleteGroup(data)">
                          <i class="el-icon-delete" />
                          <span>删除</span>
                        </div>
                      </div>
                      <i slot="reference" class="iconfont iconduogongneng" />
                    </el-popover>
                  </div>
                </div>
              </el-tree>
            </div>
          </div>
          <div class="func-rl">
            <div class="rl-top topCom">
              <span>用户管理</span>
              <div>
                <el-button size="small" @click="jusity()">调整部门</el-button>
                <el-button size="small" @click="deleteUserGroup">批量删除</el-button>
                <el-button size="small" type="primary" @click="queryUser(),userVisible = true">添加成员</el-button>
              </div>
            </div>
            <div class="rl-bottom">
              <el-table
                ref="multipleTable"
                v-loading="listLoading"
                class="app-table"
                :data="tableList"
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" />
                <el-table-column label="姓名" property="name" />
                <el-table-column label="职位" property="position" />
                <el-table-column label="手机号" property="mobile" />
                <el-table-column label="邮箱" property="mail" />
                <el-table-column label="排序">
                  <template slot-scope="scope">
                    <div>
                      <el-tooltip class="item" effect="dark" content="上移" placement="top">
                        <span @click="sortGroupUser(scope.row.id,'up')">上移</span>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="下移" placement="top">
                        <span @click="sortGroupUser(scope.row.id,'down')">下移</span>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="置顶" placement="top">
                        <span @click="sortGroupUser(scope.row.id,'top')">置顶</span>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <!--翻页工具条-->
              <div class="pagination-container">
                <el-pagination
                  background
                  :current-page="listQuery.current"
                  :page-sizes="[5, 10, 15, 20]"
                  :page-size="listQuery.size"
                  layout="total,  prev, pager, next, jumper"
                  :total="total"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-dialog :visible.sync="departVisible" width="580px" class="groupDialog">
        <span slot="title">
          <svg-icon icon-class="icontiaozhengbumen"></svg-icon>
          <span>调整部门</span>
        </span>
        <div class="content">
          <div class="content_item">
            <span class="subtitle">已选用户</span>
            <div class="user_box">
              <span class="user_item" v-for="(item,index) in multipleSelection" :key="index">
                <el-avatar icon="el-icon-user-solid" :size="20"></el-avatar>
                <span>{{item.name}}</span>
              </span>
            </div>
          </div>
          <div class="content_item">
            <span class="subtitle">部门调整</span>
            <el-cascader
              :options="list"
              v-model="deparment"
              :show-all-levels="false"
              :props="{...defaultProps,checkStrictly: true}"
              clearable
            ></el-cascader>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="departVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserBatchValiate(1)">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="userVisible"
        width="580px"
        class="groupDialog"
        @close="userVisible = false,name=''"
      >
        <span slot="title">
          <svg-icon icon-class="icontianjiachengyuan"></svg-icon>
          <span>添加成员</span>
        </span>
        <div class="user_content">
          <header class="user_header">
            <span>部门成员</span>
            <el-input v-model="name" placeholder="请输入姓名" clearable @input="queryUser"></el-input>
          </header>
          <article class="user_list">
            <el-checkbox
              class="checkedAll"
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >姓名</el-checkbox>
            <el-checkbox-group v-model="checkedUsers" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="item in userList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </article>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="userVisible = false,name=''">取 消</el-button>
          <el-button type="primary" @click="addUserBatchValiate(2)">确 定</el-button>
        </span>
      </el-dialog>
      <el-drawer
        :visible.sync="isShowProp"
        :close-on-press-escape="false"
        :wrapperClosable="false"
        custom-class="group_drawer"
        :with-header="false"
      >
        <header class="drawer_header">
          <div class="flxc">
            <svg-icon icon-class="iconshuxing" style="font-size:20px;margin-right:5px;" />
            <span>属性</span>
          </div>
          <i class="el-icon-close" @click="isShowProp = false;"></i>
        </header>
        <article class="drawer_main">
          <div class="prop_item">
            <div class="sub_title">节点</div>
            <div class="sub_prop">
              <el-form ref="form" :model="groupItem" label-width="0" :rules="rules">
                <div class="forml-item">
                  <div class="label">
                    名称
                    <span class="required">*</span>
                  </div>
                  <el-form-item prop="name">
                    <el-input
                      v-model="groupItem.name"
                      type="text"
                      maxlength="10"
                      placeholder="请输入名称"
                      show-word-limit
                    />
                  </el-form-item>
                </div>
                <div class="forml-item">
                  <div class="label">上级节点</div>
                  <el-form-item prop="parentId" class="parentId">
                    <el-cascader
                      disabled
                      :options="[{name:'root',id:0},...list]"
                      v-model="groupItem.parentId"
                      :show-all-levels="false"
                      :props="{...defaultProps,checkStrictly: true}"
                    ></el-cascader>
                  </el-form-item>
                </div>
                <div class="forml-item">
                  <div class="label">节点类型</div>
                  <el-form-item prop="type">
                    <el-select v-model="groupItem.type" placeholder="请选择">
                      <el-option
                        v-for="item in nodeType"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="forml-item">
                  <div class="label">行政代码</div>
                  <el-form-item prop="areaCode">
                    <el-cascader
                      v-model="groupItem.areaCode"
                      :show-all-levels="false"
                      :props="addProps"
                      clearable
                    >
                      <template slot-scope="{ node, data }">
                        <span>{{ data.name }}</span>
                      </template>
                    </el-cascader>
                  </el-form-item>
                </div>
                <div class="forml-item">
                  <div class="label">部门主管</div>
                  <el-form-item prop="managerId">
                    <el-select
                      v-model="groupItem.managerId"
                      placeholder="请选择"
                      style="width: 300px;"
                    >
                      <el-option
                        v-for="item in departUserList"
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
          <div class="prop_item">
            <div class="sub_title">权限</div>
            <div class="sub_prop">
              <el-form ref="form" :model="groupItem" label-width="0" :rules="rules">
                <div class="forml-item">
                  <el-form-item>
                    <div class="switch">
                      <span>关联数据权限</span>
                      <el-switch v-model="isDomain"></el-switch>
                    </div>
                  </el-form-item>
                </div>
                <div class="forml-item" v-if="isDomain">
                  <div class="label">选择权限</div>
                  <el-form-item>
                    <el-select
                      v-model="groupItem.domainIds"
                      multiple
                      placeholder="请选择"
                      style="width: 300px;"
                    >
                      <el-option
                        v-for="item in dataOptions"
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
          <div class="submit">
            <el-button size="small" @click="reset(),isShowProp = false">取消</el-button>
            <el-button type="primary" size="small" @click="submitUser('form')">确定</el-button>
          </div>
        </article>
      </el-drawer>
    </div>
  </div>
</template>

<script>
/**
 * @description 组织架构
 * @author xiaomeng
 */
import { queryUser } from '@api/organization/user'
import { notEmpty, maxLength, betweenLength, getDeletePagenum } from '@utils'
import {
  getList,
  listArea,
  findUserByGroupId,
  sortGroupUser,
  findById,
  addUserBatch,
  deleteGroup,
  deleteUserGroup,
  updateGroup,
  addGroup,
  queryRegions
} from '@api/organization/group'
import { nodeType } from '@constant'
import { getDomianList } from '@api/organization/role'
export default {
  name: 'AddRole',
  data() {
    let that = this
    return {
      tableList: [],
      departUserList: [],
      addType: '',
      nodeType,
      name: '', // 成员搜索参数name
      deparment: [],
      dataOptions: [], // 数据权限列表
      list: [],
      listLoading: false,
      checkedUsers: [], // 选中部门成员
      checkAll: false,
      isIndeterminate: false,
      total: 0,
      listQuery: {
        current: 1,
        size: 5
      },
      departVisible: false,
      userVisible: false,
      isDomain: false,
      isShowProp: false, // 属性-抽屉框
      defaultProps: {
        children: 'sonList',
        label: 'name',
        value: 'id'
      },
      userList: [],
      currentNode: '', // 当前选中的架构组id
      id: '', // 菜单id
      groupItem: {
        name: '',
        areaCode: [],
        managerId: '',
        parentId: [],
        domainIds: [],
        type: ''
      },
      // areaList: [], // 行政区域
      fatherGroups: [],
      multipleSelection: [],
      rules: {
        name: [notEmpty('名称')]
      },
      addProps: {
        lazy: true,
        value: 'code',
        children: 'childList',
        // emitPath: false,
        checkStrictly: true,
        label: 'code',
        lazyLoad(node, resolve) {
          const { level } = node
          if (level === 0) {
            // 一级
            that.queryRegions(0, resolve)
          } else {
            that.queryRegions(node, resolve)
          }
        }
      }
    }
  },
  created() {
    this.getList()
    this.getDomianList()
  },
  watch: {
    addType(n, o) {
      // console.log(n)
      if (n == 'low') {
        this.departUserList = this.tableList
      } else {
        this.departUserList = []
      }
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCheckAllChange(val) {
      this.checkedUsers = val
        ? this.userList.map(v => {
          return v.id
        })
        : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.userList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.userList.length
    },
    // 获取行政代码
    // listArea() {
    //   listArea().then(response => {
    //     const res = response.data
    //     if (res.code == '000000') {
    //       this.areaList = res.data || []
    //     } else {
    //       this.areaList = []
    //       this.$message({
    //         message: res.mesg,
    //         type: 'error'
    //       })
    //     }
    //   })
    // },
    /**
     * @description 动态加载行政代码
     */
    queryRegions(node, resolve) {
      let parentCode = node ? node.data.code : 0
      queryRegions({ parentCode }).then(res => {
        let { code, data } = res.data
        if (code == '000000' && data) {
          resolve(data)
        } else {
          resolve([])
        }
      })
    },
    /**
     * @description 获取用户成员
     */
    queryUser() {
      const con = {
        current: 1,
        size: 100,
        name: this.name,
        groupId: ''
      }
      queryUser(con).then(response => {
        const res = response.data
        if (res.code == '000000') {
          this.userList = res.data.records || []
        } else {
          this.userList = []
          this.$message({
            message: res.mesg,
            type: 'error'
          })
        }
      })
    },
    reset() {
      this.groupItem = {
        name: '',
        areaCode: [],
        managerId: '',
        parentId: [],
        domainIds: [],
        type: ''
      }
    },
    /**
     * @description  排序
     * */
    sortGroupUser(userId, type) {
      sortGroupUser({ userId, type, groupId: this.currentNode }).then(
        response => {
          const res = response.data
          if (res.code == '000000') {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.clickNode({ id: this.currentNode })
          } else {
            this.$message({
              message: res.mesg,
              type: 'error'
            })
          }
        }
      )
    },
    /**
     * @description 批量删除用户
     */
    deleteUserGroup() {
      const arr = this.multipleSelection
      if (arr.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的用户'
        })
      } else {
        const ids = arr
          .map(v => {
            return v.id
          })
          .join(',')
        let num = getDeletePagenum(
          1,
          this.tableList,
          this.multipleSelection,
          this.listQuery.current
        )
        deleteUserGroup({ ids, groupId: this.currentNode }).then(response => {
          const res = response.data
          if (res.code == '000000') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.clickNode({ id: this.currentNode }, num)
          } else {
            this.$message({
              message: res.mesg,
              type: 'error'
            })
          }
        })
      }
    },
    /**
     * 跳转到指定页
     */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.clickNode({ id: this.currentNode })
    },
    /**
     * @description 调整部门
     */
    jusity() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择要调整的用户'
        })
        return
      } else {
        this.departVisible = true
      }
    },
    /**
     * @description 批量添加用户 ， 调整部门的验证
     * */
    addUserBatchValiate(type) {
      if (type === 1) {
        // 调整部门
        if (this.deparment.length <= 0) {
          this.$message({
            type: 'warning',
            message: '请选择调整部门'
          })
          return
        } else if (this.multipleSelection.length <= 0) {
          this.$message({
            type: 'warning',
            message: '请选择要调整的用户'
          })
          return
        }
        this.addUserBatch(type)
      } else {
        // 添加用户
        if (this.checkedUsers.length <= 0) {
          this.$message({
            type: 'warning',
            message: '请选择要添加的用户'
          })
          return
        }
        this.addUserBatch(type)
      }
    },
    /**
     * @description 批量添加用户 ， 调整部门
     * */
    addUserBatch(type) {
      const that = this
      let userIds = ''
      let groupId = ''
      if (type === 1) {
        // 调整部门
        const d = this.deparment
        userIds =
          this.multipleSelection.length > 0
            ? this.multipleSelection
              .map(v => {
                return v.id
              })
              .join(',')
            : ''
        groupId = d[d.length - 1]
      } else {
        userIds =
          this.checkedUsers.length > 0 ? this.checkedUsers.join(',') : ''
        groupId = this.currentNode
      }
      addUserBatch({
        userIds,
        groupId
      }).then(response => {
        const res = response.data
        if (res.code == '000000') {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          if (type === 2) {
            that.checkedUsers = []
            that.name = ''
            that.isIndeterminate = false
            that.userVisible = false
          } else {
            that.deparment = []
            that.departVisible = false
          }
          this.clickNode({ id: this.currentNode })
        } else {
          this.$message({
            message: res.mesg,
            type: 'error'
          })
        }
      })
    },
    /**
     * @description 获取数据权限
     * */
    getDomianList() {
      getDomianList().then(response => {
        const that = this
        const res = response.data
        if (res.code == '000000') {
          that.dataOptions = res.data || []
        } else {
          this.$message({
            message: response.mesg,
            type: 'error'
          })
        }
      })
    },
    /**
     * @description 点击菜单 获取菜单详情
     */
    clickNode(node, num) {
      this.listLoading = true
      if (node) this.currentNode = node.id
      this.addType = ''
      if (num) this.listQuery.current = num
      findUserByGroupId({
        groupId: this.currentNode,
        page: this.listQuery
      }).then(response => {
        const res = response.data
        if (res.code == '000000') {
          this.tableList = res.data.records || []
          this.total = res.data.total
          this.listLoading = false
        } else {
          this.tableList = []
          this.listLoading = false
          this.$message({
            message: res.mesg,
            type: 'error'
          })
        }
      })
    },
    /**
     * @description 找到当前行政区域代码的父级
     */
    findParentAreaCode(areaCode) {
      let arr = []
      if (!areaCode) return arr
      const first = areaCode.slice(2, 6)
      const second = areaCode.slice(4, 6)
      if (first == '0000') {
        // 一级
        arr = [areaCode]
      } else if (second == '00') {
        // 二级
        const one = areaCode.slice(0, 2) + '0000'
        arr = [one, areaCode]
      } else {
        // 三级
        const one = areaCode.slice(0, 2) + '0000'
        const two = areaCode.slice(0, 4) + '00'
        arr = [one, two, areaCode]
      }
      return arr
    },
    /**
     * @description 获取组织架构详情
     */
    async findById(id) {
      const that = this
      await new Promise(resolve => {
        findById({ id }).then(response => {
          const res = response.data
          if (res.code == '000000') {
            const data = res.data
            let { id, name, areaCode, managerId, type, domainIds, areaCodeTotal } = data
            // areaCode = that.findParentAreaCode(areaCode)
            if (domainIds && domainIds.length > 0) {
              that.isDomain = true
            } else {
              that.isDomain = false
              domainIds = []
            }
            that.groupItem = {
              ...that.groupItem,
              name,
              areaCode: areaCodeTotal ? areaCodeTotal.split(',') : [],
              managerId,
              type,
              id,
              domainIds
            }
            // console.log(that.groupItem)
            that.fatherGroups = data.fatherGroups || []
            resolve(true)
          } else {
            this.$message({
              message: response.mesg,
              type: 'error'
            })
          }
        })
      })
    },
    /**
     * @description 新增或者编辑按钮
     */
    addDefaultMenu(node, type) {
      this.addType = 'low'
      this.findById(node.id).then(res => {
        this.setDefaultParent(type, node.id)
      })
    },
    /**
     * @description 设置右侧数据的默认下级菜单
     */
    setDefaultParent(type, id) {
      // 0表示根组织架构
      let groupId = [...this.fatherGroups]
      if (groupId && groupId.length > 0) {
        groupId = groupId.map(v => {
          return v.id
        })
      } else {
        groupId = [0]
      }
      if (type === 1) {
        // 下级功能模块
        this.reset()
        groupId.length === 1 && groupId[0] === 0
          ? (groupId = [id])
          : groupId.push(id)
        this.groupItem.name = '自定义节点'
      }
      this.groupItem.parentId = groupId
      this.isShowProp = true
    },
    submitUser(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addGroup()
        } else {
          return false
        }
      })
    },
    /**
     * @description 添加或者编辑组织架构
     */
    addGroup() {
      let api = addGroup
      let { parentId, areaCode, id } = this.groupItem
      if (id) api = updateGroup
      parentId =
        parentId && parentId.length > 0 ? parentId[parentId.length - 1] : 0
      areaCode = areaCode && areaCode.length > 0 ? areaCode[areaCode.length - 1] : ''
      const con = { ...this.groupItem, parentId, areaCode }
      api(con).then(response => {
        const that = this
        const { data } = response
        if (data.code == '000000') {
          this.isShowProp = false
          this.getList()
          this.tableList = []
          this.$message({
            message: data.mesg,
            type: 'success'
          })
        } else {
          this.$message({
            message: data.mesg,
            type: 'error'
          })
        }
      })
    },
    /**
     * @description 删除组织架构
     */
    deleteGroup(data) {
      this.$confirm('删除这些页面将会删除它们的子级页面。是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGroup({ id: data.id }).then(response => {
          const res = response.data
          if (res.code == '000000') {
            this.getList()
            this.$message({
              message: res.mesg,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.mesg,
              type: 'error'
            })
          }
        })
      })
    },
    /**
     * @description 获取全部组织架构
     */
    getList() {
      getList({ id: 0 }).then(response => {
        const res = response.data
        if (res.code == '000000') {
          this.list = res.data || []
        } else {
          this.list = []
          this.$message({
            message: res.mesg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@styles/variables.scss";
@import "~@styles/index.scss";
.app-card {
  flex: 1;
  .card-item {
    height: 100%;
  }
}
.group_drawer .drawer_main {
  height: calc(100vh - 80px);
  overflow-y: auto;
  @include bottomCom;
}
.topCom {
  min-height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.required {
  color: red;
  vertical-align: sub;
}

.card-permission {
  height: calc(100% - 44px);
  padding: 12px 24px 32px;
  .card-center {
    width: 100%;
    display: flex;
    height: 100%;
    border: 1px solid $color1;
  }
  .func-lf {
    width: 372px;
    height: 100%;
    border-right: 1px solid $color1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .lf-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
      .el-icon-sort {
        margin-right: 20px;
        cursor: pointer;
      }
      .active {
        color: #0091ff;
      }
      .iconshezhi {
        color: rgba(0, 0, 0, 0.5);
        font-size: 19px;
        margin-right: 5px;
      }
    }
    .lf-bottom {
      padding: 0 15px;
      @include bottomCom;
    }
  }
  .func-rl {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .rl-top {
      background: #f7f8f9;
      color: $color85;
      opacity: 0.65;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
    }
    .rl-bottom {
      @include bottomCom;
      padding: 0 24px 80px;
    }
  }
}

.flxc {
  display: flex;
  justify-content: center;
  align-items: center;
}

.parentId {
  & >>> .el-cascader {
    pointer-events: none;
    .el-input__suffix-inner {
      pointer-events: none;
    }
  }
}
.menu-tree {
  & >>> .el-tree-node__content {
    height: 40px;
  }
}
</style>
