import { USER_INFO } from '@/constants/index'
import pinyin from 'js-pinyin'
pinyin.setOptions({ checkPolyphone: false, charCase: 0 })

export const startsWithKey = (path, key) => {
  return path ? (path.startsWith(key) ? path : `${key}${path}`) : undefined
}
export const clearUniStorage = () => {
  uni.removeStorageSync('token')
  uni.removeStorageSync('owner')
  uni.removeStorageSync(USER_INFO)
  uni.removeStorageSync('addressType')
}
export const getUserInfo = () => {
  if (uni.getStorageSync(USER_INFO)) {
    return uni.getStorageSync(USER_INFO)
  } else {
    return {}
  }
}

export const sortByChar = (order = 'asc', props) => {
  return function (a, b) {
    if (props) {
      //return a[props].localeCompare(b[props])
      if (a[props] < b[props]) {
        return order === 'asc' ? -1 : 1
      } else if (a[props] > b[props]) {
        return order === 'asc' ? 1 : -1
      } else {
        return 0
      }
    } else {
      //return a.localeCompare(b)
      if (a < b) {
        return order === 'asc' ? -1 : 1
      } else if (a > b) {
        return order === 'asc' ? 1 : -1
      } else {
        return 0
      }
    }
  }
}

export const sortBy = (order = 'asc', props) => {
  return function (a, b) {
    if (props) {
      //return a[props].localeCompare(b[props])
      if (pinyin.getCamelChars(a[props]) < pinyin.getCamelChars(b[props])) {
        return order === 'asc' ? -1 : 1
      } else if (pinyin.getCamelChars(a[props]) > pinyin.getCamelChars(b[props])) {
        return order === 'asc' ? 1 : -1
      } else {
        return 0
      }
    } else {
      //return a.localeCompare(b)
      if (pinyin.getCamelChars(a) < pinyin.getCamelChars(b)) {
        return order === 'asc' ? -1 : 1
      } else if (pinyin.getCamelChars(a) > pinyin.getCamelChars(b)) {
        return order === 'asc' ? 1 : -1
      } else {
        return 0
      }
    }
  }
}
export const logout = () => {
  // uni.removeStorageSync(USER_INFO)
  // uni.removeStorageSync('token')
  // uni.removeStorageSync('owner')
  clearUniStorage()
}

export function formatTime(time, format) {
  let date
  if (!time) {
    date = new Date()
  } else {
    if (typeof time === 'number') {
      date = new Date(time)
    } else {
      date = new Date(time)
      if (isNaN(date.getTime())) {
        throw new Error('日期字符串无效')
      }
    }
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  format = format || 'yyyy-mm-dd h:m:s'
  format = format.replace('yyyy', year)
  format = format.replace('mm', month)
  format = format.replace('dd', day)
  format = format.replace('h', hours)
  format = format.replace('m', minutes)
  format = format.replace('s', seconds)

  return format
}

export function getDayTimeStamp() {
  // var dateTime = new Date()
  // dateTime = dateTime.setDate(dateTime.getDate() - 1)
  // const last = new Date('2023-06-21')
  // last.setHours(0, 0, 0, 0)
  // return last.getTime()

  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now.getTime()
}

export function accMul(arg1, arg2) {
  let m = 0,
    s1 = '',
    s2 = ''
  if (arg1 && arg1 != null) s1 = arg1.toString()
  if (arg2 && arg2 != null) s2 = arg2.toString()
  // console.log('m1',s2.replace('.',''))
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}

  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
}

export const getOrderStatus = (statusList = []) => {
  if (statusList.length > 0) {
    const status = statusList[0]
    if (status.indexOf('取消确认中') > -1) {
      return 'canceling'
    } else if (status.indexOf('订单取消') > -1) {
      return 'cancel'
    } else {
      return ''
    }
  } else {
    return ''
  }
}
