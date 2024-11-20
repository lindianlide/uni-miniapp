// 登录核心类
import { postLoginIn } from '@/api/index'
import { USER_INFO } from '@/constants/index'

export function useLogin() {
  /**
   * 登录code || name,captcha
   */
  async function login(params) {
    uni.login({
      provider: 'weixin', //使用微信登录
      success: function () {
        postLoginIn(params)
          .then((res) => {
            if (res.code == 1) {
              const {
                imw6zmq_userhelp_imz2: owner,
                id,
                ixyi1j4_maminput_dhot: gzAddress
                //i6t5xj1_maminput_2m4w: shAddress
              } = res.data[0] || {}

              uni.setStorageSync('token', res.data.token)
              const share = uni.getStorageSync('share')
              uni.setStorageSync(
                'owner',
                owner || share || [{ name: '佳妮', id: 'ca3c868e7d4d4832a1dc13f0e2ed54bb' }]
              )
              uni.setStorageSync(USER_INFO, {
                phone: params.phone,
                id: id
              })
              uni.setStorageSync('addressType', gzAddress ? 'gz' : 'sh')
              uni.reLaunch({ url: '/pages/index/index' })
            } else {
              uni.showToast({
                icon: 'none',
                title: '登录失败'
              })
            }
            uni.hideLoading()
          })
          .catch(() => {
            uni.hideLoading()
            uni.showToast({
              icon: 'none',
              title: '登录失败'
            })
          })
      }
    })
  }

  return { login }
}
