<template>
  <div class="app-card">
    <div class="card-item">
      <div class="card-head">数据类型</div>
      <div class="card-basic">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="0"
          class="demo-ruleForm"
        >
          <div class="forml-item">
            <div class="label">
              类型名称
              <!--<span class="required">*</span>-->
            </div>
            <el-form-item prop="modelName">
              <el-input
                :disabled="id?true:false"
                v-model="ruleForm.modelName"
                type="text"
                maxlength="20"
                placeholder="请输入类型名称"
                show-word-limit
              />
            </el-form-item>
          </div>
          <div class="forml-add" v-if="!id">
            <div class="forml-add-top">类型名称</div>
            <div class="forml-add-bott" :class="isOpenRight?'changeColor':''">
              <div class="iconOut" @click="openRight(0)">
                <div class="iconOut-header">
                  <i class="el-icon-s-data"></i>
                </div>
                <div class="iconOut-footer">
                  <i class="el-icon-plus"></i>新增自定义数据
                </div>
              </div>
            </div>
          </div>
          <div class="forml-edit" v-else>
            <div class="forml-edit-name">
              <span>类型名称</span>
              <span @click="openRight(1)">
                <i class="el-icon-plus"></i>新增
              </span>
            </div>
            <div class="forml-edit-list">
              <div class="edit-cell" v-for="(item,index) in details.colList" :key="index">
                <div class="edit-cell-icon">
                  <i class="el-icon-s-data"></i>
                </div>
                <span>{{ item.name }}</span>
                <el-popover placement="bottom" width="50" trigger="click">
                  <div class="popo-outer">
                    <div @click="openRight(2,item)">编辑</div>
                    <div @click="deleteItem(item)">删除</div>
                  </div>
                  <i slot="reference" class="el-icon-more"></i>
                </el-popover>
              </div>
            </div>
          </div>
          <div v-show="isOpenRight" class="forml-right">
            <div class="forml-right-title">
              <span>
                <i class="iconfont iconchuangjiangongneng"></i>自定义数据
              </span>
              <i class="el-icon-close" @click="closeForm('ruleForm')"></i>
            </div>
            <div class="forml-right-center">
              <span>上传数据</span>
              <el-form-item label="中文注释" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入中文注释"></el-input>
              </el-form-item>
              <el-form-item label="数据库" prop="dataBase">
                <el-input v-model="ruleForm.dataBase" placeholder="请输入数据库名称"></el-input>
              </el-form-item>
              <el-form-item label="数据表" prop="dataTable">
                <el-input v-model="ruleForm.dataTable" placeholder="请输入数据表名称"></el-input>
              </el-form-item>
              <el-form-item label="字段" prop="dataColumn">
                <el-input v-model="ruleForm.dataColumn" placeholder="请输入字段名称"></el-input>
              </el-form-item>
              <el-form-item label="字段类型" prop="dataType">
                <el-select v-model="ruleForm.dataType" placeholder="请选择字段类型">
                  <el-option v-for="(v,i) in typeList" :key="i" :label="v.name" :value="v.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="枚举值" prop="enums">
                <el-input v-model="ruleForm.enums" placeholder="支持多个，用逗号隔开"></el-input>
              </el-form-item>
            </div>
            <div class="forml-right-btns">
              <el-button @click="closeForm('ruleForm')">取消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">创建</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  notEmpty,
  maxLength,
  betweenLength,
  notSelect
} from '@utils/validate'
import * as api from '@api/organization/permission'
import { typeList } from '@constant'
export default {
  name: 'AddType',
  data() {
    return {
      ruleForm: {
        // id: null,
        modelName: '',
        name: '',
        dataBase: '',
        dataTable: '',
        dataColumn: '',
        dataType: '',
        enums: ''
      },
      typeList: [...typeList],
      type: null,
      isOpenRight: false,
      id: null,
      details: {},
      rules: {
        modelName: [notEmpty('类型名称')],
        name: [notEmpty('中文注释')],
        dataBase: [notEmpty('数据库')],
        dataTable: [notEmpty('数据表')],
        dataColumn: [notEmpty('字段')],
        dataType: [notSelect('字段类型')]
        // enums: [notEmpty('枚举')]
      }
    }
  },
  created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.getFindModelDetails()
    }
  },
  methods: {
    // 获取数据详情
    getFindModelDetails() {
      console.log(this.id)
      api.findModelDetail({ id: this.id }).then(res => {
        if (res.data.code === '000000') {
          const data = res.data.data
          this.details = res.data.data || {}
          this.ruleForm.modelName = this.details.name
        }
      })
    },
    deleteItem(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteModelDetail({ id: row.id }).then(res => {
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.createModel()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createModel() {
      let url
      if (this.id && this.type === 2) {
        url = 'updateModelDetail'
      } else {
        url = 'addModelDetail'
      }
      api[url](this.ruleForm).then(res => {
        const that = this
        const { data } = res
        if (data.code == '000000') {
          this.$message({
            message: data.mesg,
            type: 'success'
          })
          if (!this.type) {
            history.go(-1)
          } else {
            this.getFindModelDetails()
            this.closeForm()
          }
        } else {
          this.$message({
            message: data.mesg,
            type: 'error'
          })
        }
      })
    },
    openRight(type, row) {
      this.type = type
      this.isOpenRight = true
      if (row) {
        Object.keys(this.ruleForm).forEach(v => {
          this.ruleForm[v] = row[v]
        })
        this.ruleForm.id = row.id
      } else {
        this.ruleForm = {
          // modelName: '',
          name: '',
          dataBase: '',
          dataTable: '',
          dataColumn: '',
          dataType: '',
          enums: ''
        }
      }
      this.ruleForm.modelName = this.details.name
        ? this.details.name
        : this.ruleForm.modelName
    },
    // 关闭右侧弹窗
    closeForm() {
      this.isOpenRight = false
      this.$refs.ruleForm.clearValidate()
    }
  }
}
</script>

<style lang="scss">
@import "~@styles/variables.scss";
.app-card {
  .card-item {
    height: 100%;
    overflow: hidden;
  }
}

.card-basic {
  height: calc(100% - 44px);
  padding: 12px 24px 32px;
  overflow-y: scroll;
  @include bottomCom;
  .forml-item {
    width: 570px;
  }
  .forml-content {
    margin: 20px 0;
    &-row {
      span {
        display: inline-block;
        padding: 0 20px;
        line-height: 30px;
      }
      span:nth-child(1) {
        color: #1890ff;
      }
    }
  }
  .forml-add {
    width: 100%;
    height: 570px;
    border: 1px solid rgba(0, 25, 49, 0.1);
    border-radius: 4px;
    &-top {
      height: 42px;
      line-height: 42px;
      background: rgba(0, 25, 49, 0.1);
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      padding: 0 24px;
    }
    &-bott {
      height: calc(100% - 42px);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #1892fc;
      .iconOut {
        cursor: pointer;
        &-header {
          text-align: center;
          font-size: 30px;
        }
        &-footer {
          i {
            margin-right: 10px;
          }
        }
      }
    }
    .changeColor {
      color: rgba(0, 0, 0, 0.25);
    }
  }
  .forml-edit {
    width: 100%;
    border: 1px solid rgba(0, 25, 49, 0.1);
    border-radius: 4px;
    &-name {
      height: 42px;
      line-height: 42px;
      background: rgba(0, 25, 49, 0.1);
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      span:nth-child(2) {
        cursor: pointer;
      }
    }
    &-list {
      min-height: 200px;
      display: flex;
      flex-wrap: wrap;
      .edit-cell {
        width: 16.666%;
        height: 60px;
        display: flex;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.5);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        justify-content: center;
        align-items: center;
        .el-icon-more {
          transform: rotate(90deg);
        }
        i {
          cursor: pointer;
        }
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &-icon {
          padding: 4px 3px;
          border-radius: 2px;
          margin-right: 6px;
          background: #e6f7ff;
          color: #1890ff;
          font-size: 16px;
        }
      }
      .edit-cell:nth-child(6n) {
        margin-right: none;
      }
    }
  }
  .forml-right {
    position: fixed;
    right: 0;
    top: 64px;
    width: 410px;
    height: 100%;
    padding: 22px;
    background: #fff;
    box-shadow: -2px 0 10px 0px rgba(0, 0, 0, 0.1);
    &-title {
      display: flex;
      justify-content: space-between;
      line-height: 30px;
      color: rgba(0, 0, 0, 0.85);
      font-size: 16px;
      i {
        color: rgba(0, 0, 0, 0.25);
      }
    }
    &-center {
      color: rgba(0, 0, 0, 0.3);
      font-size: 14px;
      margin: 20px 0;
      /deep/.el-form-item {
        display: flex;
        flex-direction: column;
      }
      /deep/.el-form-item__label {
        text-align: left;
        width: 100px !important;
      }
      /deep/.el-form-item__content {
        /*margin-left:100px !important;*/
      }
    }
    &-btns {
    }
  }
}
.popo-outer {
  div {
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    &:hover {
      color: #1890ff;
      background: #e6f7ff;
    }
  }
}
.el-popover {
  padding: 12px 0;
}
</style>
