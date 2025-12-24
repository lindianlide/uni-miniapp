<template>
  <view class="myorder-detail">
    <view class="order-search-box">
      <uni-segmented-control
      style="flex: 1;"
      :current="currentStatus"
      :values="orderStatusList"
      :style-type="styleType"
      :active-color="activeColor"
      @clickItem="onClicktab"
      />
      <!-- <icon class="filter-order" type="search" size="20" @click="openSearchPopup"/> -->
      <text class="filter-order" @click="openSearchPopup">筛选</text>
    </view>
    <uni-section title="">
      <view class="myorder-list" v-if="orderList.length > 0">
        <view class="list-group" v-for="(groupItem, index) in orderList" :key="index">
          <view class="group-item">
            <view>日期：{{ groupItem.date }} </view>
          </view>
          <view class="list-item" v-for="(item, index2) in groupItem.children" :key="index2">
            <view class="item-title"
              ><view>产品： <text class="text-name">{{ item.name }} </text></view>
              <text class="text-unit">{{ item.number }}{{ item.unit }} </text>
            </view>
            <view class="item-info">
              <view>
                <text class="item-info-price">￥{{ item.md ? item.realPrice : '--' }}</text>
                <view style="display: inline-block">
                  <uni-tag class="tag-large-l tag-circle" :text="'单价：' + item.unitPrice" :type="computedTag(item, 'price')" />
                  <uni-tag class="tag-large-l tag-circle" :text="computedMdText(item.md)" :type="computedTag(item, 'md')" />
                  <!--<uni-tag :text="item.orderStatus[0] || '确认中'" type="primary"/> -->
                </view>
              </view>
              <view class="item-button" v-if="item.orderStatus">
                <uni-tag class="tag-large-xl" :text="item.orderStatus[0] || ''" :type="computedStatusTag(item.orderStatus[0])"/>
              </view>
              <!-- <view class="item-button" v-if="item.orderStatus[0] == '' || item.orderStatus[0] == '已审核'">
                <button
                  class="button-cancel"
                  @tap="updateOrder(item)"
                >
                  修改订单
                </button>
              </view>
              -->
            </view>
          </view>
          <view class="group-item">
            <view>今日总额：{{ groupItem.groupPrice }}</view>
          </view>
        </view>
      </view>
      <view class="list-item-no" v-else> 暂无订单 </view>
    </uni-section>

    <view class="price-total" v-if="orderList.length > 0">
      <text>欠款金额：</text>
      <text>{{ unPriceAll }}</text>
      <text>订单总额：</text>
      <text>{{ priceAll }}</text>
    </view>
  </view>
   <!-- 弹出框组件 -->
   <uni-popup ref="updateOrderPopup" type="bottom">
      <view class="popup-content">
        <radio-group class="update-radio" @change="handleRadioChange">
          <label v-for="option in radioOptions" :key="option.value">
            <radio style="transform:scale(0.9)" :value="option.value">{{ option.text }}</radio>
          </label>
        </radio-group>
        <uni-easyinput
            class="update-input"
            type="textarea"
            maxlength="120"
            placeholder="请输入备注内容"
            v-model="orderRemark"
            :inputBorder="true"
            :clearable="true"
          />
        <view class="popup-buttons">
          <button type="primary" @click="confirmUpdate">确认</button>
          <button @click="cancelUpdate">取消</button>
        </view>
      </view>
    </uni-popup>

     <!-- 筛选弹出框组件 -->
   <uni-popup ref="filterOrderPopup" type="top">
      <view class="popup-filter-content">
        <view class="label-name">产品名称：</view>
        <uni-easyinput
            class="label-input"
            placeholder="请输入产品名称"
            v-model="searchObject.orderName"
            :inputBorder="true"
            :clearable="true"
          />
          <view class="label-name">分店信息：</view>
          <uni-data-select
          style="width: 60%;"
            v-model="searchObject.userShop"
            :localdata="userShopList"
          ></uni-data-select>
        <view class="label-name">下单日期：</view>
        <view class="flex-item">
          <picker mode="date" :value="searchObject.startDate" :start="startDate" :end="endDate" @change="bindStartDateChange">
            <view class="uni-input-date">{{searchObject.startDate}}</view>
          </picker>
          <text>-</text>
          <picker mode="date" :value="searchObject.endDate" :start="startDate" :end="endDate" @change="bindEndDateChange">
            <view class="uni-input-date">{{searchObject.endDate}}</view>
          </picker>
        </view>

        <view class="popup-buttons">
          <button type="primary" @click="confirmSearch">确认</button>
          <button @click="resetSearchPopup">重置</button>
        </view>
      </view>
    </uni-popup>
  <div class="loading" v-if="isloading"></div>
</template>

<script>
import { getOrderList, postOrderListUpdate, getUserShopList, getUnOrderList, postSureOrderListUpdate } from '@/api/index'
import { formatTime, sortBy } from '@/utils/index'
import { groupBy } from 'lodash'

export default {
  data() {
    return {
      orderList: [],
      formatTime: formatTime,
      priceAll: 0,
      unPriceAll: 0,
      isloading: true,
      radioOptions: [
        { value: '取消订单', text: '取消订单' },
        { value: '更改数量', text: '更改数量' },
        { value: '更改物流', text: '更改物流' },
      ],
      orderRemark: '',
      updateType: '',
      curOrderId: '',
      searchObject: {
        orderName: '',
        startDate: '',
        endDate: '',
        userShop: ''
      },
      currentStatus: 0,
      orderStatusList: ['全部', '未审核', '已发货','已取消', '已审核'],
      styleType: 'button',
      activeColor: '#0a28a7',
      userShopList: [],
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
          return 'light'
        } else if (type === 'isSure') {
          if (tag.isSure) {
            return 'success'
          } else {
            return 'error'
          }
        }
      }
    },
    computedStatusTag() {
      return (type) => {
        if (type === '已审核') {
          return 'primary'
        } else if (type === '未审核') {
          return 'warning'
        } else if (type === '已发货') {
            return 'success'
        } else if (type === '已取消') {
          return 'error'
        }
      }
    },
    startDate() {
        return this.getDate('start');
    },
    endDate() {
        return this.getDate('end');
    }
  },
  onShow: function () {
    this.initOrderList()
    this.fetchUnorderList()
    getUserShopList().then((res) => {
      this.userShopList = res.map((item) => {
        return { text: item.shopName, value: item.shopName }
      })
      console.log('getUserShopList',this.userShopList)
    })

  },

  methods: {
    initOrderList() {
      this.isloading = true
      getOrderList()
        .then((res) => {
          debugger
          const {orderName, startDate, endDate, userShop} = this.searchObject
          let filterRes = res.filter(item => {
            return orderName ? item.name.includes(orderName) : true;
            })?.filter((item) => {
              if(startDate && endDate) {
                const date = new Date(item.date)
                const startDates = new Date(startDate)
                const endDates = new Date(endDate)
                return date >= startDates && date <= endDates;
              } else {
                return true;
              }
            })?.filter(item => {
              return userShop ? item.userShop?.includes(userShop) : true;
            });
console.log('filterRes',filterRes)
          if(this.currentStatus !== 0) {
            filterRes = filterRes.filter(item => item.orderStatus[0] === this.orderStatusList[this.currentStatus])
          }
          const orderList = []
          const groupRes = groupBy(filterRes, 'date')
          this.priceAll = 0
          Object.entries(groupRes).forEach((group) => {
            let groupPrice = 0
            let totalPrice = 0
            group[1].forEach((order) => {
              totalPrice += order.realPrice // * order.number  
              this.priceAll += order.realPrice // * order.number
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
    fetchUnorderList() {  
      getUnOrderList().then((res) => {
        this.unPriceAll = 0
        res.forEach(item => {
          this.unPriceAll += item.unPrice;
        })
        this.unPriceAll = this.unPriceAll?.toFixed(1)
      })
    },
    updateOrder(item) {
      this.curOrderId = item.id
      this.orderRemark = ''; // 初始化文本输入
      this.updateType = ''; // 初始化选中的 radio
      this.$refs.updateOrderPopup.open(); // 显示弹出框
    },
    openSearchPopup() {
      debugger
      this.$refs.filterOrderPopup.open(); // 显示弹出框
    },
    resetSearchPopup() {
      this.searchObject = {
        orderName: '',
        startDate: '',
        endDate: ''
      };
      this.initOrderList();
      this.$refs.filterOrderPopup.close(); // 隐藏弹出框
    },
    handleRadioChange(e) {
      this.updateType = e.detail.value;
    },
    confirmUpdate() {
      // 这里处理确认逻辑，例如发送更新请求
      this.$refs.updateOrderPopup.close(); // 隐藏弹出框
      const params = {
        id: this.curOrderId,
        orderRemark: this.orderRemark,
        updateType: this.updateType
      };
      postOrderListUpdate(params).then(() => {
          this.initOrderList()
          uni.showToast({ title: '您的修改申请已提交', icon: 'none' })
      })
    },
    cancelUpdate() {
      this.$refs.updateOrderPopup.close(); // 隐藏弹出框
    },
    confirmSearch() {
      this.$refs.filterOrderPopup.close(); // 隐藏弹出框
      this.initOrderList()
    },
    bindStartDateChange: function(e) {
        this.searchObject.startDate = e.detail.value
    },
    bindEndDateChange: function(e) {
        this.searchObject.endDate = e.detail.value
    },
    getDate(type) {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (type === 'start') {
            year = year - 20;
        } else if (type === 'end') {
            year = year + 2;
        }
        month = month > 9 ? month : '0' + month;
        day = day > 9 ? day : '0' + day;
        return `${year}-${month}-${day}`;
    },
    onClicktab(e) {
      this.currentStatus = e.currentIndex
      this.initOrderList()
    },
    // cancelOrder(item) {
    //   if (item.isFrom === 'isSure') {
    //     postSureOrderListUpdate(item).then(() => {
    //       this.initOrderList()
    //       uni.showToast({ title: '您的取消申请已提交', icon: 'none' })
    //     })
    //   } else {
    //     postOrderListUpdate(item).then(() => {
    //       this.initOrderList()
    //       uni.showToast({ title: '您的取消申请已提交', icon: 'none' })
    //     })
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.myorder-detail {
  //background-color: #f5f5f5;
  //height: 100vh;
  padding: 70upx 20upx 90upx 20upx;

  .order-search-box {
    position: fixed;
    top: 0px;
    left: 20upx;
    right: 20upx;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 2;
  }
  ::v-deep .segmented-control {
    margin: 0 10upx;
    height: 64upx;
    line-height: 64upx;
    border: 2upx solid #0a28a7;
    border-radius: 32upx;
    .segmented-control__item {
      //max-width: 90upx;
      padding: 2upx 8upx;
      border: none;
      &.segmented-control__item--button--active {
        border-radius: 30upx;
        padding: 2upx 10upx;
      }
    }
  }

  .filter-order{
    width: 90upx;
    color: #0a28a7;
    font-size: 32upx;
    font-weight: 700;
  }

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
          font-weight: 600;
          font-size: 32upx;
          height: 62upx;
          display: flex;
          justify-content: space-between;
          .text-name {
            flex: 3;
            text-align: left;
            width: 80%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .item-info {
          display: flex;
          justify-content: space-between;
          font-size: 28upx;
          align-items: center;

          .item-info-price {
            font-size: 32upx;
            font-weight: 600;
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
            font-size: 28upx;
            min-width: 150upx;
            height: 56upx;
            line-height: 56upx;
          }
        }

        ::v-deep .uni-tag {
          position: relative;
          margin-left: 10upx;
          top: -2upx;
          line-height: 28upx;
          font-size: 28upx;
          padding: 2upx 8upx;
        }
      }
      .group-item {
        font-size: 36upx;
        height: 72upx;
        line-height: 72upx;
        display: flex;
        justify-content: space-between;
        font-weight: 700;
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
    bottom: 20upx;
    right: 0upx;
    padding: 10upx 20upx 10upx 40upx;
    border-radius: 60upx 0 0 60upx;
    display: flex;
    flex-direction: column;
    font-size: 32upx;
    background-color: #0a28a7;
    color: #fff;
    opacity: 0.7;
    max-width: 180upx;
    white-space: nowrap;
  }

  ::v-deep .uni-section {
    .uni-section-header {
      font-weight: bold;
      font-size: 32upx;
      padding: 5px 10px;
      .uni-section__content-title {
        font-size: 32upx !important;
      }
    }
  }
}
</style>
<style lang="scss">
.popup-content {
    padding: 40upx;
    background-color: #fff;

    .update-radio {
      height: 100upx;
      line-height: 100upx;
    }
    .update-input {
      margin-top: 40upx ;
      height: 200upx;
    }
    .popup-buttons {
      margin-top: 40upx ;
      display: flex;
      justify-content: space-between;
      button {
        width: 40%;
        font-size: 32upx;
      }
    }
  }
.popup-filter-content {
  padding: 20upx 40upx 40upx 40upx ;
  background-color: #fff;

  .flex-item {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .uni-input-date {
      min-width: 250upx;
      height: 46rpx;
      border: 1px solid #eee;
      padding: 4px 10px;
    }
  }

  .label-name {
    font-size: 32upx;
    margin: 36upx 0 ;
  }
  .popup-buttons {
      margin-top: 50upx ;
      display: flex;
      justify-content: space-between;
      button {
        width: 40%;
        font-size: 32upx;
      }
    }
  }
</style>