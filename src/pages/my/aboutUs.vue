<template>
  <view class="about-container">
    <view class="about-box">
      <view class="about-logo">
        <image class="logo-img" src="/static/images/logo.png"></image>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { getForms } from '@/api/core/index'

onMounted(() => {
  getForms({ miniapp: true, category: 'WECHAT' }).then((res) => {})
})
</script>

<style lang="scss" scoped>
.about-container {
  .about-box {
    margin-top: 400upx;
    text-align: center;
    .logo-img {
      width: 422upx;
      height: 38upx;
    }
  }
}
</style>
