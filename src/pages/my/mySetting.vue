<template>
  <view class="my-setting-container">
    <view class="setting-box">
      <uni-list :border="false">
        <uni-list-item
          v-for="(setItem, index) in settingList"
          :key="index"
          :border="false"
          :title="setItem.label"
          :rightText="setItem.rightText"
        />
      </uni-list>
      <button v-if="userInfo.id" type="info" class="setting-button" @click="goLoginout">
        退出登录
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { getUserInfo, logout } from '@/utils/index'
import { onShow } from '@dcloudio/uni-app'
const userInfo = ref(getUserInfo())
const settingList = ref([])

onShow(() => {
  userInfo.value = getUserInfo()
  settingList.value = [
    {
      label: '绑定手机号',
      rightText: userInfo.value.phone
    },
    {
      label: '版本号',
      rightText: uni.getSystemInfoSync().appVersion
    }
  ]
})

const goLoginout = () => {
  logout()
  uni.switchTab({
    url: '/pages/my/myIndex'
  })
}
</script>

<style lang="scss" scoped>
.my-setting-container {
  padding: $uni-spacing-padding-base $uni-spacing-padding-sm;
  .setting-box {
    padding: 0 $uni-spacing-padding-sm;
  }
  .setting-button {
    margin-top: $uni-spacing-margin-base;
  }
}
</style>
