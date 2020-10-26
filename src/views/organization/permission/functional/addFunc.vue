<template>
  <div class="app-card" v-if="isRouterAlive">
    <div class="card-item">
      <div class="card-head">创建功能</div>
      <div class="card-permission">
        <div class="card-center">
          <div class="func-lf">
            <div class="lf-top topCom">
              <div class="flxc">
                <svg-icon
                  icon-class="icongongnengmokuai"
                  style="font-size:22px;margin-right:10px;"
                />
                <span>功能模块</span>
              </div>
              <div class="act">
                <el-tooltip class="item" effect="dark" content="排序" placement="top">
                  <i v-bind:class="[{ active: isSort }, 'el-icon-sort']" @click="isSort = !isSort"></i>
                </el-tooltip>
                <el-popover
                  placement="bottom"
                  width="173"
                  height="105"
                  trigger="hover"
                  popper-class="menu-popper"
                >
                  <div class="node-act">
                    <div @click="reset(),isShowProp = false,isShowFloder=true">
                      <i class="el-icon-folder-opened" />
                      <span>添加文件夹</span>
                    </div>
                    <!-- <div
                      @click="reset(),menuItem.parentId = [0],isShowProp = true,isShowFloder=false"
                    >
                      <i class="el-icon-circle-plus-outline" />
                      <span>添加模块</span>
                    </div>-->
                  </div>
                  <i slot="reference" class="el-icon-circle-plus-outline add-icon" />
                </el-popover>
              </div>
            </div>
            <div class="lf-bottom">
              <el-tree
                :data="menuDefaultList"
                :props="defaultProps"
                accordion
                :highlight-current="true"
                @node-click="clickNode"
                :draggable="isSort"
                @node-drop="handleDragEnd"
                :allow-drop="allowDrop"
                class="tag-tree"
              >
                <div slot-scope="{ node, data }" class="node-item">
                  <div class="subtitle">
                    <i v-if="data.type == 'FOLDER'" class="el-icon-folder-opened"></i>
                    <i v-else class="el-icon-s-order"></i>
                    <span>{{ node.label }}</span>
                  </div>
                  <div class="more">
                    <el-popover
                      placement="bottom"
                      width="153"
                      height="105"
                      trigger="hover"
                      popper-class="menu-popper"
                    >
                      <div class="node-act">
                        <div @click.stop="()=>addDefaultMenu(data)">
                          <i class="el-icon-circle-plus-outline" />
                          <span>功能模块</span>
                        </div>
                        <div @click.stop="() => deleteMenu(data)">
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
              <div class="btn-save" @click="submitMenu()">
                <i class="iconfont iconbaocun" />
                <span>保存</span>
              </div>
            </div>
            <div class="rl-bottom">
              <div v-if="isShowProp">
                <div class="prop_item">
                  <div class="sub_title">模块属性</div>
                  <div class="sub_prop">
                    <el-form ref="form" :model="menuItem" label-width="0" :rules="rules">
                      <div class="forml-item">
                        <div class="label">
                          名称
                          <span class="required">*</span>
                        </div>
                        <el-form-item prop="name">
                          <el-input
                            v-model="menuItem.name"
                            type="text"
                            maxlength="10"
                            placeholder="请输入名称"
                            show-word-limit
                          />
                        </el-form-item>
                      </div>
                      <div class="forml-item">
                        <div class="label">上级菜单</div>
                        <el-form-item prop="parentId">
                          <el-cascader
                            :options="[{id:0,name:'root'},...menuList]"
                            v-model="menuItem.parentId"
                            :show-all-levels="false"
                            :props="props"
                            clearable
                          ></el-cascader>
                        </el-form-item>
                      </div>
                      <div class="forml-item">
                        <div class="label">链接</div>
                        <el-form-item prop="href">
                          <el-input
                            v-model="menuItem.href"
                            maxlength="100"
                            placeholder="/sys/query"
                          />
                        </el-form-item>
                      </div>
                      <div class="forml-item">
                        <div class="label">图标选择</div>
                        <div class="icon">
                          <span class="icon_box">
                            <svg-icon
                              :icon-class="menuItem.icon"
                              v-if="menuItem.iconType=='color'"
                            />
                            <i :class="['iconfont',menuItem.icon]" v-else></i>
                          </span>
                          <span>请选择该功能的图标…</span>
                          <span class="select" @click="isShowIcon = true">请选择</span>
                        </div>
                      </div>
                    </el-form>
                  </div>
                </div>
                <div class="prop_item">
                  <div class="sub_title">页面按钮</div>
                  <div class="sub_prop">
                    <div class="forml-item" style="margin-bottom:20px;">
                      <div class="label">按钮权限：</div>
                      <div class="hadBtns">
                        <el-tag
                          :key="tag.id"
                          v-for="(tag,index) in menuItem.buttons"
                          closable
                          :disable-transitions="false"
                          @close="deleteTag(index)"
                        >{{tag.name}}</el-tag>
                      </div>
                      <div class="btn-add" @click="isShowAdd = true">
                        <i class="el-icon-circle-plus-outline"></i>
                        <span>添加按钮</span>
                      </div>
                    </div>
                    <el-form
                      ref="form1"
                      class="btn-form"
                      :model="btn"
                      label-width="0"
                      :rules="btnRules"
                      v-if="isShowAdd"
                    >
                      <i class="el-icon-close" @click="closeAdd"></i>
                      <div class="forml-item">
                        <div class="label">按钮名称</div>
                        <el-form-item prop="name">
                          <el-input v-model="btn.name" maxlength="100" placeholder="请输入" />
                        </el-form-item>
                      </div>
                      <div class="forml-item">
                        <div class="label">字符串</div>
                        <el-form-item prop="href">
                          <el-input
                            v-model="btn.href"
                            maxlength="100"
                            placeholder="sys:user:query"
                          />
                        </el-form-item>
                      </div>
                      <el-button @click="confirmAddBtns('form1')" type="primary" size="small">确定</el-button>
                    </el-form>
                  </div>
                </div>
              </div>
              <div v-if="isShowFloder">
                <div class="prop_item">
                  <div class="sub_title">文件夹属性</div>
                  <div class="sub_prop">
                    <el-form ref="form2" :model="folder" label-width="0" :rules="rules">
                      <div class="forml-item">
                        <div class="label">
                          名称
                          <span class="required">*</span>
                        </div>
                        <el-form-item prop="name">
                          <el-input
                            v-model="folder.name"
                            type="text"
                            maxlength="10"
                            placeholder="请输入名称"
                            show-word-limit
                          />
                        </el-form-item>
                      </div>
                    </el-form>
                  </div>
                </div>
              </div>
              <div class="no-data-type" v-if="!isShowProp&&!isShowFloder">
                <div class="no-img"></div>
                <div class="no-text">请选择功能板块进行编辑</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="isShowIcon" width="580px" class="groupDialog">
      <span slot="title">
        <i class="el-icon-s-goods"></i>
        <span>图标选择</span>
      </span>
      <article class="func_content">
        <el-tabs v-model="activeName">
          <el-tab-pane label="多色图标" name="color">
            <div class="icon_main">
              <span
                v-for="(item,index) in iconList.color"
                :class="{'active':activeIcon===item.name}"
                :key="index"
                @click="activeIcon = item.name,iconType=activeName"
              >
                <svg-icon :icon-class="item.name" />
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="线性图标" name="line">
            <div class="icon_main">
              <span
                v-for="(item,index) in iconList.line"
                :class="{'active':activeIcon===item.name}"
                :key="index"
                @click="activeIcon = item.name,iconType=activeName"
              >
                <i :class="['iconfont',item.name]"></i>
              </span>
            </div>
          </el-tab-pane>
        </el-tabs>
      </article>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowIcon = false">取 消</el-button>
        <el-button type="primary" @click="confirmIcon">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * @description 功能权限
 * @author xiaomeng
 */
import { notEmpty, maxLength, betweenLength } from '@utils'
import { iconList } from '@constant'
import {
  getMenuList,
  getMenuDetail,
  deleteMenu,
  updateMenu,
  addMenu,
  sortMenu
} from '@api/organization/permission'
export default {
  name: 'AddFunc',
  data() {
    return {
      menuData: [],
      iconList,
      isShowFloder: false,
      btn: {
        name: '',
        href: '',
        type: 'BUTTON'
      },
      activeName: 'color', // 图标
      iconType: 'color',
      activeIcon: '',
      isShowAdd: false,
      isSort: false, // 排序可否选中的状态
      isShowProp: false,
      isRouterAlive: true,
      isShowIcon: false,
      buttons: [],
      defaultProps: {
        children: 'sonMenu',
        label: 'name'
      },
      props: {
        value: 'id',
        checkStrictly: true,
        label: 'name',
        children: 'sonMenu'
      },
      id: '', // 菜单id
      menuItem: {
        name: '',
        description: '',
        href: '',
        parentId: [],
        icon: '',
        iconType: '',
        buttons: []
      },
      folder: {
        name: '',
        type: 'FOLDER',
        parentId: [0] // 目前只有根目录才能创建文件夹
      },
      parentIds: [0], // 默认根路由0
      btnRules: {
        name: [notEmpty('按钮名称')]
      },
      menuDefaultList: [], // 菜单列表
      menuList: [], // 处理后的菜单列表
      defaultExpand: [],
      saveParentIdObj: {}, // 保存id对应的对象
      rules: {
        name: [notEmpty('名称')]
        // href: [notEmpty("链接")]
      }
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    confirmIcon() {
      this.menuItem.icon = this.activeIcon
      this.menuItem.iconType = this.iconType
      this.isShowIcon = false
    },
    /**
     * @description 是否可以拖拽
     */
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.data.level === dropNode.data.level) {
        // parentId父级节点
        if (draggingNode.data.parentId === dropNode.data.parentId) {
          return type === 'prev' || type === 'next' // type = inner是插入下级节点
        }
      } else {
        // 不同级进行处理
        return false
      }
    },
    /**
     * @description 拖拽成功事件
     */
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      const obj = {
        parentId: '',
        ids: []
      }
      obj.parentId = dropNode.data.parentId
      for (const item of dropNode.parent.childNodes) {
        obj.ids.push(item.data.id)
      }
      const ids = obj.ids.length > 0 ? obj.ids.join(',') : ''
      const con = { ...obj, ids }
      // 菜单排序
      sortMenu(con).then(response => {
        const res = response.data
        if (res.code == '000000') {
          this.reload()
          this.$message({
            message: '排序成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: res.mesg,
            type: 'error'
          })
        }
      })
    },
    /**
     * @description 点击菜单 获取菜单详情
     */
    clickNode(node, n, v) {
      const { type } = node
      if (node.id in this.saveParentIdObj) {
        // 已点击过 直接从对象取
        if (type === 'MENU') {
          this.menuItem = { ...this.saveParentIdObj[node.id] }
          this.activeIcon = this.menuItem.icon
          // 重置可选上级菜单
          this.menuList = JSON.parse(JSON.stringify(this.menuDefaultList))
          this.setDisAbled(this.menuList)
        } else {
          this.folder = { ...this.saveParentIdObj[node.id] }
        }
        this.setFalseDlo(type)
      } else {
        // 未点击过 获取后台数据
        this.getMenuDetail(node.id)
      }
    },
    /**
     * @description 设置当前菜单不可选中项 （上级菜单不可为本身）
     * @param {Array} list 菜单列表
     */
    setDisAbled(list) {
      let parentId = this.menuItem.id
      for (var i = 0; i <= list.length - 1; i++) {
        if (list[i].id === parentId) {
          list[i].disabled = true
          break
        }
        if (list[i].sonMenu && list[i].sonMenu.length > 0) {
          this.setDisAbled(list[i].sonMenu)
        }
      }
    },
    closeAdd() {
      this.isShowAdd = false
      this.btn = {
        name: '',
        href: '',
        type: 'BUTTON'
      }
    },
    /**
     * @description 添加模块事件
     */
    addDefaultMenu(node) {
      const that = this
      // 添加功能模块
      const { id, type } = node
      if (id in this.saveParentIdObj) {
        this.setDefaultParent(node)
      } else {
        // 若当前id未被点击 模拟点击事件 获取当前数据
        this.getMenuDetail(id).then(res => {
          that.setDefaultParent(node)
        })
      }
      // 重置可选上级菜单
      this.menuList = JSON.parse(JSON.stringify(this.menuDefaultList))
    },
    /**
     * @description 设置右侧数据的默认下级菜单
     */
    setDefaultParent(node) {
      const { id, type } = node
      this.reset()
      let data = JSON.stringify(this.saveParentIdObj[id])
      data = JSON.parse(data)
      if (data.parentId.length === 1 && data.parentId[0] === 0) {
        // 一级菜单
        data.parentId = [id]
      } else {
        // 其他级别菜单
        data.parentId.push(id)
      }
      this.menuItem.parentId = data.parentId
      // 根据类型判断显示隐藏
      this.setFalseDlo('MENU')
    },
    /**
     * @description 刷新页面
     */
    reload() {
      this.getMenuList()
      this.saveParentIdObj = {}
      this.isShowProp = false
      this.isShowFloder = false
    },
    /**
     * @description 重置右侧数据
     */
    reset() {
      this.menuItem = {
        name: '',
        description: '',
        href: '',
        parentId: [],
        icon: '',
        iconType: '',
        buttons: []
      }
      this.folder = {
        name: '',
        type: 'FOLDER',
        parentId: [0]
      }
    },
    /**
     * @description 删除模块按钮事件
     */
    deleteTag(index) {
      this.menuItem.buttons.splice(index, 1)
    },
    /**
     * @description 根据类型判断显示隐藏
     * @param {String} type MENU-菜单 FLODER-文件夹
     */
    setFalseDlo(type) {
      if (type == 'MENU') {
        this.isShowFloder = false
        this.isShowProp = true
      } else {
        this.isShowFloder = true
        this.isShowProp = false
      }
    },
    /**
     * @description 添加按钮
     */
    confirmAddBtns(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.menuItem.buttons.push(this.btn)
          this.closeAdd()
        } else {
          return false
        }
      })
    },
    /**
     * @description 删除模块
    */
    deleteMenu(data) {
      deleteMenu({ id: data.id }).then(response => {
        const res = response.data
        if (res.code == '000000') {
          this.reload()
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
    },
    /**
     * @description 获取详情-设置详情
    */
    setItem(data) {
      const that = this
      const { type, id } = data
      if (type === 'MENU') {
        const {
          buttons,
          description,
          name,
          href,
          icon,
          fatherMenu,
          id,
          type
        } = data
        let parentId = []
        if (fatherMenu && fatherMenu.length > 0) {
          parentId = fatherMenu.map(v => {
            return v.id
          })
        }
        const arr = icon && icon.length > 0 ? icon.split(':') : []
        const iconAcitve = arr.length > 0 ? arr[1] : '' // 第二个表示图标的名字
        that.activeIcon = iconAcitve
        that.menuItem = {
          ...that.menuItem,
          description,
          name,
          href,
          icon: iconAcitve,
          iconType: arr.length > 0 ? arr[0] : 'color', // 表示图标类型
          id,
          type,
          buttons,
          parentId: parentId.length > 0 ? parentId : [0] // 默认根路由
        }
        // 保存当前id数据到saveParentIdObj对象
        that.$set(that.saveParentIdObj, id, { ...that.menuItem })
        // 重置可选上级菜单
        this.menuList = JSON.parse(JSON.stringify(this.menuDefaultList))
        this.setDisAbled(this.menuList)
      } else {
        that.folder = { ...this.folder, ...data }
        // 保存当前id数据到saveParentIdObj对象
        that.$set(that.saveParentIdObj, id, { ...that.folder, parentId: [0] })
      }

      // 根据类型判断显示隐藏
      that.setFalseDlo(type)
    },
    /**
     * @description 根据id获取菜单详情
    */
    async getMenuDetail(id) {
      const that = this
      await new Promise(resolve => {
        getMenuDetail({ id }).then(response => {
          const { data } = response
          if (data.code === '000000') {
            if (!data.data) return
            that.setItem(data.data)
            resolve(true)
          } else {
            that.$message({
              type: 'error',
              message: data.msg
            })
          }
        })
      })
    },
    /**
     * @description 获取全部菜单
    */
    getMenuList() {
      getMenuList({ id: 0 }).then(response => {
        const res = response.data
        if (res.code == '000000') {
          this.menuDefaultList = res.data || []
          this.menuList = JSON.parse(JSON.stringify(this.menuDefaultList))
        } else {
          this.menuDefaultList = []
          this.menuList = []
          this.$message({
            message: res.mesg,
            type: 'error'
          })
        }
      })
    },
    /**
     * @description 添加模块
    */
    addMenu(formName) {
      let api = addMenu
      if (this.menuItem.id) api = updateMenu
      let con = {}
      if (formName == 'form') {
        // 菜单
        let parentId = this.menuItem.parentId
        parentId =
          parentId && parentId.length > 0 ? parentId[parentId.length - 1] : 0
        con = {
          ...this.menuItem,
          parentId,
          type: 'MENU',
          icon: this.menuItem.iconType
            ? `${this.menuItem.iconType}:${this.menuItem.icon}`
            : ''
        }
      } else if (formName == 'form2') {
        // 文件夹
        const parentId = this.folder.parentId
        con = {
          ...this.folder,
          parentId:
            parentId && parentId.length > 0 ? parentId[parentId.length - 1] : 0
        }
      }
      api(con).then(response => {
        const res = response.data
        if (res.code == '000000') {
          this.reload()
          this.$notify({
            title: '操作成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '操作失败',
            message: res.mesg,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    /**
     * @description 添加前的校验
    */
    submitMenu() {
      let formName = 'form'
      if (this.isShowProp) formName = 'form'
      if (this.isShowFloder) formName = 'form2'
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addMenu(formName)
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
.app-card {
  flex: 1;
  .card-item {
    height: 100%;
  }
  & >>> .tag-tree {
    .is-current > .el-tree-node__content {
      background: #e0e7ff;
      .title {
        color: #4d76fd;
      }
    }
    .el-tree-node__content {
      width: 100%;
      height: 40px;
      padding-right: 3px;
      font-size: 14px;
      box-sizing: border-box;
      display: flex;
      .node-item {
        flex: 1;
        width: 0;
        // width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .subtitle {
          display: flex;
          align-items: center;
          // flex: 1;
          height: 40px;
          width: 80%;
          i {
            margin-right: 8px;
          }
          .el-icon-folder-opened {
            font-size: 17px;
          }
          span {
            display: inline-block;
            width: 100%;
          }
        }
        .more {
          flex-shrink: 0;
          padding: 5px;
          .el-icon-more {
            padding: 5px 0;
          }
        }
      }
    }
  }
}

.topCom {
  min-height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
        height: 40px;
        line-height: 40px;
        width: 40px;
        text-align: center;
        color: #8da2bd;
      }
      .active {
        color: #0091ff;
        background: #eaf8ff;
      }
      i {
        font-size: 18px;
      }
      .iconshezhi {
        font-size: 19px;
        margin-right: 5px;
        color: rgba(0, 0, 0, 0.5);
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
      justify-content: flex-end;
      align-items: center;
      padding: 0 24px 0 80px;
    }
    .rl-bottom {
      @include bottomCom;
      padding: 0 24px 80px;
    }
  }
}

.prop_item {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 32px 0;
  .sub_title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 40px;
  }
  .btn-add {
    cursor: pointer;
    height: 30px;
    margin: 15px 0 15px;
    display: flex;
    align-items: center;
    color: #0091ff;
    i {
      margin-right: 8px;
      font-size: 17px;
    }
  }
  .hadBtns {
    min-height: 40px;
    width: 100%;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0 0 10px;
    & >>> .el-tag {
      margin: 0 10px 10px 0;
    }
  }
  &:nth-child(1) {
    border-top: 0;
  }
  & >>> .el-input {
    width: 294px;
  }
}
.btn-form {
  border: 1px dotted rgba(0, 0, 0, 0.15);
  padding: 40px 24px 24px;
  position: relative;
  i {
    //关闭按钮
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.25);
    cursor: pointer;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
}

.flxc {
  display: flex;
  justify-content: center;
  align-items: center;
}

.forml-item {
  .icon {
    display: flex;
    align-items: center;
    .icon_box {
      display: inline-block;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      background-color: rgba(247, 248, 249, 1);
      border: 1px solid rgba(0, 0, 0, 0.1);
      margin-right: 10px;
      font-size: 30px;
      i {
        font-size: 29px;
      }
    }
    .select {
      color: #0091ff;
      cursor: pointer;
      width: 115px;
      text-align: right;
    }
  }
}
.no-data-type {
  margin-top: 100px !important;
}
</style>
