<template>
  <view class="login-other-container">
    <view class="login-box">
      <view class="login-logo">
        <image class="logo-img" :mode="mode" src="/static/images/login-bg.png"></image>
      </view>
    </view>
    <view class="login-form">
      <view class="form-item item-flex">
        <input type="number" v-model="number" maxlength="11" placeholder="请输入手机号" />
        <!-- <text @click="getCode">{{ countTime ? countTime + 's' : '获取验证码' }}</text> -->
      </view>
      <!-- <view class="form-item">
        <input
          type="number"
          v-model="verifyCode"
          :maxlength="verifyCodeLength"
          class="form-item"
          placeholder="请输入验证码"
        />
      </view> -->
      <button type="primary" class="login-button" @click="goHome">登录</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useLogin } from '@/hooks/useLogin'

const number = ref('')
const mode = ref('scaleToFill')

const goHome = () => {
  uni.showLoading({})
  useLogin().login({ phone: number.value })
}
</script>

<style lang="scss" scoped>
.login-other-container {
  .login-box {
    text-align: center;
    .logo-img {
      width: 100%;
      height: 550upx;
    }
  }
  .login-form {
    margin-top: 200upx;
    padding: 0 60upx;
    .form-item {
      height: 60upx;
      line-height: 60upx;

      border-bottom: 2upx solid #eee;
      &.item-flex {
        display: flex;
        justify-content: space-between;
      }

      + .form-item {
        margin-top: 30upx;
      }
    }
    .login-button {
      margin-top: 100upx;
    }
  }
}
</style>
