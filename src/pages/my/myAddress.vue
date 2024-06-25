<template>
  <view class="address-detail">
    <view class="address-info">
      <uni-section title="地址信息">
        <view class="address-item item-flex">
          <text class="text-name">姓名：</text>
          <uni-easyinput
            placeholder="请填写姓名"
            v-model="remark"
            :inputBorder="false"
            :clearable="false"
          />
        </view>
        <view class="address-item item-flex">
          <text class="text-name">手机号：</text>
          <uni-easyinput
            placeholder="请填写手机号"
            v-model="remark"
            type="number"
            :inputBorder="false"
            :clearable="false"
          />
        </view>
        <view class="address-item item-flex">
          <text class="text-name">物流信息：</text>
          <uni-easyinput
            placeholder="请填写物流信息"
            v-model="remark"
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
export default {
  data() {
    return {
      remark: ''
    }
  },

  onShow: function () {},
  methods: {}
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
