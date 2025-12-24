<template>
  <view class="login-other-container">
    <view class="login-box">
      <view class="login-logo">
        <image class="logo-img" :mode="mode" src="/static/images/login-bg.png"></image>
      </view>
    </view>
    <view class="login-form">
      <view class="form-item item-flex">
        <input type="number" v-model="number" maxlength="11" placeholder="请输入帐号" />
        <!-- <text @click="getCode">{{ countTime ? countTime + 's' : '获取验证码' }}</text> -->
      </view>
      <view class="form-item">
        <input
          type="password"
          v-model="password"
          class="form-item"
          placeholder="请输入密码"
        />
      </view>
      <button type="primary" class="login-button" :disabled="!(password && number)" @click="goHome">登录</button>
      <view class="login-notice">
        您好，此服务仅限已合作商户使用，具体账户密码请联系业务员开通获取。
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useLogin } from '@/hooks/useLogin'

const number = ref('')
const password = ref('')
const mode = ref('scaleToFill')

const goHome = () => {
  uni.showLoading({})
  useLogin().login({ phone: number.value, password: password.value })
  //useLogin().login({ phone: number.value })
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
.login-notice {
  margin-top: 20upx;
  font-size: 24upx;
  color: #999;
  text-align: center;
}
</style>
