/**
 * @description 全局路由权限
 * @author xiaomeng
 */

// asyncRoutes 前台需要获取权限的总路由
import { asyncRoutes, constantRoutes } from '@/router'
import { getUserMenu } from '@api/user.js'
import { constantWhiteRouters } from '@constant'
var asscces = []
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
// export function filterAsyncRoutes(routes, roles) {
//   const res = []

//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })
//   return res
// }

/**
 * @description 设置当前应用平台名,可拿到当前的路由对象
 * constantWhiteRouters 不用进行后台筛选的路由
 * 解决刷新页面 获取当前router所在应用台的问题
 * @param {Array} accessedRoutes - 前端动态路由表
*/
export function getcurrentRoute(accessedRoutes, commit) {
  // 解决刷新页面 获取当前router所在应用台的问题
  let hash = decodeURIComponent(window.location.hash)
  let name = ''; let path = ''
  if (hash.includes('redirect=')) { // 重定向
    path = hash.split('/')[2]
  } else {
    path = hash.split('/')[1]
  }
  if (path && !constantWhiteRouters.includes(path)) {
    let route = accessedRoutes.find(v => {
      return v.path === '/' + path
    })
    name = route ? route.meta.title : '应用台'
  } else if (constantWhiteRouters.includes(path)) {
    name = '个人中心'
  } else {
    name = '应用台'
  }
  commit('SET_CURRENTROUTE', name)
  commit('SET_CURRENTPATH', path)
}

/**
 * @description 处理后台获取的权限列表，筛选出最终需要的前端路由列表
 * @param {Array} menuList - 后台获取的权限菜单列表
 * @param {Array} asyncRoutes - 前端需要筛选的动态路由列表
 * @param {Array} asscces - 根据权限筛选后最终获取的前端路由列表
*/
export function filterAsyncRoutes2(menuList, asyncRoutes, asscces = []) {

  menuList.forEach(route => {
    const tmp = { ...route }
    let currentAsyn
    // if (currentAsyn.path === '/microPage' || currentAsyn.path === 'microPage') {
    //   currentAsyn = {

    //   }
    // } else
    {
      currentAsyn = asyncRoutes.find((v) => {
        return tmp.href && tmp.href === v.path
      })
    }

    if (currentAsyn) {
      if (!currentAsyn.sons) currentAsyn.sons = []
      if (!currentAsyn.orderNum) currentAsyn.orderNum = tmp.orderNum
      if (currentAsyn.meta) {
        currentAsyn.meta.customizeIcon = tmp.icon
        currentAsyn.meta.title = tmp.name
      }
      // asscces.push({ ...currentAsyn, orderNum: tmp.orderNum })
      // 1.根据orderNum先菜单排序
      if (asscces.length === 0) {
        asscces.push(currentAsyn)
      } else {
        for (var i = 0; i < asscces.length; i++) {
          if (currentAsyn.orderNum < asscces[i].orderNum) {
            asscces.splice(i, 0, currentAsyn)
            break
          } else {
            asscces.push(currentAsyn)
            break
          }
        }
      }

      if (currentAsyn.path === '/microPage' || currentAsyn.path === 'microPage') {
        // 嵌入页面构建菜单， 且不用递归menuList
        generatorDeepOfMicroMenu(tmp, currentAsyn)
        return
      }

      if (tmp.sonMenu) {
        filterAsyncRoutes2(tmp.sonMenu, currentAsyn.children || [], currentAsyn.sons)

        // 2.判断路由默认的redirect的路由是否有权限，如果没有顺延redirect到第一个
        if (currentAsyn.redirect && currentAsyn.sons.length > 0) {
          let redirectRoute = currentAsyn.sons.find(v => { return v.path === currentAsyn.redirect })
          if (!redirectRoute) currentAsyn.redirect = currentAsyn.sons[0].path
        }
      }
    }
  })

  // 404页面 必须再动态路由最后面加上
  // res.push({ path: '*', redirect: '/404', hidden: true })
  // return
}

function generatorDeepOfMicroMenu(base, asynRoute) {
  console.log(JSON.stringify(base), asynRoute)
  let sons = []
  if (Array.isArray(base.sonMenu)) {
    base.sonMenu.forEach((v, idx) => {
      let curRoute = {
        path: v.path || v.href,
        meta: {
          title: v.name,
          icon: 'permission'
        }
      }

      if (v.sonMenu) generatorDeepOfMicroMenu(v, curRoute)
      sons[idx] = curRoute
    })
  }

  console.log()

  asynRoute.sons = sons
}

/**
 * @description 获取路径的参数，处理参数再拼接到地址
 * @param {String/Object} query - 路径的参数
 * @returns {String} 返回拼接好的路径参数
*/
export const getHrefQuery = (query) => {
  if (query instanceof Object) {
    return Object.keys(query).reduce((acc, cur, curIndex) => {
      if (curIndex !== 0) {
        acc += `&${cur}=${query[cur]}`
      } else {
        acc += `?${cur}=${query[cur]}`
      }
      return acc
    }, '')
  } else if (typeof query == 'string') {
    return query
  }
}

const state = {
  routes: [],
  appHeaderRoutes: [], // 头部应用的路由列表 - 用于头部切换应用
  currentRoute: '', // 当前应用名 - 用于筛选当前应用的路由对象
  currentPath: '',
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    // constantRoutes-固定存在的路由  addRoutes- （过滤权限后的后台路由）
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_CURRENTROUTE: (state, name) => {
    state.currentRoute = name
  },
  SET_CURRENTPATH: (state, path) => {
    state.currentPath = path
  },
  SET_APPHEADERROUTES: (state, routes) => {
    state.appHeaderRoutes = routes
  }
}

const actions = {
  setCurrentRoue({ commit }, item) {
    commit('SET_CURRENTROUTE', item.name)
    commit('SET_CURRENTPATH', item.path)
    const { origin, pathname } = window.location
    let queryString = getHrefQuery(item.query)
    if (item.query) {
      window.location.href = `${origin}${pathname}#${item.href}${queryString}`
    } else {
      window.location.href = `${origin}${pathname}#${item.href}`
    }
  },
  generateRoutes({ commit }, roles) {
    /** 方案1.
     * 根据roles(角色的列表) 过滤出动态路由 - 原方案
     * */
    // return new Promise(resolve => {
    //   let accessedRoutes;
    //   if (roles.includes('admin')) { //管理员可以看全部的asyncRoutes
    //     accessedRoutes = asyncRoutes || []
    //   } else { //其他成员只能看过滤权限后的
    //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    //   }
    //   //设置当前应用平台名 - 可拿到当前的路由对象
    //   let name = accessedRoutes.length>0 ? accessedRoutes[0].meta.title : '系统设置';
    //   commit('SET_ROUTES', accessedRoutes)
    //   commit('SET_CURRENTROUTE',name)
    //   resolve(accessedRoutes)
    // })

    /**
     * 方案2.-现在使用
     * 后台根据不同角色返回权限列表
     * 前端再与asyncRoutes对比，过滤出本用户可查看的菜单权限accessedRoutes
     * 再返回给addRoutes ；再通过router.addRoutes(accessRoutes)动态添加进router
     * */
    return new Promise((resolve, reject) => {
      getUserMenu().then(response => {
        const res = response.data
        let menuList = []; let accessedRoutes = []
        if (response.code == '000000') {
          menuList = res || []
        } else {
          menuList = []
        }
        // console.log(menuList)
        // 设置头部应用的路由列表
        commit('SET_APPHEADERROUTES', menuList)
        // 过滤出文件夹以外的菜单列表（二维变一维数组）
        const menus = menuList.reduce((prev, cur, index) => {
          if (cur.sonMenu && cur.sonMenu.length > 0) {
            return prev.concat(cur.sonMenu)
          } else {
            return prev.concat([])
          }
        }, [], 0)
        // console.log(menus)
        filterAsyncRoutes2(menus, asyncRoutes, accessedRoutes)

        console.log(accessedRoutes)
        // 404页面 必须再动态路由最后面加上
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        // console.log(accessedRoutes)
        commit('SET_ROUTES', accessedRoutes)
        // 设置当前应用平台名 - 可拿到当前的路由对象
        getcurrentRoute(accessedRoutes, commit)
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
