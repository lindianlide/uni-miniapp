<template>
  <view class="address-detail">
    <view class="address-info">
      <uni-section title="地址信息">
        <view class="address-item item-flex">
          <text class="text-name">发货仓：</text>
          <radio-group @change="radioChange">
            <label v-for="item in addressRadio" :key="item.value">
              <radio
                style="transform: scale(0.7)"
                :value="item.value"
                :checked="item.value === currentRadio"
              />
              <text>{{ item.name }}</text>
            </label>
          </radio-group>
        </view>

        <view class="address-item item-flex">
          <text class="text-name">姓名：</text>
          <uni-easyinput
            placeholder="请填写姓名"
            v-model="name"
            :inputBorder="false"
            :clearable="false"
          />
        </view>
        <view class="address-item item-flex">
          <text class="text-name">手机号：</text>
          <uni-easyinput
            placeholder="请填写手机号"
            v-model="mobile"
            type="number"
            :inputBorder="false"
            :clearable="false"
          />
        </view>
        <view class="address-item item-flex">
          <text class="text-name">物流信息：</text>
          <uni-easyinput
            placeholder="请填写物流信息"
            v-model="address"
            :inputBorder="false"
            :clearable="false"
          />
        </view>
      </uni-section>

      <button class="address-save" type="primary" @tap="submit">保存收货地址</button>
    </view>
  </view>
</template>

<script>
import { postUserUpdate, getUserDetail } from '@/api/index'

export default {
  data() {
    return {
      id: '',
      name: '',
      mobile: '',
      address: '',
      currentRadio: 'sh',
      addressRadio: [
        {
          value: 'sh',
          name: '上海',
          checked: 'true'
        },
        {
          value: 'gz',
          name: '广州'
        }
      ]
    }
  },

  onShow: function () {
    getUserDetail().then((res) => {
      this.id = res.id || ''
      this.name = res.name || ''
      this.mobile = res.mobile || ''
      this.address = res.address || ''
      this.currentRadio = res.addressType
    })
  },
  methods: {
    radioChange(e) {
      this.currentRadio = e.detail.value
    },
    submit() {
      const params = {
        type: this.currentRadio,
        name: this.name,
        address: this.address,
        mobile: this.mobile
      }
      postUserUpdate(params).then(() => {
        uni.setStorageSync('addressType', this.currentRadio)
        uni.switchTab({
          url: '/pages/my/myIndex'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.address-detail {
  background-color: #f5f5f5;
  height: 100vh;

  .address-info {
    padding: 24upx;
  }

  .address-list {
    font-size: 32upx;
  }

  .address-item {
    padding: 0 10upx 16upx 20upx;
    height: 100upx;
    line-height: 100upx;
  }
  .item-flex {
    display: flex;
    align-items: center;
    padding-bottom: 0;
  }
  .address-save {
    font-size: 32upx;
    position: fixed;
    height: 80upx;
    line-height: 80upx;
    border-radius: 40upx;
    width: 85%;
    left: 50%;
    transform: translateX(-50%);
    bottom: 120upx;
  }
}
</style>
