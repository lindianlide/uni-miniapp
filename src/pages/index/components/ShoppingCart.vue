<template>
  <view class="shopcart" :class="shopList.length ? '' : 'no-good'">
    <!-- 购物车 -->
    <view class="cartBottom">
      <view class="carIcon" @click="toggleList">
        <view class="iconBox" :class="getAllCount ? 'active' : ''">
          <text class="allcount" v-if="getAllCount">{{ getAllCount }}</text>
          <image src="/static/images/cart.png" mode="" class="img"></image>
        </view>
      </view>
      <view class="middle">
        <text class="price" :class="getAllCount ? 'active' : ''"
          >合计金额约￥{{ getAllPrice }}</text
        >
        <text class="deliveryPrice" style="font-size: 12px">抄码产品不计算在内</text>
      </view>
      <view class="BtnRight">
        <view class="orderBtn" type="default" style="border-radius: 20rpx" @click="goOrder"
          >下单</view
        >
      </view>
    </view>
    <!-- 选择的商品 -->
    <view class="cartList" v-show="isShowList && shopList.length">
      <scroll-view scroll-y style="max-height: 400px">
        <view class="title">
          <text>购物车</text>
          <view class="clear" @click="delShopcart"> 清空 </view>
        </view>
        <view class="list">
          <view class="list-text" v-for="(item, index) in shopList" :key="index">
            <text class="text-name" style="flex: 3">{{ item.name }}</text>
            <text style="flex: 1">￥{{ item.price }}</text>
            <num-control :shop="item" @add="addCart" @dec="decreaseCart"></num-control>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="listMask" v-show="isShowList && shopList.length" @click="toggleList"></view>
  </view>
</template>

<script>
import NumControl from './NumControl.vue'
import { useAppStore } from '@/stores/modules/app'
import { accMul } from '@/utils/index'

export default {
  props: {
    shops: {
      type: Array,
      default: () => []
    },
    addressType: {
      type: String,
      default: 'sh'
    }
  },
  data() {
    return {
      isShowList: false,
      shopList: []
    }
  },
  components: {
    NumControl
  },
  watch: {
    shops: {
      handler() {
        let result = []
        this.shops.forEach((secondItem) => {
          secondItem.children.forEach((thirdItem) => {
            thirdItem.children?.forEach((shop) => {
              if (shop.count) {
                result.push(shop)
              }
            })
          })
        })
        this.shopList = result
      },
      deep: true
    }
  },
  computed: {
    // 获得购物车所有商品数量
    getAllCount() {
      let result = 0
      this.shopList.forEach((shop) => {
        result += shop.count
      })
      return result
    },
    // 总价
    getAllPrice() {
      let result = 0
      let result1 = 0
      this.shopList?.forEach((shop) => {
        result1 += accMul(shop.count, shop.price)
        result = result1.toFixed(2)
      })
      return result
    }
  },
  methods: {
    toggleList() {
      if (this.shopList.length) {
        this.isShowList = !this.isShowList
      }
    },
    delShopcart() {
      this.isShowList = false
      this.$emit('delAll')
    },
    addCart(item) {
      this.$emit('add', item)
    },
    decreaseCart(item) {
      this.$emit('dec', item)
    },
    goOrder() {
      if (this.shopList.length < 1) {
        uni.showToast({ title: '请先添加商品', icon: 'none' })
      } else {
        useAppStore().setOrderList(this.shopList)
        uni.navigateTo({
          url: '/pages/index/orderDetails?addressType=' + this.addressType
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.list-text {
  display: flex;
  flex-direction: row;
}

.shopcart {
  position: fixed;
  bottom: 10upx;
  left: 30upx;
  right: 20upx;
  height: 48px;
  border-radius: 24px;
  overflow: hidden;
  &.no-good {
    width: 50px;
  }
}

.shopcart .cartBottom {
  display: flex;
  background-color: #ebf0f3;
  z-index: 99;
}

.carIcon {
  flex: 1;
}

.iconBox {
  background-color: #ebf0f3;
  border-radius: 50%;
  height: 48px;
  width: 50px;
  line-height: 55px;
  /* border: 6px solid #141d27; */
  position: relative;
}

.iconBox .allcount {
  position: absolute;
  right: -6px;
  top: 0;
  display: inline-block;
  padding: 0 6px;
  font-size: 9px;
  line-height: 16px;
  font-weight: 400;
  border-radius: 10px;
  background-color: #f01414;
  color: #ffffff;
}

.img {
  font-size: 24px;
  line-height: 24px;
  width: 44px;
  height: 44px;
  padding-left: 2px;
  padding-top: 2px;
  color: #cccccc;
  border-radius: 50%;
}

.carIcon .active {
  background-color: #00a0dc;
}

.middle {
  display: flex;
  flex-direction: column;
  flex: 3;
  -webkit-display: flex;
  -webkit-flex-direction: column;
  -webkit-flex: 3;
  color: #595959;
  justify-content: center;
}

.BtnRight {
  flex: 1;
  z-index: 99999;
  text-align: center;
  line-height: 2em;
  background-color: #00a0dc;
  color: #fff;
  line-height: 48px;
}

.cartList {
  position: fixed;
  bottom: 54px;
  left: 0;
  right: 0;
  z-index: 90;
}

.cartList .title,
.cartList .list-text {
  display: flex;
  flex-direction: row;
}

.cartList .title {
  font-size: 30upx;
  background: #f0f0f0;
  justify-content: space-between;
  padding: 16upx 20upx;
  font-weight: 700;
}

.cartList .list-text {
  padding: 20upx 12upx 20upx 10upx;
  text-align: center;
}

.list {
  font-size: 28upx;
  background: #f8f8f8;
  padding: 0 16upx 16upx 16upx;

  .text-name {
    text-align: left;
    width: 67%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

/* 遮布 */
.listMask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 80px;
  z-index: 89;
  opacity: 0.5;
  background: #6a7076;
}
</style>
