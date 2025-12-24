// 登录核心类
import { postLoginIn, getLoginUser, getOwner } from '@/api/index'
import { USER_INFO } from '@/constants/index'

export function useLogin() {
  /**
   * 登录code || name,captcha
   */
  async function login(params) {
    uni.login({
      provider: 'weixin', //使用微信登录
      success: function () {
        let ownerTip = uni.getStorageSync('share') || [
          { name: '佳妮', id: 'e42c338ca7d5429a84a61a7edceedb61' }
        ]
        getLoginUser(params)
          .then((res) => {
            uni.setStorageSync('token', res.data.token)
            if (res.data[0]) {
              //下单用户
              if(res.data[0].io1uk1w_mamswitch_m3s2 == 1) { 
                const {
                  imw6zmq_userhelp_imz2: owner,
                  id,
                  ixyi1j4_maminput_dhot: gzAddress,
                  i6c09ko_threelevel_da10_province: province,
                  i6c09ko_threelevel_da10_city: city,
                  i6c09ko_threelevel_da10_town: town
                  //i6t5xj1_maminput_2m4w: shAddress
                } = res.data[0] || {}
  
                uni.setStorageSync('token', res.data.token)
                const share = uni.getStorageSync('share')
                uni.setStorageSync(
                  'owner',
                  owner || share || [{ name: '佳妮', id: 'e42c338ca7d5429a84a61a7edceedb61' }]
                )
                uni.setStorageSync(USER_INFO, {
                  phone: params.phone,
                  id: id,
                  province,
                  city,
                  town
                })
                uni.setStorageSync('addressType', gzAddress ? 'gz' : 'sh')
                uni.reLaunch({ url: '/pages/index/index' })
              } else {
                const {
                  imw6zmq_userhelp_imz2: owner,
                } = res.data[0] || {}
                if(owner) {
                  ownerTip = owner
                }
                getOwner(ownerTip[0].name)
              }
            } else {
              getOwner(ownerTip[0].name, 'fail')
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
        /*
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
                owner || share || [{ name: '佳妮', id: 'e42c338ca7d5429a84a61a7edceedb61' }]
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
        */
      }
    })
  }

  return { login }
}
