import request from './request'
import axios from './axios.decoration.js'
export function login(data) {
  const form = {
    username: data.username,
    password: data.password,
    grant_type: 'password',
    scope: 'read'
  }
  return axios.request({
    url: '/authentication-server/oauth/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic dGVzdF9jbGllbnQ6dGVzdF9zZWNyZXQ='
    },
    method: 'post',
    params: form
  })
  // return axios.post('/authentication-server/oauth/token',form)
}

// export function getInfo(token) {
//   return axios.get('/organization/user')
// }

export function getInfo(token) {
  return axios.get('/organization/userInfo/currentUser')
}

export function logout() {
  return Promise.resolve({
    code: '000000',
    mesg: '成功',
    time: new Date()
  })
}


export function getUserMenu(params) {
  return axios.get('/organization/userInfo/getUserMenu', params);
}