import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '../utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // console.log(store.getters);
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
      // config.headers['token'] = `${getToken()}`;
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//   response => {
//     const res = response.data

//     // if the custom code is not 20000, it is judged as an error.
//     if (response.status !== 200) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // to re-login
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

// 响应拦截 错误时
function resInterceptors(err) {
  const error = err.response
  // console.log('67899999999999999',err,err.response);
  if (error.status) {
    switch (error.status) {
      // 401: 未登录
      case 401:
        Message.error('未登录，请先登录')
        setTimeout(() => {
          location.href = '/login'// 登录页（pc）
        }, 2000)
        // }
        break
      // 403 token过期
      case 403:
        Message.error('登录过期，请重新登录')
        setTimeout(() => {
          location.href = '/login'
        }, 2000)
        break
      // 其他错误，直接抛出错误提示
      case 406:
        Message.error('权限不足')
        break
      case 500:
        Message.error('服务器错误')
        break
      case 503:
        Message.error('服务器繁忙')
        break
      default:
        console.log('[response error] ' + error)
    }
    // console.log(error)
    return Promise.reject(error)
  }
  // 处理 response 时发生异常（包括请求超时，但不包括服务端正常返回的 非2xx 响应）
  // console.log(error)
  return Promise.reject(error)
}

// 在响应之前拦截它们
service.interceptors.response.use(function(response) {
  return response
}, resInterceptors)

/**
 * @desc download
 * @ params {  }
 */
const download = (url, params = {}, filename, onProgress) => {
  service.request({
    url,
    method: 'get',
    params,
    headers: { 'Authorization': 'Bearer ' + getToken() },
    responseType: 'blob',
    onDownloadProgress: onProgress
  }).then(res => {
    if (!(res.data instanceof Blob)) {
      Message({
        type: 'error',
        message: '下载失败'
      })
    } else {
      const blob = res.data
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename)
      } else {
        const aEle = document.createElement('a')
        aEle.href = window.URL.createObjectURL(blob)
        if (!filename) {
          // 没传文件名，就用后台的filename， 后台也没有传就。。。。
          const res_header = res.headers['content-disposition']
          if (res_header.indexOf('fileName=') !== -1) {
            filename = res_header.split('fileName=')[1]
          } else {
            filename = res_header.split('fileName=')[1]
          }
          filename = decodeURIComponent(filename || '')
        }
        aEle.download = filename
        aEle.click()
        window.URL.revokeObjectURL(aEle.href)
      }
    }
  })
}

/**
 * upload 方式：POST Content-Type: mutipart/form-data
 * @param {*} url
 * @param {*} data
 */
const upload = (url, data, config) => {
  return new Promise(function(resolve, reject) {
    // config.headers['Authorization'] = 'Bearer ' + getToken()
    // console.log(config);
    service.post(url, data, config).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

service.downLoad = download
service.upload = upload
export default service
