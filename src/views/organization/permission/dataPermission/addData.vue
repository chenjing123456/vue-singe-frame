<template>
  <div class="page-notbreadcrumb">
    <section class="page-list">
      <div class="title">
        <div class="title_l">
          <svg-icon icon-class="iconshujuquanxian1" />
          <span class="tit">数据权限</span>
          <span class="num">{{total}}</span>
        </div>
        <div class="title_r">
          <i
            class="el-icon-circle-plus-outline add-icon"
            @click="resetData(),disabledSelect=false,isShowDialog=true"
          ></i>
        </div>
      </div>
      <div class="list_box">
        <div class="list_search">
          <el-input
            v-model="listQuery.keyword"
            placeholder="请输入关键字进行搜索"
            clearable
            @input="queryUser"
          >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="queryUser" />
          </el-input>
        </div>
        <div class="list_main">
          <div
            :class="['per_li',activeId==item.id?'active':'']"
            v-for="(item,i) in permissionList"
            :key="i"
            @click="getDetailProp(item)"
          >
            <div>
              <i class="iconfont iconquanxian"></i>
              {{item.name}}
            </div>
            <div>
              <el-popover
                placement="bottom"
                width="153"
                height="105"
                trigger="click"
                popper-class="menu-popper"
              >
                <div class="node-act">
                  <div
                    @click.stop="disabledSelect=true,isShowDialog = true,permission={...permission,...domainDetail}"
                  >
                    <i class="iconfont iconzhongmingming" />
                    <span>重命名</span>
                  </div>
                </div>
                <div class="node-act">
                  <div @click.stop="deletePermission(item.id)">
                    <i class="el-icon-delete" />
                    <span>删除</span>
                  </div>
                </div>
                <i slot="reference" class="iconfont iconduogongneng" />
              </el-popover>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="page-prop">
      <div class="no-data-type" v-if="!isShowProp">
        <div class="no-img"></div>
        <div class="no-text">请在左侧新建 或 选择数据表</div>
      </div>
      <div class="detail" v-if="isShowProp">
        <section class="prop_head">
          <span>当前选择</span>
          <section class="head_main">
            <div class="prop_type">
              <div class="prop_title">
                <i class="iconfont iconquanxian strong"></i>
                <span class="prop_tit">{{activeNameProp}}</span>
                <i class="iconfont iconcengji"></i>
              </div>
              <div class="prop_title">
                <i class="iconfont iconziduan strong"></i>
                <span class="prop_tit">{{activeModelName}}</span>
                <i class="el-icon-arrow-down"></i>
              </div>
            </div>
            <div class="btns">
              <el-button size="small" @click="save('clear')">清空</el-button>
              <el-button type="primary" size="small" @click="save">保存</el-button>
            </div>
          </section>
        </section>
        <section class="prop_bottom">
          <section class="prop_l">
            <div class="prop_search">
              <el-input v-model="keyword" placeholder="请搜索" clearable @input="filterKeysData">
                <i slot="suffix" class="el-input__icon el-icon-search" />
              </el-input>
            </div>
            <div class="prop_item">
              <span class="name">名称</span>
              <span class="see">查看权限</span>
              <span class="filter">过滤</span>
            </div>
            <div class="prop_list">
              <div
                :class="['prop_item', 'prop_item_act',activeKey==item.modelDetailId?'activeProp':'']"
                v-for="(item,index) in filterKeyList"
                :key="index"
                @click="activeKey = item.modelDetailId,filterData(item)"
              >
                <div class="name" :title="item.name">
                  <i :class="filterIcon(item.dataType)"></i>
                  {{item.name}}
                </div>
                <div class="see">
                  <i :class="['iconfont',item.displayStatus?'iconchakan':'iconyincang']"></i>
                </div>
                <div class="filter">
                  <i v-if="judgeType(item.value)" class="iconfont iconguolv"></i>
                </div>
              </div>
            </div>
          </section>
          <section class="prop_r">
            <div class="prop_title">
              <svg-icon icon-class="iconguolvtiaojian" />
              <span class="prop_tit">过滤条件</span>
            </div>
            <div class="prop_filter">
              <div class="filter-header">
                <div class="filter-tabs">
                  <span
                    :class="['tab',activeName==item.name?'act':'']"
                    v-for="(item,index) in tabs"
                    :key="index"
                    @click="activeName = item.name"
                  >{{item.name}}</span>
                </div>
                <div class="btns">
                  <el-button type="primary" size="small" @click="confirmSaveFront">确定</el-button>
                </div>
              </div>

              <filter-box
                ref="filter"
                v-if="activeKey"
                :activeName="activeName"
                :dataType="dataType"
                :defaultFilterData="defaultFilterData"
                :conditionData="conditionData"
                :enumsList="enumsList"
              ></filter-box>
            </div>
          </section>
        </section>
      </div>
    </section>
    <el-dialog :visible.sync="isShowDialog" width="740px">
      <template slot="title">
        <div class="header">
          <i class="iconfont iconshuxing" />
          <span>新增权限</span>
        </div>
      </template>
      <div class="content">
        <div class="item">
          <el-form ref="form" :model="permission" label-width="0" :rules="rules">
            <div class="forml-item">
              <div class="label">
                权限名称
                <span class="required">*</span>
              </div>
              <el-form-item prop="name">
                <el-input v-model="permission.name" placeholder="请输入职能部门" />
              </el-form-item>
            </div>
            <div class="forml-item">
              <div class="label">
                表类型
                <span class="required">*</span>
              </div>
              <el-form-item prop="modelId">
                <el-select
                  v-model="permission.modelId"
                  :disabled="disabledSelect"
                  placeholder="试试搜索"
                  filterable
                >
                  <el-option
                    v-for="item in treeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="item createGraph">
          <div class="create-img">
            <svg-icon icon-class="long_txt"></svg-icon>
          </div>
          <div class="create-tip">
            <ul>
              <li v-for="(item,index) in tips" :key="index">{{item}}</li>
            </ul>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetData(),isShowDialog=false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * @description 数据权限
 * @author xiaomeng
*/
import {
  notEmpty,
  maxLength,
  betweenLength,
  notSelect
} from '@utils'
import {
  listModelDomain,
  listCondition,
  findDomainById,
  updateDomain,
  domianList,
  findModelDetailByModelId,
  batchDeleteDomain,
  addDomain
} from '@api/organization/permission'
import { typeList } from '@constant'
import filterBox from './filterBox'
export default {
  name: 'AddType',
  data() {
    return {
      disabledSelect: false,
      listQuery: {
        keyword: '',
        current: 1,
        size: 1000
      },
      isShowDialog: false,
      tabs: [],
      tips: [
        '新建一个权限表',
        '将 数据库 当中的表单字段插入',
        '完成 数据权限 表单'
      ],
      conditionData: [],
      typeList,
      activeNameProp: '',
      activeModelName: '',
      domainDetail: {},
      enumsList: [], // 当前枚举值列表
      activeName: '枚举值',
      keyword: '',
      isShowProp: false,
      permissionList: [],
      total: 0, // 权限总数
      treeList: [], // 数据类型列表
      conditionList: [], // 条件列表
      keyList: [], // 当前权限的key列表
      filterKeyList: [], // 当前筛选后的key列表
      activeId: null, // 权限id
      activeKey: null, // 当前选中key
      dataType: null,
      modelId: null, // 当前权限的modelId-用于获取当前权限的key列表
      defaultFilterData: null,
      permission: {
        name: '',
        modelId: ''
      },
      rules: {
        name: [notEmpty('权限名称')],
        modelId: [
          { required: true, message: '请选择表类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    // 数据类型列表
    this.listModelDomain()
    // 获取不同类型key的筛选条件
    this.listCondition()
    // 获取权限列表
    this.queryUser()
  },
  components: {
    filterBox
  },
  computed: {},
  methods: {
    /**
     * @description 搜索key
     */
    filterKeysData() {
      this.filterKeyList = this.keyList.filter(v => {
        return v.name.indexOf(this.keyword) != -1
      })
    },
    /**
     * @description 判断类型
     */
    judgeType(value) {
      if (value instanceof Array) {
        return value.length > 0
      } else {
        return value
      }
    },
    /**
     * @description 显示不同类型的图标
     * @param {String} type dateTime/date时间 text文本类型 num数值类型
     */
    filterIcon(type) {
      let icon = ''
      if (type == 'dateTime') {
        icon = 'el-icon-date'
      } else if (type == 'date') {
        icon = 'el-icon-time'
      } else if (type == 'text') {
        icon = 'iconfont icongudingziduan'
      } else if (type == 'num') {
        icon = 'iconfont iconshuzhi'
      }
      return icon
    },
    /**
     * @description 获取当前数据权限的数据
     */
    getDetailProp(item) {
      this.activeId = item.id
      this.activeNameProp = item.name
      this.modelId = item.modelId
      this.isShowProp = true
      this.findDomainById()
    },
    /**
     * @description 获取权限列表
     */
    queryUser() {
      this.getDefaultStatus()
      domianList(this.listQuery).then(res => {
        const data = res.data
        this.permissionList = data.data.records || []
        this.total = data.data.total
      })
    },
    /**
     * @description 删除权限
     */
    deletePermission(ids) {
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
            this.getDefaultStatus()
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
     * @description 保存数据到本地
     */
    confirmSaveFront() {
      if (!this.$refs.filter) {
        this.$message({ type: 'warning', message: '请选择要过滤的数据项' })
        return
      }
      const obj = this.$refs.filter.saveData()
      if (!obj) return
      const index = this.keyList.findIndex(v => {
        return v.modelDetailId == this.activeKey
      })
      this.keyList[index] = { ...this.keyList[index], ...obj }
    },
    /**
     * @description 获取当前权限的key列表
     */
    findModelDetailByModelId() {
      findModelDetailByModelId({ id: this.modelId }).then(res => {
        const data = res.data
        if (data.code == '000000') {
          const arr = data.data || []
          // 处理数据 - 时间/文本或数值属于枚举值的情况需改为数组
          const arr2 = this.domainDetail.filters
            ? JSON.parse(this.domainDetail.filters)
            : []
          this.keyList = arr2.map((v, i) => {
            let value = v.value
            if (value.length > 0 && v.condition.length > 0) {
              if (v.dataType == 'date' || v.dataType == 'dateTime') {
                // 时间
                value = value.split(',')
              } else {
                // 文本或数值属于枚举值的情况
                if (v.condition == 'in') value = value.split(',')
              }
            }
            return {
              ...v,
              enums: arr[i].enums || [],
              name: arr[i].name,
              value
            }
          })
          this.filterKeyList = JSON.parse(JSON.stringify(this.keyList))
        } else {
          this.keyList = []
          this.filterKeyList = []
        }
      })
    },
    /**
     * @description 改变数据类型-改变筛选列表
     */
    filterData(item) {
      let { dataType, condition, value } = item
      // console.log(item)
      this.dataType = dataType
      // 默认枚举值
      this.enumsList =
        item.enums &&
        item.enums.length > 0 &&
        (dataType == 'num' || dataType == 'text')
          ? item.enums.split(',')
          : []
      // 默认选中值
      this.defaultFilterData = {
        value,
        condition
      }
      // 筛选项tabs 默认选中枚举或自定义tabs
      if (dataType == 'date' || dataType == 'dateTime') {
        this.tabs = [{ name: '自定义' }]
        this.activeName = this.tabs[0].name
      } else {
        this.tabs = [{ name: '枚举值' }, { name: '自定义' }]
        if (condition == 'in' || !condition) {
          // 属于枚举值
          this.activeName = this.tabs[0].name
        } else {
          this.activeName = this.tabs[1].name
        }
      }
      // 改变右侧筛选条件
      this.conditionData = dataType ? this.conditionList[dataType] : []
    },
    /**
     * @description 获取不同类型key的筛选条件
     */
    listCondition() {
      listCondition().then(res => {
        const data = res.data
        if (data.code == '000000') {
          this.conditionList = data.data
        }
      })
    },
    /**
     * @description  数据类型列表
     */
    listModelDomain() {
      listModelDomain().then(res => {
        const data = res.data
        if (data.code == '000000') {
          this.treeList = data.data
        } else {
          this.treeList = []
        }
      })
    },
    /**
     * @description 保存或者清空过滤条件
     */
    save(type) {
      const arr = JSON.parse(JSON.stringify(this.keyList))
      const filterArr = arr.map(v => {
        let value = v.value
        if (value instanceof Array) {
          value = value.length > 0 ? value.join(',') : ''
        }
        return { ...v, value }
      })
      const con = {
        ...this.domainDetail,
        filters:
          type === 'clear' ? JSON.stringify([]) : JSON.stringify(filterArr)
      }
      if (type === 'clear') {
        this.$confirm('此操作将清空当前项的过滤数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateDomain(con)
        })
      } else {
        this.updateDomain(con)
      }
    },
    /**
     * @description 保存或者清空过滤条件-后台接口
     */
    updateDomain(con) {
      updateDomain(con).then(res => {
        const data = res.data
        if (data.code == '000000') {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.findDomainById()
        } else {
          this.$message({
            type: 'error',
            message: data.mesg
          })
        }
      })
    },
    // 重置当前选择的内容
    resetRight() {
      this.tabs = []
      this.activeKey = ''
      this.conditionData = []
      this.keyword = ''
    },
    // 重置表单数据
    resetData() {
      this.permission = {
        name: '',
        modelId: ''
      }
    },
    // 重置成初始状态
    getDefaultStatus() {
      this.resetData()
      this.activeId = ''
      this.isShowProp = false
    },
    /**
     * @description 重命名或新增权限
     */
    updateOrAdd() {
      let api = addDomain
      if (this.permission.id) api = updateDomain
      api(this.permission).then(res => {
        const data = res.data
        if (data.code == '000000') {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.isShowDialog = false
          this.queryUser()
          this.getDefaultStatus()
        } else {
          this.$message({
            type: 'error',
            message: data.mesg
          })
        }
      })
    },
    /**
     * @description 获取数据详情
     */
    findDomainById() {
      this.resetRight()
      findDomainById({ id: this.activeId }).then(res => {
        const data = res.data
        if (data.code == '000000') {
          this.domainDetail = data.data
          this.isShowProp = true
          this.activeModelName = this.domainDetail.modelName
          this.findModelDetailByModelId()
        } else {
          this.$message({
            type: 'error',
            message: data.mesg
          })
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateOrAdd()
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
@import "~@styles/index.scss";
$width: 262px;
.page-notbreadcrumb {
  display: flex;
  width: 100%;
  height: 100%;
  .page-list {
  }
  .page-prop {
    padding: 18px 24px 30px;
  }
  .detail {
    height: 100%;
    .btns {
      & >>> .el-button {
        width: 78px;
      }
    }
    .prop_search {
      padding: 12px;
    }
    .prop_bottom {
      border-top: 1px solid $color1;
      height: calc(100% - 66px);
      padding-top: 20px;
      display: flex;
      .prop_l {
        height: 100%;
        width: 280px;
        border-radius: 2px;
        border: 1px solid $color1;
        margin-right: 20px;
      }
      .prop_r {
        height: 100%;
        width: calc(100% - 300px);
        @include title;
        .strong {
          font-size: 20px !important;
        }
        .prop_tit {
          font-size: 14px !important;
        }
        .prop_filter {
          height: calc(100% - 40px);
          width: 100%;
          border: 1px solid $color1;
          .filter-header {
            width: 100%;
            height: 60px;
            padding: 30px;
            border-bottom: 1px solid $color1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .filter-tabs {
              width: 50%;
            }
          }
        }
      }
    }

    .prop_item {
      height: 36px;
      display: flex;
      align-items: center;
      padding: 0 14px;
      .name {
        width: 140px;
        text-align: left;
        white-space: nowrap; /*规定段落中的文本不进行换行*/
        overflow: hidden; /*内容会被修剪，并且其余内容是不可见的。*/
        text-overflow: ellipsis; /*显示省略号来代表被修剪的文本*/
      }
      .see {
        width: 70px;
        text-align: center;
      }
      .filter {
        width: 70px;
        text-align: right;
        .iconguolv {
          color: #0091ff;
        }
      }
      &.prop_item_act {
        margin-top: 5px;
        @include hovers;
      }
    }
    .prop_list {
      border-top: 1px solid $color1;
      height: calc(100% - 100px);
      @include bottomCom;
    }
  }

  & >>> .el-dialog {
    .el-dialog__header {
      padding-bottom: 20px !important;
      border-bottom: 1px solid #ebebeb;
      .header {
        display: flex;
        align-items: center;
      }
      .iconshuxing {
        font-size: 23px;
        color: #0091ff;
        margin-right: 5px;
      }
    }
    .el-dialog__body {
      height: 500px;
      padding: 40px 60px;
      box-sizing: border-box;
    }
    .content {
      width: 100%;
      height: 100%;
      display: flex;
      .item {
        height: 100%;
        flex: 1;
        border-left: 1px solid #ebebeb;
        &:nth-child(1) {
          border: none;
        }
      }
    }
    .el-dialog__footer {
      padding-top: 20px !important;
      border-top: 1px solid #ebebeb;
    }
  }
  .forml-item {
    margin-bottom: 40px;
    .label {
      margin-bottom: 8px;
    }
    & >>> .el-form-item__content {
      width: 223px;
    }
    & >>> .el-select {
      width: 223px;
    }
  }
}
.required {
  color: red;
  vertical-align: sub;
}
</style>
