<template>
  <view class="my-info-container">
    <view class="info-box">
      <uni-forms ref="form" border :modelValue="formInfo">
        <uni-forms-item name="name" label="姓名">
          <uni-easyinput :inputBorder="false" v-model="formInfo.name" placeholder="请输入姓名" />
        </uni-forms-item>
        <uni-forms-item name="sex" label="性别">
          <uni-data-checkbox v-model="formInfo.sex" :localdata="sexList" />
        </uni-forms-item>
        <uni-forms-item name="phone" label="手机">
          <text>{{ formInfo.phone }}</text>
        </uni-forms-item>
      </uni-forms>
      <button type="primary" class="info-button" @click="saveInfo">保存</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { getUserInfo } from '@/utils/index'

const formInfo = ref({
  name: '',
  phone: getUserInfo().mobile || '',
  sex: ''
})
const sexList = ref([
  {
    text: '男',
    value: 0
  },
  {
    text: '女',
    value: 1
  }
])

const saveInfo = () => {
  uni.switchTab({
    url: '/pages/my/myIndex'
  })
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
