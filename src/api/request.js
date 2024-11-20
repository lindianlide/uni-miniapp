import { clearUniStorage } from '@/utils'
const baseURL = 'https://madan.dayangjingzhou.top/api'

const request = (
  method,
  url,
  data,
  { showLoading = false, hideToast = false, needToken = true, errorShow = true } = {}
) => {
  return new Promise((resolve) => {
    showLoading && uni.showLoading({ mask: true })
    let token = uni.getStorageSync('token')
    if (!token && needToken) {
      //uni.showToast({ title: '请先登录', icon: 'none' })
      clearUniStorage()
      uni.reLaunch({ url: '/pages/my/loginOther' })
      return
    }
    if (needToken && token) {
      data.token = token
    }
    if (method == 'POST') {
      if (url.indexOf('?') > -1) {
        url = url + '&token=' + token
      } else {
        url = url + '?token=' + token
      }
    }
    uni.request({
      url: baseURL + url,
      method: method,
      data,
      header: { 'content-type': 'application/json', __token__: data.token },
      success: (res) => {
        showLoading && uni.hideLoading()
        if (res.data.code == 401) {
          uni.showToast({ title: '登录过期', icon: 'none' })
          clearUniStorage()
          setTimeout(() => {
            uni.reLaunch({ url: '/pages/my/loginOther' })
          }, 300)
          return
        }
        if (res.data.code === 0 && !hideToast) {
          if (
            res.data.msg === '未找到用户' ||
            res.data.msg ===
              '由于检测到您的使用与平台运营协议违背，现对您的账号做封停处理，如有疑问请咨询客服'
          ) {
            clearUniStorage()
            uni.reLaunch({ url: '/pages/my/loginOther' })
          }
          errorShow &&
            uni.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2500
            })
          resolve(res.data)
        } else {
          resolve(res.data)
        }
      },
      fail: (err) => {
        showLoading && uni.hideLoading()
        resolve(err)
      }
    })
  })
}
export { request, baseURL }
