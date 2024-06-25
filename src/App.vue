<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { useUpdate } from '@/hooks/useUpdate'
//import { useLogin } from '@/hooks/useLogin'
onLaunch(() => {
  //版本更新
  useUpdate().update()
  //静默登录
  //useLogin().login()
})
</script>

<style>
/*每个页面公共css */
</style>
