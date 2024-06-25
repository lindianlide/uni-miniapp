<template>
  <view class="my-container">
    <view class="my-box">
      <view class="my-left">
        <image class="my-img" src="/static/images/my.png"></image>
        <view class="my-text" v-if="userInfo.phone">
          <text class="my-name">{{ userInfo.name || '微信用户' }}</text>
          <text class="my-num">{{ mobileShow }}</text>
        </view>
        <view class="my-text" v-else>
          <text class="my-login" @click="goLoginHome">点击登录</text>
        </view>
      </view>
    </view>

    <view class="info-box">
      <uni-list :border="false">
        <uni-list-item
          v-for="(infoItem, index) in infoList.filter((item) => !item.hidden)"
          :key="index"
          :border="false"
          :show-extra-icon="true"
          :to="infoItem.to"
          showArrow
          link
          :extra-icon="infoItem.extraIcon"
          :title="infoItem.label"
        />
      </uni-list>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getUserInfo } from '@/utils/index'

import { onShow } from '@dcloudio/uni-app'

const userInfo = ref(getUserInfo())

//微信用户
const infoList = ref([
  {
    label: '收获地址',
    to: '/pages/my/myAddress',
    extraIcon: { type: 'person' }
  },
  {
    label: '关于我们',
    to: '/pages/my/aboutUs',
    extraIcon: { type: 'info' }
  },
  {
    label: '系统设置',
    to: '/pages/my/mySetting',
    extraIcon: { type: 'gear' }
  }
])
onShow(() => {
  userInfo.value = getUserInfo()
})
const mobileShow = computed(() => {
  const { phone } = userInfo.value
  if (phone) {
    return '**' + phone.toString().substr(-4)
  } else {
    return '****'
  }
})

const goLoginHome = () => {
  uni.navigateTo({
    url: '/pages/my/loginOther'
  })
}
</script>

<style lang="scss" scoped>
.my-container {
  .my-box {
    padding: 80upx 40upx;
    .my-left {
      display: flex;
      .my-img {
        width: 100upx;
        height: 100upx;
      }
      .my-text {
        margin-left: 40upx;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }
  .info-box {
    padding: 0 20upx;
    .info-item {
      height: 80upx;
    }
  }
}
</style>
