import { rightFloatList } from '../constant'
/**
 * @description 数组嵌套 级联数据最后一项数据处理为null
 * @author xiaomeng
 * @param {String} childStr 数组的每个数据项里用来接收children的字段
 * @param {Array} arr 要处理的源数组
 * @return {Array} 返回处理后的数组
 */
export const handleChild = (arr, childStr) => {
  const handledArr = arr.map(item => {
    if (!item[childStr] || item[childStr].length === 0) {
      item[childStr] = null
    } else {
      const childArr = handleChild(item[childStr], childStr)
      item[childStr] = childArr
    }
    return item
  })
  return handledArr
}

/**
 * @description 删除前判断本页是否全部删除 全部删除则默认返回上一页
 * @author xiaomeng
 * @param {String} type 类型 1-批量删除 2-单个删除
 * @param {Array} list table绑定的数据项
 * @param {Array} selectArr 全选列表
 * @param {Number} currentPageNum 获取当前的列表pageNum
 * @return {Number} 页数
 */
export const getDeletePagenum = (type = 2, list = [], selectArr = [], currentPageNum = 1) => {
  let num = null
  if (type === 1) {
    // 批量
    // 全选并且不是第一页 默认回到上一页
    if (
      selectArr.length === list.length &&
      currentPageNum > 1
    ) {
      num = currentPageNum - 1
    } else {
      num = currentPageNum
    }
  } else {
    // 单个删除
    if (list.length === 1 && currentPageNum > 1) {
      num = currentPageNum - 1
    } else {
      num = currentPageNum
    }
  }
  return num
}

/**
 * @description 移除级联数组中的某一项数据
 * @author xiaomeng
 * @param {Array} list 级联源数组
 * @param {String} key 用于移除数据键值标识
 * @param {String} key 键值标识的对应值
 * @param {Number} type 1-单个匹配 2-多个匹配
 * @param {String} childStr 数组的每个数据项里用来接收children的字段
 * @return {Array} 返回处理后的数组
*/
export const getDeleteSomeList = (list = [], childStr = 'children', key = '', value = '', type = 1) => {
  for (var i = 0; i <= list.length - 1; i++) {
    if (list[i][key] == value) {
      list.splice(i, 1)
      if (type == 1) break
    } else {
      getDeleteSomeList(list[i][childStr] || [], childStr, key, value)
    }
  }
  return list
}

/**
 * @description 筛选出头部下拉的权限菜单
 * rightFloatList 表示右侧下拉菜单需要后台权限的数组列表
 * @author xiaomeng
 * @param {Array} list 级联源数组
 * @param {Array} handArr 返回处理后的数组
 * @param {String} childStr 数组的每个数据项里用来接收children的字段
*/
const rightWhiteList = ['/organization']
export const getRightFloatList = (list = [], childStr = 'children', handArr) => {
  for (var i = 0; i <= list.length - 1; i++) {
    if (rightWhiteList.includes(list[i].href)) {
      handArr.push(rightFloatList.find((v) => { return v.parentHref == list[i].href }))
      break
    } else {
      getRightFloatList(list[i][childStr] || [], childStr, handArr)
    }
  }
}
