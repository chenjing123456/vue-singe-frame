/**
 * @description 用户信息
 * @author xiaomeng
 */
import { login, logout, getInfo } from '@api/user'
import { getToken, setToken, removeToken } from '@utils/auth'
import router, { resetRouter } from '@/router'
import userAvatar from '@/assets/setting/user-logo1.png'// 默认头像
import { setLocalStorage } from '@utils/storage'
// import { queryList } from '@api/entFile/entFile'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  username: '',
  roles: [],
  entFileTabs: [], // 企业档案权限列表
  userInfo: {
    username: '',
    name: '',
    avatar: '',
    mail: '',
    nickName: '',
    position: '',
    roleText: '', // 角色
    password: '',
    mobile: '',
    departmentText: '', // 部门
    administrationText: ''// 行政单位
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERINFO: (state, data) => {
    state.userInfo = data
  },
  SET_ENTFILETABS: (state, data) => {
    state.entFileTabs = data
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        commit('SET_TOKEN', response.access_token)
        setLocalStorage('token', response.access_token)
        setToken(response.access_token)
        resolve(response)
      }).catch(error => {
        console.error(error)
        reject(error)
      })
    })
  },
  /**
   * @description 获取企业档案的菜单权限列表
   */
  // getEntFile({ commit }) {
  //   queryList().then(response => {
  //     const res = response
  //     if (res.code == '000000') {
  //       let arr = []
  //       res ? (arr = res.filter(v => { return v.visible === 'Y' }) || []) : ''
  //       commit('SET_ENTFILETABS', arr)
  //     } else {
  //       commit('SET_ENTFILETABS', [])
  //       this.$message({
  //         message: res.mesg,
  //         type: 'error'
  //       })
  //     }
  //   })
  // },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        // console.log(data.data);

        const { username, name, description, avatar } = data

        // roles must be a non-empty array
        // if (!roleIds || roleIds.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }

        commit('SET_ROLES', ['admin'])
        commit('SET_NAME', name)
        commit('SET_USERNAME', username)
        commit('SET_USERINFO', data)
        commit('SET_AVATAR', avatar || userAvatar)
        commit('SET_INTRODUCTION', description)
        data.roles = ['admin']
        resolve(data)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        // console.log('remove router')
        location.reload()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
