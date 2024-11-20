<template>
  <view class="need-detail">
    <view class="need-info">
      <uni-section title="投诉建议">
        <view class="need-item item-flex">
          <text class="text-name">投诉建议：</text>
          <uni-easyinput
            type="textarea"
            autoHeight
            maxlength="200"
            placeholder="请填写投诉建议"
            v-model="content"
            :inputBorder="false"
            :clearable="false"
          />
        </view>
        <view class="need-item item-flex">
          <text class="text-name">手机号：</text>
          <uni-easyinput
            placeholder="请填写手机号"
            v-model="mobile"
            type="number"
            :inputBorder="false"
            :clearable="false"
          />
        </view>
      </uni-section>

      <button class="need-save" type="primary" @tap="submit">提交</button>
    </view>
  </view>
</template>

<script>
import { postMySuggestionAdd } from '@/api/index'
export default {
  data() {
    return {
      content: '',
      mobile: ''
    }
  },

  onShow: function () {},
  methods: {
    submit() {
      const params = {
        content: this.content,
        mobile: this.mobile
      }
      postMySuggestionAdd(params).then(() => {
        uni.switchTab({
          url: '/pages/my/myIndex'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.need-detail {
  background-color: #f5f5f5;
  height: 100vh;

  .need-info {
    padding: 24upx;
  }

  .need-list {
    font-size: 32upx;
  }

  .need-item {
    padding: 0 10upx 16upx 20upx;
    //height: 100upx;
    line-height: 100upx;
  }
  .item-flex {
    display: flex;
    align-items: center;
    padding-bottom: 0;
  }
  .need-save {
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
