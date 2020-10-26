<template>
  <div class="page-notbreadcrumb">
    <section class="page-list">
      <div class="title">
        <div class="title_l">
          <svg-icon icon-class="iconshujubiao" />
          <span class="tit">数据分组</span>
          <span class="num">{{total}}</span>
        </div>
        <div class="title_r">
          <i
            class="el-icon-circle-plus-outline add-icon"
            @click="title='新增',form={name:''},isShowDialog = true"
          ></i>
        </div>
      </div>
      <div class="list_box">
        <div class="list_search">
          <el-input v-model="listQuery.name" placeholder="请输入关键字搜索…" clearable @input="queryUser">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="queryUser" />
          </el-input>
        </div>
        <div class="list_main">
          <div
            :class="['per_li',activeId==item.id?'active':'']"
            v-for="(item,i) in groupList"
            :key="i"
            @click="activeId=item.id,activeName=item.name,getFindModelDetails()"
          >
            <div class="name">
              <i class="iconfont iconbiao"></i>
              <span :title="item.name">{{item.name}}</span>
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
                  <div @click="title='编辑',getFindModelDetails(),isShowDialog=true">
                    <i class="iconfont iconzhongmingming" />
                    <span>重命名</span>
                  </div>
                </div>
                <div class="node-act">
                  <div @click="conformDelete(item.id)">
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
    <section class="page-list">
      <div class="title">
        <div class="title_l">
          <svg-icon icon-class="iconshujubiao" />
          <span class="tit">字段</span>
          <span class="num">{{total1}}</span>
        </div>
        <div class="title_r">
          <i class="el-icon-circle-plus-outline add-icon" @click="addKey"></i>
        </div>
      </div>
      <div class="list_box">
        <div class="list_search">
          <el-input v-model="keyword" placeholder="请输入关键字搜索…" clearable @input="filterKeysData">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="filterKeysData" />
          </el-input>
        </div>
        <div class="list_main">
          <div
            :class="['per_li',detailsId==item.id?'active':'']"
            v-for="(item,i) in filterDetailList"
            :key="i"
            @click="detailsName=item.name,detailsId=item.id,isShowProp=true,getKeyDetail()"
          >
            <div class="name">
              <i class="iconfont iconziduan"></i>
              <span :title="item.name">{{item.name}}</span>
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
                  <div @click="deleteItem(item)">
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
    <section class="page-props" v-if="isShowProp">
      <div class="props_btns">
        <el-button size="small" @click="getKeyDetail()">取消</el-button>
        <el-button type="primary" size="small" @click="submitForm('ruleForm','key')">保存</el-button>
      </div>
      <div class="props_title">
        <section>属性</section>
        <section class="prop_head">
          <span>当前选择</span>
          <section class="head_main">
            <div class="prop_type">
              <div class="prop_title">
                <i class="iconfont iconbiao strong"></i>
                <span class="prop_tit">{{activeName}}</span>
                <i class="iconfont iconcengji"></i>
              </div>
              <div class="prop_title">
                <i class="iconfont iconziduan strong"></i>
                <span class="prop_tit">{{detailsName}}</span>
              </div>
            </div>
          </section>
        </section>
        <svg-icon icon-class="props"></svg-icon>
      </div>
      <div class="props_box">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="myform">
          <el-form-item label="字段名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入字段名称"></el-input>
          </el-form-item>
          <el-form-item label="中文注释" prop="dataColumnRemark">
            <el-input
              v-model="ruleForm.dataColumnRemark"
              placeholder="请输入中文注释"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="数据库" prop="dataBase">
            <el-input
              v-model="ruleForm.dataBase"
              placeholder="请输入数据库名称"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="数据表" prop="dataTable">
            <el-input
              v-model="ruleForm.dataTable"
              placeholder="请输入数据表名称"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="字段" prop="dataColumn">
            <el-input
              v-model="ruleForm.dataColumn"
              placeholder="请输入字段名称"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="字段类型" prop="dataType">
            <el-select v-model="ruleForm.dataType" placeholder="请选择字段类型">
              <el-option v-for="(v,i) in typeList" :key="i" :label="v.name" :value="v.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="枚举值"
            prop="enums"
            class="enums"
            v-if="ruleForm.dataType=='num'||ruleForm.dataType=='text'"
          >
            <el-select
              v-model="ruleForm.enums"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="支持多个，输入后回车即可保存"
            >
              <el-option
                v-for="item in []"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </section>
    <section class="page-props" v-if="!isShowProp">
      <div class="no-data-type">
        <div class="no-img"></div>
        <div class="no-text">请在左侧选择字段</div>
      </div>
    </section>
    <el-dialog :visible.sync="isShowDialog" width="500px">
      <template slot="title">
        <div class="header">
          <i class="iconfont iconshuxing" />
          <span>{{title}}</span>
        </div>
      </template>
      <div class="content">
        <el-form ref="form" :model="form" label-width="0" :rules="rules1">
          <div class="forml-item">
            <div class="label">
              分组名称
              <span class="required">*</span>
            </div>
            <el-form-item prop="name">
              <el-input v-model="form.name" placeholder="请输入分组名称" />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog=false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form','group')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * @description 数据分组
 * @author xiaomeng
 */
import {
  notEmpty,
  maxLength,
  betweenLength,
  notSelect,
  isNumberOrCN
} from '@utils'
import {
  listModel,
  deleteModel,
  deleteModelDetail,
  findModelDetail,
  addModelDetail,
  updateModelDetail,
  addOrUpateGroup
} from '@api/organization/permission'
import { typeList } from '@constant'
export default {
  name: 'AddType',
  data() {
    return {
      ruleForm: {
        // id: null,
        // modelName: "",
        dataColumnRemark: '',
        name: '',
        dataBase: '',
        dataTable: '',
        dataColumn: '',
        dataType: '',
        enums: []
      },
      title: '新增',
      detailsId: '', // 当前字段ID
      detailsName: '', // 当前字段name
      form: { name: '' },
      isShowDialog: false,
      isShowProp: false,
      activeId: '', // 当前分组ID
      activeName: '', // 当前分组名称
      groupList: [],
      listQuery: {
        name: '',
        current: 1,
        size: 1000
      },
      total: 0, // 分组总数
      total1: 0,
      typeList: [...typeList],
      type: null,
      id: null,
      keyword: '',
      details: [], // 字段列表
      filterDetailList: [], // 筛选后的字段列表
      rules1: {
        name: [notEmpty('分组名称')]
      },
      rules: {
        // modelName: [notEmpty("分组名称")],
        name: [notEmpty('字段名称')],
        dataColumnRemark: [isNumberOrCN('中文注释')],
        dataBase: [notEmpty('数据库')],
        dataTable: [notEmpty('数据表')],
        dataColumn: [notEmpty('字段')],
        dataType: [notSelect('字段类型')]
        // enums: [notEmpty('枚举')]
      }
    }
  },
  created() {
    this.queryUser()
  },
  methods: {
    /**
     * @description 搜索字段
     */
    filterKeysData() {
      this.filterDetailList = this.details.filter(v => {
        return v.name.indexOf(this.keyword) != -1
      })
      this.total1 = this.filterDetailList.length
    },
    /**
     * @description 获取数据分组列表
    */
    queryUser() {
      this.form = { name: '' }
      this.reset()
      this.activeName = ''
      this.activeId = ''
      this.details = []
      this.filterDetailList = []
      this.isShowProp = false
      const item = {
        key: this.listQuery.name,
        current: this.listQuery.current,
        size: this.listQuery.size
      }
      listModel(item).then(res => {
        const data = res.data
        this.groupList = data.data.records || []
        this.total = data.data.total
      })
    },
    /**
     * @description 新增字段点击事件
    */
    addKey() {
      if (this.activeId) {
        this.reset()
        this.isShowProp = true
      } else {
        this.$message({
          type: 'warning',
          message: '请选择分组后添加字段'
        })
      }
      if (this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields()
    },
    /**
     * @description 获取某个字段的所有属性
    */
    getKeyDetail() {
      if (this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields()
      const obj = this.details.find(v => {
        return v.id === this.detailsId
      })
      const enums = obj.enums ? obj.enums.split(',') : []
      this.ruleForm = {
        ...this.ruleForm,
        ...obj,
        // modelName: this.activeName,
        enums
      }
    },
    /**
     * @description 删除数据分组
    */
    conformDelete(ids) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteModel({ ids }).then(res => {
          if (res.data.code === '000000') {
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
     * @description 获取数据详情
    */
    getFindModelDetails() {
      this.isShowProp = false
      this.detailsName = ''
      this.detailsId = ''
      findModelDetail({ id: this.activeId }).then(res => {
        if (res.data.code === '000000') {
          const data = res.data.data
          const { name, id } = data
          this.form = { ...this.form, name, id }
          this.details = data.colList || []
          this.filterDetailList = JSON.parse(JSON.stringify(this.details))
          this.total1 = this.filterDetailList.length
        }
      })
    },
    /**
     * @description 删除字段
    */
    deleteItem(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteModelDetail({ id: row.id }).then(res => {
          if (res.data.code === '000000') {
            this.$message({
              message: res.data.mesg,
              type: 'success'
            })
            this.getFindModelDetails()
          } else {
            this.$message({
              message: res.data.mesg,
              type: 'error'
            })
          }
        })
      })
    },
    /**
     * @description  提交校验
    */
    submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (type == 'group') {
            this.createGroup()
          } else {
            this.createModel()
          }
        } else {
          return false
        }
      })
    },
    /**
     * @description 新增或修改分组
    */
    createGroup() {
      addOrUpateGroup(this.form).then(res => {
        const that = this
        const { data } = res
        if (data.code == '000000') {
          this.$message({
            message: data.mesg,
            type: 'success'
          })
          this.isShowDialog = false
          this.queryUser()
        } else {
          this.$message({
            message: data.mesg,
            type: 'error'
          })
        }
      })
    },
    /**
     * @description 新增或修改字段
    */
    createModel() {
      let api = addModelDetail
      if (this.ruleForm.id) api = updateModelDetail
      const dataType = this.ruleForm.dataType
      let enums = this.ruleForm.enums
      enums =
        dataType == 'num' || dataType == 'text'
          ? enums && enums.length > 0
            ? enums.join(',')
            : ''
          : ''
      const con = { ...this.ruleForm, enums, modelId: this.activeId }
      api(con).then(res => {
        const that = this
        const { data } = res
        if (data.code == '000000') {
          this.$message({
            message: data.mesg,
            type: 'success'
          })
          this.reset()
          this.getFindModelDetails()
        } else {
          this.$message({
            message: data.mesg,
            type: 'error'
          })
        }
      })
    },
    /**
     * @description  重置数据
    */
    reset() {
      this.detailsId = ''
      this.detailsName = ''
      this.ruleForm = {
        // modelName: this.activeId,
        dataColumnRemark: '',
        name: '',
        dataBase: '',
        dataTable: '',
        dataColumn: '',
        dataType: '',
        enums: []
      }
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
    &:nth-child(1) {
      margin-right: 0;
      box-shadow: 8px 0 5px -6px rgba(0, 61, 120, 0.12);
      position: relative;
      z-index: 1;
    }
  }
  .page-props {
    width: calc(100% - 544px);
    height: 100%;
    background: #fff;
    .props_title {
      position: relative;
      border-bottom: 1px solid #ebebeb;
      width: 100%;
      height: 165px;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      // background: url("~@/assets/setting/type_header.png") no-repeat center/
      //   100% 100%;
      .svg-icon {
        position: absolute;
        bottom: 0;
        right: 48px;
        width: 200px;
        height: 115px;
      }
    }
    .props_btns {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 20px;
      border-bottom: 1px solid #ebebeb;
      & >>> .el-button {
        width: 78px;
      }
    }
    .props_box {
      padding: 24px;
      height: calc(100% - 215px);
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
      height: 200px;
      padding: 40px 60px;
      box-sizing: border-box;
    }
    .forml-item {
      margin-bottom: 40px;
      width: 280px;
      .label {
        margin-bottom: 10px;
      }
      & >>> .el-form-item__content {
        width: 223px;
      }
    }
    .required {
      color: red;
      vertical-align: sub;
    }
    .el-dialog__footer {
      padding-top: 20px !important;
      border-top: 1px solid #ebebeb;
    }
  }
  .myform {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    & >>> .el-form-item {
      width: 50%;
      .el-form-item__label {
        float: none;
      }
      .el-form-item__content {
        width: 229px;
      }
      .el-select {
        width: 229px;
      }
      &.enums {
        .el-select {
          width: 500px;
        }
      }
    }
  }
}
</style>
