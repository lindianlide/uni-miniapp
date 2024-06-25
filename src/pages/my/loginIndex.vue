<template>
  <view class="login-home-container">
    <view class="login-box">
      <view class="login-logo">
        <image class="logo-img" src="/static/images/login-bg.png"></image>
      </view>
    </view>
    <view class="login-operate">
      <button
        type="primary"
        class="operate-item"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
      >
        一键登录
      </button>
    </view>
  </view>
</template>

<script setup>
import { useLogin } from '@/hooks/useLogin'

const getPhoneNumber = (e) => {
  if (e.detail.errMsg === 'getPhoneNumber:ok') {
    uni.showLoading({})
    useLogin().login({ code: e.detail.code })
  } else {
    uni.showToast({
      title: '获取手机号失败',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss" scoped>
.login-home-container {
  .login-box {
    margin-top: 200upx;
    text-align: center;
    .logo-img {
      width: 422upx;
      height: 38upx;
    }
  }
  .login-operate {
    margin-top: 200upx;
    text-align: center;
    padding: 0 60upx;
    .operate-item {
      height: 80upx;
      line-height: 80upx;
      + .operate-item {
        margin-top: 30upx;
      }
    }
  }
}
</style>
