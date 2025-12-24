<template>
  <view class="order-detail">
    <!-- <view class="order-notice"> 注：三文鱼价格不计入总价，具体价钱与业务员核实 </view> -->
    <view class="order-info">
      <uni-section title="地址信息" v-if="userShopList.length>0">
        <!-- <view class="order-item item-flex">
          <view>
            <text class="is-required">*</text>
            <text class="text-name">姓名：</text>
          </view>
          <uni-easyinput
            placeholder="请填写姓名"
            v-model="userName"
            disabled
            :inputBorder="false"
            :clearable="false"
          />
        </view>
        <view class="order-item item-flex">
          <view>
            <text class="is-required">*</text>
            <text class="text-name">手机号：</text>
          </view>
          <uni-easyinput
            placeholder="请填写手机号"
            disabled
            v-model="userPhone"
            :inputBorder="false"
            type="number"
            :clearable="false"
          />
        </view>
        <view class="order-item item-flex">
          <view>
            <text class="is-required">*</text>
            <text class="text-name">物流信息：</text>
          </view>
          <uni-easyinput
            placeholder="请填写物流信息"
            disabled
            v-model="userAddress"
            :inputBorder="false"
            :clearable="false"
          />
        </view> -->
       <view class="order-item item-flex" v-if="userShopList.length>0">
          <view>
            <text class="text-name">分店信息：</text>
          </view>
          <uni-data-select
          style="width: 60%;"
            v-model="userShop"
            :localdata="userShopList"
          ></uni-data-select>
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
import { postOrderAdd, getUserDetail, getUserShopList, postUserUpdate } from '@/api/index'
import { accMul } from '@/utils/index'

export default {
  data() {
    return {
      orderList: [],
      userName: '',
      userPhone: '',
      userAddress: '',
      userShop: '',
      userShopList: [],
      userCity: '',
      remark: '',
      addressType: ''
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
  onLoad: function (options) {
    this.addressType = options.addressType || 'sh'
  },
  onShow: function () {
    this.orderList = useAppStore().orderList
    getUserDetail().then((res) => {
      this.userName = res.name || ''
      this.userPhone = res.addressMobile || ''
      this.userAddress = res.address || ''
      this.userCity = res.city || ''
    })

    getUserShopList().then((res) => {
      this.userShopList = res.map((item) => {
        return { text: item.shopName, value: item.shopName, ...item }
      })
      //console.log('getUserShopList',this.userShopList)
    })
  },
  methods: {
    submitOrder() {
      if(this.userShop) {
        const res = this.userShopList.find((item) => item.value == this.userShop)
        this.userAddress = res?.address || ''
        this.userName = res?.name || ''
        this.userPhone = res?.mobile || ''
      }
      if (!this.userName) {
        uni.showToast({ title: '请联系业务员维护收货姓名！', icon: 'none' })
        return
      }
      // const params = {
      //   type: this.addressType,
      //   name: this.userName,
      //   address: this.userAddress,
      //   mobile: this.userPhone
      // }
      // postUserUpdate(params).then(() => {
      //   uni.setStorageSync('addressType', this.addressType)
      // })

      this.orderList.forEach((order, index) => {
        const params = {
          userName: this.userName,
          userPhone: this.userPhone,
          userAddress: this.userAddress,
          userCity: this.userCity,
          userShop: this.userShop,
          remark: this.remark,
          price: order.price,
          count: order.count,
          id: order.id,
          name: order.name,
          category: order.category,
          supply: order.supply,
          costPrice: order.costPrice,
          orderRelative:order.orderRelative,//下单关联 1
          productFx1:order.productFx1,//产品分析1
          productFx2:order.productFx2,//产品分析2
          productFx3:order.productFx3,//产品分析3
          productFx4:order.productFx4,//产品分析4
          productDes:order.productDes,//产品说明
        }
        
        postOrderAdd(params)
          .then(() => {})
          .finally(() => {
            if (index === this.orderList.length - 1)
              uni.reLaunch({
                url: '/pages/index/index'
              })
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  background-color: #f5f5f5;
  height: 100vh;

  .is-required {
    color: #dd524d;
    font-weight: 700;
  }
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
