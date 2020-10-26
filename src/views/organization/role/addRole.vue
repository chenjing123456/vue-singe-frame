<template>
  <div class="app-card">
    <div class="card-item">
      <div class="card-head">创建数据</div>
      <div class="card-basic">
        <el-form ref="form" :model="role" label-width="0" :rules="rules">
          <div class="forml-item">
            <div class="label">
              角色名称
              <span class="required">*</span>
            </div>
            <el-form-item prop="name">
              <el-input
                v-model="role.name"
                type="text"
                maxlength="20"
                placeholder="请输入角色名称"
                show-word-limit
              />
            </el-form-item>
          </div>
          <div class="forml-item">
            <div class="label">角色描述</div>
            <el-form-item prop="description">
              <el-input
                v-model="role.description"
                type="textarea"
                maxlength="100"
                rows="3"
                placeholder="请输入角色描述"
                show-word-limit
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="card-item">
      <div class="card-head">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="功能权限" name="first" />
          <el-tab-pane label="数据权限" name="second" />
        </el-tabs>
      </div>
      <div class="role-permiss">
        <div v-if="activeName=='first'" class="func-per">
          <div class="func-lf">
            <div class="topCom">
              <i class="el-icon-menu" />
              <span>模块列表</span>
            </div>
            <div class="lf-bottom">
              <el-tree
                ref="tree"
                :props="defaultProps"
                class="menu-tree"
                :default-checked-keys="defaultChecked"
                :default-expanded-keys="defaultExpand"
                node-key="id"
                :data="data"
                :highlight-current="true"
                show-checkbox
                accordion
                @node-click="clickNode"
                @check-change="checkChangeMenu"
              />
            </div>
          </div>
          <div class="func-rl">
            <div class="topCom">操作权限</div>
            <div class="rl-bottom">
              <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="city in cities" :label="city.id" :key="city.id">{{city.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div v-else class="data-per">
          <span>关联数据权限：</span>
          <el-select v-model="resources" multiple placeholder="请选择" style="width: 570px;">
            <el-option
              v-for="item in dataOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
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
 * @description 角色管理新增/编辑
 * @author xiaomeng
 */
import {
  geMenuList,
  getDomianList,
  addRole,
  getRoleDetail
} from '@api/organization/role'
import { getMenuList } from '@api/organization/permission'
import { notEmpty, maxLength, betweenLength } from '@utils'
export default {
  name: 'AddRole',
  data() {
    return {
      activeName: 'first',
      dataOptions: [],
      resources: [],
      defaultChecked: [],
      defaultExpand: [],
      defaultProps: { label: 'name', children: 'sonMenu', isLeaf: 'leaf' },
      role: {
        name: '',
        description: ''
      },
      data: [],
      parentId: 0,
      checkedCities: [], // 菜单被选中操作的数组
      halfChecked: [],
      operationObj: {},
      cities: [],
      isIndeterminate: false,
      checkedMenus: [],
      rules: {
        name: [notEmpty('角色名称')]
      },
      hadClickKeys: [], // 已点击的key值
      activeKey: null,
      roleId: ''
    }
  },
  created() {
    const id = this.$route.query.id
    if (id) {
      this.roleId = id
      this.getRoleDetail()
    }
  },
  mounted() {
    this.getDomianList()
    this.getMenu()
  },
  methods: {
    /**
     * @description 菜单选中（功能权限）
     */
    checkChangeMenu(n, m, s) {
      const node = this.$refs.tree.getCheckedKeys()
      this.defaultChecked = node // 防止tab切换时会被重置
      this.halfChecked = this.$refs.tree.getHalfCheckedKeys()
    },
    /**
     * @description 按钮选中(操作权限)
     */
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cities : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {},
    /**
     * @description 切换权限按钮
     */
    tabClick(tab) {
      if (tab.label === '功能权限') {
        const that = this
        this.$nextTick(function() {
          this.defaultExpand = that.activeKey ? [that.activeKey] : [] // 默认展开项
          that.$refs.tree.setCurrentKey(that.activeKey) // 默认选中项
        })
      }
    },
    handClick(data) {
      if (data.id === null || data.id === undefined || data.id === null) return
      this.cities = this.operationObj[data.id] || []
    },
    /**
     * @description 获取菜单列表
     */
    getMenu() {
      getMenuList({ id: 0 }).then(response => {
        const res = response.data
        if (res.code == '000000') {
          this.data = res.data || []
        } else {
          this.data = []
          this.$message({
            message: res.mesg,
            type: 'error'
          })
        }
      })
    },
    /**
     * @description 获取角色详情
     */
    getRoleDetail() {
      getRoleDetail({ roleId: this.roleId }).then(response => {
        const that = this
        const res = response.data
        if (res.code == '000000') {
          const data = res.data
          const { role, menuList, buttonList, domainList } = res.data
          that.role.name = role.name
          that.role.description = role.description
          that.checkedCities =
            buttonList && buttonList.length > 0
              ? buttonList.map(v => {
                return v.id
              })
              : []
          that.resources =
            domainList && domainList.length > 0
              ? domainList.map(v => {
                return v.id
              })
              : []
          const arr = menuList.map(val => {
            return val.id
          })
          menuList.forEach(v => {
            if (arr.indexOf(v.parentId) !== -1) {
              const half = arr.splice(arr.indexOf(v.parentId), 1)
              that.halfChecked = [...new Set(that.halfChecked.concat(half))] // 半选或全选的父级id
            }
          })
          that.defaultChecked = arr
        } else {
          this.$message({
            message: response.mesg,
            type: 'error'
          })
        }
      })
    },
    /**
     * @description 获取数据权限
    */
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
     * @description 模块列表的点击事件
    */
    clickNode(d, node) {
      this.activeKey = d.id
      if (d.id in this.operationObj) {
        this.handClick({ id: d.id })
      } else {
        this.parentId = d.id
        geMenuList({ parentId: this.parentId }).then(response => {
          const that = this
          const res = response.data
          if (res.code == '000000') {
            const arr = res.data || []
            const city = arr.filter(v => {
              return v.type == 'BUTTON'
            })
            // 未被点击过 保存至对象operationObj中
            that.$set(that.operationObj, that.parentId, city)
            that.handClick({ id: that.parentId })
          } else {
            this.$message({
              message: response.mesg,
              type: 'error'
            })
          }
        })
      }
    },
    /**
     * @description 新增或修改角色
    */
    addRole() {
      const domainIds = this.resources.length > 0 ? this.resources : []
      const btns = this.checkedCities.length > 0 ? this.checkedCities : []
      this.checkedMenus = [
        ...new Set(this.defaultChecked.concat(btns, this.halfChecked))
      ]
      const menuIds = this.checkedMenus.length > 0 ? this.checkedMenus : []
      let con = { menuIds, domainIds, ...this.role }
      if (this.roleId) {
        con = { id: this.roleId, ...con }
      }
      addRole(con).then(response => {
        const that = this
        const { data } = response
        if (data.code == '000000') {
          this.$message({
            message: data.mesg,
            type: 'success'
          })
          this.$router.go(-1)
        } else {
          this.$message({
            message: data.mesg,
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
          this.addRole()
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
// .card-head{
//   & >>> .el-tabs__item{   //同deep
//       height: 55px;
//       line-height: 55px;
//     }
// }
.app-card {
  @include bottomCom;
}
.card-basic {
  .forml-item {
    width: 570px;
  }
}
.role-permiss {
  padding: 20px 24px 60px;
  height: 306px;
  .func-per {
    width: 100%;
    display: flex;
    height: 100%;
    border: 1px solid $color1;
  }
}
.topCom {
  min-height: 35px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 24px;
  line-height: 35px;
  i {
    font-size: 16px;
    margin-right: 6px;
  }
}

.func-lf {
  width: 350px;
  height: 100%;
  border-right: 1px solid $color1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .lf-bottom {
    padding: 12px 0;
    @include bottomCom;
  }
}

.func-rl {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .rl-bottom {
    @include bottomCom;
    padding: 12px 0;
    & >>> .el-checkbox-group {
      display: flex;
      flex-direction: column;
    }
    & >>> .el-checkbox {
      height: 30px;
      line-height: 30px;
      width: 100%;
      padding: 0 24px;
      margin-bottom: 8px;
      &:hover {
        background: #e6f7ff;
        color: #1890ff;
      }
    }
  }
}
.required {
  color: red;
  vertical-align: sub;
}
</style>
