<template>
  <view class="myorder-detail">
    <uni-section title="订单列表">
      <view class="myorder-list" v-if="orderList.length > 0">
        <view class="list-group" v-for="(groupItem, index) in orderList" :key="index">
          <view class="list-item" v-for="(item, index2) in groupItem.children" :key="index2">
            <view class="item-title"
              >产品： <text class="text-name">{{ item.name }} </text>
            </view>
            <view class="item-info">
              <view>
                <text class="item-info-price">￥{{ item.md ? item.realPrice : '--' }}</text>
                <view style="display: inline-block"
                  ><uni-tag :text="computedMdText(item.md)" :type="computedTag(item, 'md')" />
                  <uni-tag :text="'单价：' + item.unitPrice" :type="computedTag(item, 'price')" />
                  <!-- <uni-tag
                :text="item.isSure ? '已接单' : '未接单'"
                :type="computedTag(item, 'isSure')"
              /> -->
                </view>
              </view>
              <view class="item-button" v-if="!item.paymentDate">
                <button class="button-cancel" v-if="item.status === 'canceling'">取消确认中</button>
                <button class="button-cancel" v-else-if="item.status === 'cancel'">已取消</button>
                <button
                  class="button-cancel"
                  v-else-if="item.status === ''"
                  @tap="cancelOrder(item)"
                >
                  取消订单
                </button>
              </view>
            </view>
          </view>
          <view class="group-item">
            <view>日期：{{ groupItem.date }} </view>
            <view>合计金额：{{ groupItem.groupPrice }}</view>
          </view>
        </view>
      </view>
      <view class="list-item-no" v-else> 暂无订单 </view>
    </uni-section>

    <view class="price-total" v-if="orderList.length > 0">
      <text>订单总额：</text>
      <text>{{ priceAll }}</text>
    </view>
  </view>
  <div class="loading" v-if="isloading"></div>
</template>

<script>
import { getOrderList, postOrderListUpdate, postSureOrderListUpdate } from '@/api/index'
import { formatTime, sortBy } from '@/utils/index'
import { groupBy } from 'lodash'

export default {
  data() {
    return {
      orderList: [],
      formatTime: formatTime,
      priceAll: 0,
      isloading: true
    }
  },
  computed: {
    computedMdText() {
      return (md) => {
        if (md) {
          return '码单：' + md
        } else {
          return '未出码单'
        }
      }
    },
    computedTag() {
      return (tag, type) => {
        if (type === 'md') {
          if (tag.md) {
            return 'primary'
          } else {
            return 'error'
          }
        } else if (type === 'price') {
          return 'warning'
        } else if (type === 'isSure') {
          if (tag.isSure) {
            return 'success'
          } else {
            return 'error'
          }
        }
      }
    }
  },
  onShow: function () {
    this.initOrderList()
  },

  methods: {
    initOrderList() {
      getOrderList()
        .then((res) => {
          const orderList = []
          const groupRes = groupBy(res, 'date')
          this.priceAll = 0
          Object.entries(groupRes).forEach((group) => {
            let groupPrice = 0
            let totalPrice = 0
            group[1].forEach((order) => {
              totalPrice += order.realPrice
              this.priceAll += order.realPrice
              groupPrice = totalPrice?.toFixed(1)
            })
            orderList.push({
              date: group[0],
              children: group[1],
              groupPrice: groupPrice
            })
          })
          this.orderList = orderList.sort(sortBy('desc', 'date'))
          this.isloading = false
          this.priceAll = this.priceAll?.toFixed(1)
        })
        .catch(() => {
          this.isloading = false
        })
    },
    cancelOrder(item) {
      if (item.isFrom === 'isSure') {
        postSureOrderListUpdate(item).then(() => {
          this.initOrderList()
          uni.showToast({ title: '您的取消申请已提交', icon: 'none' })
        })
      } else {
        postOrderListUpdate(item).then(() => {
          this.initOrderList()
          uni.showToast({ title: '您的取消申请已提交', icon: 'none' })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.myorder-detail {
  background-color: #f5f5f5;
  height: 100vh;
  padding: 0 20upx;

  .myorder-list {
    padding: 0 10upx;
    font-size: 28upx;
    .list-group {
      border: solid 1px #000;
      border-radius: 12upx;
      padding: 0 10upx;
      + .list-group {
        margin-top: 16upx;
      }
      .list-item {
        padding: 10upx 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border-bottom: 2upx solid #eee;
        .item-title {
          font-weight: 700;
          font-size: 30upx;
          height: 50upx;
          .text-name {
            flex: 3;
            text-align: left;
            width: 67%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .item-info {
          display: flex;
          justify-content: space-between;
          font-size: 24upx;
          align-items: center;

          .item-info-price {
            font-size: 30upx;
            font-weight: 700;
            margin-right: 20upx;
          }
        }
        .item-button {
          display: flex;
          justify-content: flex-end;
          .button-cancel {
            background: #fff;
            margin-left: 0;
            margin-right: 0;
            display: inline-block;
            font-size: 24upx;
            min-width: 150upx;
            height: 50upx;
            line-height: 50upx;
          }
        }

        ::v-deep .uni-tag {
          position: relative;
          margin-left: 10upx;
          top: -2upx;
          line-height: 20upx;
          font-size: 20upx;
          padding: 2upx 8upx;
        }
      }
      .group-item {
        font-size: 28upx;
        height: 60upx;
        line-height: 60upx;
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .list-item-no {
    height: 80upx;
    padding: 40upx 0;
    text-align: center;
  }
  .price-total {
    position: fixed;
    bottom: 60upx;
    right: 0upx;
    padding: 10upx 20upx 10upx 40upx;
    border-radius: 60upx 0 0 60upx;
    display: flex;
    flex-direction: column;
    font-size: 32upx;
    background-color: #0a28a7;
    color: #fff;
    opacity: 0.8;
    max-width: 180upx;
    white-space: nowrap;
  }
  ::v-deep .uni-section-header {
    font-weight: bold;
    font-size: 34upx;
  }
}
</style>
