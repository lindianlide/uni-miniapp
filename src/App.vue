<script setup>
import { onLaunch, onShow } from '@dcloudio/uni-app'
import { useUpdate } from '@/hooks/useUpdate'
//import { useLogin } from '@/hooks/useLogin'
onLaunch((options) => {
  //版本更新
  useUpdate().update()
  //静默登录
  //useLogin().login()
  //console.log('options===', options)
  const { id, name } = options.query || {}
  if (id && name) {
    uni.setStorageSync('share', [{ id, name }])
  }
})
onShow((options) => {
  const { id, name } = options.query || {}
  if (id && name) {
    uni.setStorageSync('share', [{ id, name }])
  }
})
</script>

<style>
/*每个页面公共css */
</style>
