<template>
  <view class="my-container">
    <view class="my-box">
      <view class="my-left">
        <image class="my-img" src="/static/images/cart.png"></image>
        <view class="my-text" v-if="userInfo.phone">
          <text class="my-name">{{ userInfo.name || '微信用户' }}</text>
          <text class="my-num">{{ mobileShow }}</text>
        </view>
        <view class="my-text" v-else>
          <text class="my-login" @click="goLoginHome">点击登录</text>
        </view>
      </view>
    </view>

    <view class="info-container">
      <uni-section title="常用操作">
        <view class="info-box">
          <view
            class="info-item"
            v-for="(infoItem, index) in infoList.filter((item) => !item.hidden)"
            :key="index"
            @click="goDetail(infoItem.to)"
          >
            <uni-icons :type="infoItem.extraIcon.type" size="22"></uni-icons>
            <text>{{ infoItem.label }}</text>
          </view>
        </view>
      </uni-section>
    </view>

    <view class="calendar-container">
      <uni-section title="订货日历">
        <view class="calendar-box">
          <uni-calendar
            :insert="true"
            :lunar="false"
            :showMonth="false"
            :selected="calendarInfo.selected"
          />
        </view>
      </uni-section>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getUserInfo } from '@/utils/index'
import { getOrderList } from '@/api/index'

import { onShow, onLoad } from '@dcloudio/uni-app'

const userInfo = ref(getUserInfo())
//微信用户
const infoList = ref([
  {
    label: '收获地址',
    to: '/pages/my/myAddress',
    extraIcon: { type: 'person' }
  },
  {
    label: '客户需求',
    to: '/pages/my/customerNeed',
    extraIcon: { type: 'mic' }
  },
  {
    label: '商务合作',
    to: '/pages/my/businessCooperate',
    extraIcon: { type: 'chat' }
  },
  {
    label: '投诉反馈',
    to: '/pages/my/mySuggestion',
    extraIcon: { type: 'help' }
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

const calendarInfo = ref({
  selected: []
})
onLoad(() => {
  getOrderList().then((res) => {
    const selected = []
    res.forEach((order) => {
      const dateList = calendarInfo.value.selected.map((select) => select.date)
      if (dateList.indexOf(order.date) === -1) {
        selected.push({
          date: order.date,
          info: '订货'
        })
      }
    })
    calendarInfo.value.selected = selected
  })
})
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
const goDetail = (url) => {
  uni.navigateTo({
    url: url
  })
}
const goLoginHome = () => {
  uni.navigateTo({
    url: '/pages/my/loginOther'
  })
}
</script>

<style lang="scss" scoped>
.my-container {
  .my-box {
    padding: 40upx 40upx;
    .my-left {
      display: flex;
      .my-img {
        width: 100upx;
        height: 100upx;
        border-radius: 50upx;
        padding: 4upx;
        border: 2upx solid #f5f5f5;
      }
      .my-text {
        margin-left: 40upx;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }
  .info-container {
    padding: 0 30upx;
    .info-box {
      display: flex;
      flex-wrap: wrap;
      font-size: 28upx;

      .info-item {
        border-radius: 8upx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 140upx;
        height: 140upx;
        background-color: #f5f5f580;
        margin-right: 20upx;
        margin-top: 10upx;
      }
    }
  }
  .calendar-container {
    margin-top: 20upx;
    padding: 0 30upx;
    font-size: 24upx;
    ::v-deep .uni-calendar-item__weeks-box-item {
      width: 80upx;
      height: 80upx;
    }
  }

  ::v-deep .uni-section-content {
    padding: 0 20upx;
  }
  ::v-deep .uni-section-header {
    font-weight: bold;
    font-size: 34upx;
  }
}
</style>
