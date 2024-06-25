<template>
  <view class="order-detail">
    <view class="order-notice"> 注：三文鱼价格不计入总价，具体价钱与业务员核实 </view>
    <view class="order-info">
      <uni-section title="地址信息">
        <view class="order-item item-flex">
          <text class="text-name">姓名：</text>
          <uni-easyinput
            placeholder="请填写姓名"
            v-model="userName"
            :inputBorder="false"
            :clearable="false"
          />
        </view>
        <view class="order-item item-flex">
          <text class="text-name">手机号：</text>
          <uni-easyinput
            placeholder="请填写手机号"
            v-model="userPhone"
            :inputBorder="false"
            type="number"
            :clearable="false"
          />
        </view>
        <view class="order-item item-flex">
          <text class="text-name">物流信息：</text>
          <uni-easyinput
            placeholder="请填写物流信息"
            v-model="userAddress"
            :inputBorder="false"
            :clearable="false"
          />
        </view>
      </uni-section>

      <uni-section title="订单详情">
        <view class="order-item order-list">
          <view class="list-text" v-for="(item, index) in orderList" :key="index">
            <text class="text-name">{{ item.name }}</text>
            <text class="text-count">x{{ item.count }}</text>
            <text class="text-price">￥{{ item.price }}</text>
          </view>
        </view>
      </uni-section>

      <uni-section title="订单备注">
        <view class="order-item">
          <uni-easyinput
            type="textarea"
            autoHeight
            maxlength="40"
            placeholder="请填写订单备注信息"
            v-model="remark"
            :inputBorder="false"
            :clearable="false"
          />
        </view>
      </uni-section>
    </view>
    <view class="order-button">
      <view class="order-total">
        共{{ getAllCount }}件，合计 <text class="total-price">￥{{ getAllPrice }}</text>
      </view>
      <button class="order-save" type="primary" @tap="submitOrder">提交订单</button>
    </view>
  </view>
</template>

<script>
import { useAppStore } from '@/stores/modules/app'

import { postOrderAdd } from '@/api/index'
import { accMul } from '@/utils/index'

export default {
  data() {
    return {
      orderList: [],
      userName: '',
      userPhone: '',
      userAddress: '',
      remark: ''
    }
  },
  computed: {
    // 获得购物车所有商品数量
    getAllCount() {
      let result = 0
      this.orderList.forEach((shop) => {
        result += shop.count
      })
      return result
    },
    // 总价
    getAllPrice() {
      let result = 0
      let result1 = 0
      this.orderList?.forEach((shop) => {
        result1 += accMul(shop.count, shop.price)
        result = result1.toFixed(2)
      })
      return result
    }
  },
  onShow: function () {
    this.orderList = useAppStore().orderList
    // this.orderDetInfo=JSON.parse(getApp().globalData.orderDetInfo);
    // this.orderDetInfo = JSON.parse(getApp().globalData.orderDetInfo)
    // console.log(this.orderDetInfo, JSON.parse(getApp().globalData.orderDetInfo))
    // this.buylist = JSON.parse(JSON.parse(getApp().globalData.orderDetInfo).buyList)
    console.log(useAppStore().orderList)
    // this.buylist = JSON.parse(getApp().globalData.orderDetInfo.buylist)

    console.log(1111, uni.getStorageSync('ownerName'))
  },
  methods: {
    submitOrder() {
      this.orderList.forEach((order) => {
        const params = {
          userName: this.userName,
          userPhone: this.userPhone,
          userAddress: this.userAddress,
          remark: this.remark,
          price: order.price,
          count: order.count,
          name: order.name
        }
        postOrderAdd(params).then()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  background-color: #f5f5f5;
  height: 100vh;

  .order-info {
    padding: 24upx;
  }
  .order-notice {
    width: 90%;
    margin: 0 auto;
    color: #f56c6c;
    font-size: 28upx;
  }
  .order-list {
    font-size: 28upx;

    .list-text {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      height: 60upx;
      line-height: 60upx;
    }
    .text-name {
      flex: 3;
      text-align: left;
      width: 67%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .text-count {
      font-size: 28upx;
      width: 60upx;
      color: #595959;
    }
    .text-price {
      flex: 1;
      text-align: right;
    }
  }

  .order-item {
    padding: 0 10upx 16upx 20upx;
  }
  .item-flex {
    display: flex;
    align-items: center;
    padding-bottom: 0;
  }

  .order-button {
    padding: 16upx 16upx 60upx 16upx;
    position: fixed;
    bottom: 0upx;
    width: 100%;
    display: flex;
    background-color: #fff;
    justify-content: space-between;
    justify-items: center;

    .order-total {
      font-size: 32upx;
      text-align: right;
      background-color: #fff;
      padding: 0 10upx 16upx 20upx;

      .total-price {
        color: red;
        font-size: 38upx;
      }
    }

    .order-save {
      border-radius: 40upx;
      margin-right: 40upx;
      font-size: 32upx;
      display: inline-block;
      width: 180upx;
      height: 60upx;
      line-height: 60upx;
      white-space: nowrap;
    }
  }
}
</style>
