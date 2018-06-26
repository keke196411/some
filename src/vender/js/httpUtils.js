import axios from 'axios'
import {Message} from 'element-ui'

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'
axios.defaults.headers.delete['Content-Type'] = 'application/json'
// 拦截请求
// axios.interceptors.request.use(config => {
//   let name = store.state.user.name
//   if (config.data) {
//     config.data['user'] = name
//   } else {
//     config.url += '?user=' + name
//   }
//   return config
// }, err => {
//   Message.error({message: '请求超时!'})
//   return Promise.resolve(err)
// })
// 拦截返回值
// axios.interceptors.response.use(data => {
//   return data
// }, err => {
//   if (err.response.status === 504 || err.response.status === 404) {
//     Message.error({message: '服务器找不到'})
//   } else if (err.response.status === 403) {
//     Message.error({message: '权限不足,请联系管理员!'})
//   } else if (err.response.status === 500) {
//     Message.error({message: '系统内部错误!'})
//   } else Message.error({message: '未知错误!'})
//   return Promise.resolve(err)
// })

let base = ''
// post
const postRequest = (url, params, callback, handle) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params
  }).then((res) => {
    callback(res)
  }).catch((error) => {
    if (handle) handle.call(this, error)
    else errorHandler.call(this, error)
  })
}
// update
const uploadFileRequest = (url, params, callback, handle) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((res) => {
    callback(res)
  }).catch((error) => {
    if (handle) handle.call(this, error)
    else errorHandler.call(this, error)
  })
}
// put 请求不拦截错误
const putRequest = (url, params, callback, handle) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params
  }).then((res) => {
    callback(res.data)
  }).catch((error) => {
    if (handle) handle.call(this, error)
    else errorHandler.call(this, error)
  })
}
// delete
const deleteRequest = (url, params, callback) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    data: params
  }
  return axios.delete(url, config).then((res) => {
    // if (errorHandler(res)) {
    //   return
    // }
    callback(res.data.data)
  })
  // return axios({
  //   method: 'delete',
  //   url: `${base}${url}`,
  //   params: params
  // }).then((res) => {
  //   if (errorHandler(res)) {
  //     return
  //   }
  //   callback(res.data.data)
  // })
}
// get
const getRequest = (url, params, callback, handle) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    params: params
  }).then((res) => {
    callback(res)
  }).catch((error) => {
    if (handle) handle.call(this, error)
    else errorHandler.call(this, error)
  })
}

const errorHandler = (error) => {
  Message({
    message: error.response ? error.response.data.message : error.message,
    type: 'error',
    duration: 3000
  })
  return true
}
export default {
  postRequest,
  getRequest,
  deleteRequest,
  putRequest,
  uploadFileRequest
}
