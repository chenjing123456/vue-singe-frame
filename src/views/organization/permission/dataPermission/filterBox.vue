<template>
  <div class="filter_box">
    <div
      class="filter_content"
      v-if="activeName ==='枚举值' && (dataType ==='text'||dataType ==='num')"
    >
      <div class="check_header" v-if="enumsList.length>0">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <span>{{dataType ==='text'?'文本':'数值'}}</span>
      </div>
      <el-checkbox-group v-model="checkedList" @change="handleCheckedCitiesChange" class="group">
        <el-checkbox v-for="item in enumsList" :label="item" :key="item">{{item}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="filter_content" v-if="activeName ==='自定义' && dataType ==='date'">
      <div class="block">
        <span class="demonstration">过滤条件：</span>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          clearable
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
    </div>
    <div class="filter_content" v-if="activeName ==='自定义' && dataType ==='dateTime'">
      <div class="block">
        <span class="demonstration">过滤条件：</span>
        <el-date-picker
          v-model="dateTime"
          value-format="yyyy-MM-dd hh:mm:ss"
          type="datetimerange"
          range-separator="至"
          clearable
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
    </div>
    <div class="filter_content" v-if="activeName ==='自定义' && dataType ==='text'">
      <span>过滤条件：</span>
      <el-select v-model="conditionText" placeholder="请选择">
        <el-option
          v-for="item in conditionData"
          :key="item.key"
          :label="item.name"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-input v-model="text" placeholder="请输入中间字"></el-input>
    </div>
    <div class="filter_content" v-if="activeName ==='自定义' && dataType ==='num'">
      <span>过滤条件：</span>
      <el-select v-model="conditionNum" placeholder="请选择">
        <el-option
          v-for="item in conditionData"
          :key="item.key"
          :label="item.name"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-input v-model.number="num" type="number" placeholder="请输入数值"></el-input>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dateTime: '',
      date: '',
      text: '',
      num: '',
      conditionText: '',
      conditionNum: '',
      tableData: [],
      checkedList: [],
      checkAll: false,
      isIndeterminate: false
    }
  },
  props: [
    'activeName',
    'dataType',
    'conditionData',
    'enumsList',
    'defaultFilterData'
  ],
  mounted() {
    this.setDefaultData(this.defaultFilterData)
  },
  watch: {
    defaultFilterData: {
      deep: true,
      handler(val) {
        this.setDefaultData(val)
      }
    }
  },
  methods: {
    setDefaultData(val) {
      this.reset() // 先重置数据
      const value = val.value
      if (val.condition && val.condition == 'in') {
        // 存在并in --枚举值
        if (value.length > 0) {
          // 设置默认选中
          const checkedCount = value.length
          this.checkAll = checkedCount === this.enumsList.length
          this.isIndeterminate =
            checkedCount > 0 && checkedCount < this.enumsList.length
          this.checkedList = value
        }
      } else if (val.condition) {
        // 存在 -- 自定义
        if (this.dataType == 'num') {
          this.num = value
          this.conditionNum = val.condition
        } else if (this.dataType == 'text') {
          this.text = value
          this.conditionText = val.condition
        } else if (this.dataType == 'date') {
          this.date = value && value.length > 0 ? value : []
        } else if (this.dataType == 'dateTime') {
          this.dateTime = value && value.length > 0 ? value : []
        }
      } else {
        // 不存在-初始化
      }
    },
    reset() {
      // 重置
      this.text = ''
      this.num = ''
      this.date = []
      this.dateTime = []
      this.conditionText = ''
      this.conditionNum = ''
      this.checkAll = false
      this.isIndeterminate = false
      this.checkedList = []
    },
    handleCheckAllChange(value) {
      this.checkedList = value ? this.enumsList : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.enumsList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.enumsList.length
    },
    // 保存数据到本地
    saveData() {
      let condition = ''
      let value = ''
      if (this.activeName == '自定义') {
        if (this.dataType == 'num') {
          // 数值的自定义
          if (!this.num || !this.conditionNum) {
            this.$message({ type: 'warning', message: '请填写必填项' })
            return
          } else {
            condition = this.conditionNum
            value = this.num
            this.checkedList = []
            this.isIndeterminate = false
            this.checkAll = false
          }
        } else if (this.dataType == 'text') {
          // 文本的自定义
          if (!this.text || !this.conditionText) {
            this.$message({ type: 'warning', message: '请填写必填项' })
            return
          } else {
            condition = this.conditionText
            value = this.text
            this.checkedList = []
            this.isIndeterminate = false
            this.checkAll = false
          }
        } else {
          // 时间的自定义
          condition = 'between'
          value = this.dataType == 'date' ? this.date : this.dateTime
        }
      } else {
        // 枚举值
        if (this.checkedList.length <= 0) {
          this.$message({ type: 'warning', message: '请至少选择一项' })
          return
        } else {
          condition = 'in'
          value = this.checkedList
          this.num = ''
          this.text = ''
          this.conditionText = ''
          this.conditionNum = ''
        }
      }
      return {
        condition,
        value
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@styles/variables.scss";
.filter_box {
  position: relative;
  height: calc(100% - 60px);
  padding: 20px 30px 50px;
  overflow: hidden;
  & >>> .el-date-editor .el-range-separator {
    width: 7%;
  }
  & >>> .el-input {
    width: 140px;
  }
  .filter_content {
    height: 100%;
    @include bottomCom;
  }
}
.group {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  & >>> .el-checkbox {
    display: flex;
    justify-content: space-between;
    height: 40px;
    align-items: center;
    border-bottom: 1px solid #ebebeb;
    margin: 0;
    &.is-checked {
      margin: 0;
    }
  }
}
.check_header {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebebeb;
}
</style>
