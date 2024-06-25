<template>
  <view class="my-info-container">
    <view class="info-box">
      <uni-forms ref="form" border :modelValue="formInfo">
        <uni-forms-item name="name" label="姓名">
          <uni-easyinput
            :inputBorder="false"
            :disabled="!!userInfo.number"
            v-model="formInfo.name"
            placeholder="请输入姓名"
          />
        </uni-forms-item>
        <uni-forms-item name="number" label="工号">
          <uni-easyinput
            :inputBorder="false"
            :disabled="!!userInfo.number"
            v-model="formInfo.number"
            placeholder="请输入工号"
          />
        </uni-forms-item>
      </uni-forms>
      <button type="primary" :disabled="!!userInfo.number" class="info-button" @click="saveBind">
        认证
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { getUserInfo } from '@/utils/index'
import { onShow } from '@dcloudio/uni-app'

const formInfo = ref({
  name: '',
  number: ''
})
const userInfo = ref(getUserInfo())

onShow(() => {
  userInfo.value = getUserInfo()
  formInfo.value = {
    name: userInfo.value.name,
    number: userInfo.value.number
  }
})
const saveBind = () => {
  const params = { name: formInfo.value.name, number: formInfo.value.number }
  // uni.switchTab({
  //   url: '/pages/my/myIndex'
  // })
}
</script>

<style lang="scss" scoped>
.my-info-container {
  padding: $uni-spacing-padding-base $uni-spacing-padding-sm;
  .info-box {
    padding: 0 $uni-spacing-padding-sm;
  }
  .info-button {
    margin-top: $uni-spacing-margin-base;
  }
}
</style>
