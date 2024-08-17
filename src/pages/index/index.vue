<template>
  <view class="shop-container">
    <view class="title-box">
      <view class="title-tag"
        ><uni-segmented-control
          :current="currentFirstIndex"
          :values="firstCategorys"
          :style-type="styleType"
          :active-color="activeColor"
          @clickItem="onClicktab"
        />
      </view>
    </view>
    <view class="info-box">
      <!-- 日期 -->
      <view class="info-date">{{ nowDate }}</view>
    </view>

    <view class="shop-wrap">
      <scroll-view
        class="menu-wrapper"
        scroll-y
        :scroll-top="left_scroll"
        scroll-with-animation="true"
      >
        <view class="left-content">
          <view
            style="position: relative"
            v-for="(secItem, secIndex) in secondCategorys"
            :key="secIndex"
          >
            <view
              class="second-menu-item"
              :class="{ current: currentSecIndex == secIndex }"
              @click="toggleMenu(secItem)"
              >{{ secItem.name }}
              <uni-icons
                style="margin-left: 10px"
                :type="secItem.fold ? 'down' : 'up'"
                size="12"
                :color="currentSecIndex == secIndex ? '#00a0dc' : '#000000'"
              ></uni-icons>
            </view>
            <view v-show="!secItem.fold">
              <view
                v-for="(thirdItem, thirdIndex) in secItem.children"
                :key="thirdIndex"
                @click="selectThird(secIndex, thirdIndex)"
              >
                <view
                  class="third-menu-item"
                  :class="{ current: currentThirdIndex == secIndex + '-' + thirdIndex }"
                  >{{ thirdItem.name }}</view
                >
                <text
                  class="menu-count"
                  v-if="getAllCount >= thirdItem.count && thirdItem.count > 0"
                  >{{ thirdItem.count }}</text
                >
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <!-- 右侧滚动 -->
      <scroll-view
        class="shops-wrapper"
        scroll-y
        :scroll-top="shopSTop"
        :style="'height:' + windows_height + 'px'"
        @scroll="myscroll"
        scroll-with-animation="true"
      >
        <view ref="shopsWrapper">
          <view ref="shopList" v-for="(secondItem, index1) in secondCategorys" :key="index1">
            <view
              class="category-shops"
              v-for="(thirdItem, index2) in secondItem.children"
              :key="index2"
            >
              <view class="shop-title">
                {{ thirdItem.name }}
              </view>
              <view v-if="thirdItem.children && thirdItem.children.length > 0">
                <view
                  class="shop-info-box"
                  v-for="(shop, index3) in thirdItem.children"
                  :key="index3"
                >
                  <view class="shop-info" :class="{ 'no-left': shop.left }">
                    <text class="shop-text">{{ shop.name }}</text>
                    <!-- 加减 -->
                    <view class="shop-btn">
                      <view>
                        <text class="shop-price">￥{{ shop.price || '-' }}</text>
                        <uni-tag
                          v-for="(tag, tagIndex) in shop.tag"
                          :key="tagIndex"
                          :text="tag"
                          :type="computedTag(tag)"
                        />
                      </view>
                      <num-control :shop="shop" @add="addCart" @dec="decreaseCart"></num-control>
                    </view>
                  </view>
                </view>
              </view>
              <view v-else class="shop-no">
                <text>暂无商品</text>
              </view>
            </view>
          </view>
          <view style="height: 50px"></view>
        </view>
      </scroll-view>
      <shop-cart
        :shops="secondCategorys"
        :addressType="addressType"
        @add="addCart"
        @dec="decreaseCart"
        @delAll="delAll"
      ></shop-cart>
    </view>
    <div class="loading" v-if="isloading"></div>
  </view>
</template>

<script>
import ShopCart from './components/ShoppingCart.vue'
import NumControl from './components/NumControl.vue'
import { formatTime, clearUniStorage } from '@/utils/index'
import { getCategoryList, getAllPriceList } from '@/api/index'

export default {
  data() {
    return {
      nowDate: formatTime('', 'yyyy年mm月dd日'),
      categorys: [],
      currentFirstIndex: 0,
      activeColor: '#00a0dc',
      styleType: 'button',
      windows_height: 0, //屏幕高度
      shopSTop: 0, //右侧的滑动值
      currentSecIndex: 0,
      currentThirdIndex: '0-0',
      last: 0,
      right_height: [], //右侧每个内容的高度集合
      select_index: 0,
      left_height: 0, //左侧总高度
      left_scroll: 0, //左侧滑动值,
      isloading: true,
      adddressType: 'sh'
    }
  },
  components: {
    ShopCart,
    NumControl
  },

  onShareAppMessage() {
    const owner = uni.getStorageSync('owner') || [{}]
    const { id, name } = owner[0]
    return {
      //title: '自定义转发标题',
      path: 'pages/index/index?id=' + id + '&name=' + name
    }
  },
  onShow() {
    let token = uni.getStorageSync('token')
    if (!token) {
      clearUniStorage()
      uni.reLaunch({ url: '/pages/my/loginOther' })
    }
  },
  onLoad() {
    this.windows_height = Number(uni.getSystemInfoSync().windowHeight) - 85
    this.addressType = uni.getStorageSync('addressType') || 'sh'

    getCategoryList().then((res) => {
      this.categorys = res
    })

    getAllPriceList()
      .then((priceRes) => {
        this.isloading = false
        this.categorys.forEach((first) => {
          first.children.forEach((second) => {
            second.children.forEach((third) => {
              third.children = priceRes[third.key]
            })
          })
        })
        setTimeout(() => {
          this.getHeightList()
        }, 1000)
      })
      .catch(() => {
        this.isloading = false
      })

    // uni.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage', 'shareTimeline']
    // })
  },
  computed: {
    firstCategorys() {
      return this.categorys.map((firstCategory) => firstCategory.name)
    },
    secondCategorys() {
      return this.categorys[this.currentFirstIndex]?.children || []
    },
    computedTag() {
      return (tag) => {
        if (tag === '少') {
          return 'error'
        } else if (tag === '特价') {
          return 'success'
        } else {
          return 'primary'
        }
      }
    },
    // 获得购物车所有商品数量todo
    getAllCount(item) {
      // let result = []
      // let count = 0

      // for (let i = 0; i < this.goods.length; i++) {
      //   count = 0
      //   this.goods[i].shops.forEach((shop) => {
      //     if (shop.count >= 0) {
      //       count += shop.count
      //       this.$set(this.goods[i], 'count', count)
      //     }
      //   })
      //   result.push(count)
      // }

      // result.sort(function (a, b) {
      //   return a - b
      // })
      // count = result[result.length - 1]
      // return count
      return 0
    }
  },
  methods: {
    toggleMenu(menu) {
      menu.fold = !menu.fold
    },
    onClicktab(e) {
      this.currentFirstIndex = e.currentIndex
      //todo zw
      this.addressType = this.firstCategorys[e.currentIndex] === '广州' ? 'gz' : 'sh'
    },

    selectThird(secIndex, thirdIndex) {
      this.currentSecIndex = secIndex
      this.currentThirdIndex = secIndex + '-' + thirdIndex
      this.setScrollH(secIndex, thirdIndex)
    },
    // 设置点击侧边栏右边滚动的高度
    setScrollH(secIndex, thirdIndex) {
      let countIndex = 0
      for (let i = 0; i < secIndex; i++) {
        countIndex += this.secondCategorys[i].children.length
      }
      countIndex += thirdIndex
      this.categorys[this.currentFirstIndex]?.children
      let height = 0
      var query = uni.createSelectorQuery()
      let categoryShops = query.selectAll('.category-shops')

      this.$nextTick(() => {
        categoryShops
          .fields(
            {
              size: true
            },
            (data) => {
              if (countIndex == 0) {
                this.shopSTop = 0
              }
              for (let i = 0; i < countIndex; i++) {
                height += parseInt(data[i].height)
                this.shopSTop = height
              }
            }
          )
          .exec()
      })
    },

    addCart(item) {
      if (item.count >= 0) {
        item.count++
      } else {
        item.count = 1
      }
      // this.secondCategorys.forEach((secItem) => {
      //   secItem.children.forEach((thirdItem) => {
      //     thirdItem.children?.forEach((shop) => {
      //       if (item.name == shop.name) {
      //         //shop.count = item.count
      //         this.$set(shop, 'count', item.count)
      //       }
      //     })
      //   })
      // })
    },
    decreaseCart(item) {
      if (item.count) {
        item.count--
      }
    },
    // 清空购物车
    delAll() {
      this.secondCategorys.forEach((secItem) => {
        secItem.children.forEach((thirdItem) => {
          thirdItem.children?.forEach((shop) => {
            shop.count = 0
          })
        })
      })
    },
    getHeightList() {
      let _this = this
      let selectorQuery = uni.createSelectorQuery().in(this)
      selectorQuery.select('.left-content').boundingClientRect(function (rects) {
        _this.left_height = rects.height
      })
      selectorQuery
        .selectAll('.category-shops')
        .boundingClientRect(function (rects) {
          _this.right_height = rects.map((item) => item.top)
        })
        .exec()
    },
    myscroll(e) {
      //引入节流
      let right_content_height = e.detail.scrollHeight - this.windows_height
      if (right_content_height == e.detail.scrollTop) {
        return
      }
      let scroll_top = e.detail.scrollTop + 90 //误差90
      //判断当前的scrollTop在哪个区间内;
      let now = +new Date()
      if (now - this.last > 50) {
        this.last = now
        let active_index = this.right_height.findIndex(
          (value, index, arr) => value <= scroll_top && scroll_top < arr[index + 1]
        )
        //底部新增高度引发选中错误问题
        if (active_index === -1) {
          active_index = this.right_height.length - 1
        }
        this.currentThirdIndex = active_index
        let countIndex = 0
        for (let i = 0; i < this.secondCategorys.length; i++) {
          countIndex += this.secondCategorys[i].children.length

          if (active_index < countIndex) {
            this.currentSecIndex = i
            const thirdIndex = active_index + this.secondCategorys[i].children.length - countIndex
            this.currentThirdIndex = this.currentSecIndex + '-' + thirdIndex
            break
          }
        }
        //todo 左侧滚动
        // if (this.left_height - this.windows_height) {
        //   //如果有超出部分
        //   let diff = this.left_height - this.windows_height
        //   this.left_scroll = Math.round((active_index * diff) / (this.goods.length - 1))
        // }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-container {
  padding: 20upx 0;
  .title-box {
    font-size: 50upx;
    position: relative;
    padding-left: 290upx;
    padding-top: 16upx;
    height: 70upx;
    &::before {
      content: '';
      position: absolute;
      left: 24upx;
      top: -10upx;
      width: 180upx;
      height: 90upx;
      background: url('../../static/images/logo.png') no-repeat center;
      background-size: contain;
    }

    .title-tag {
      font-size: 28upx;
      ::v-deep .segmented-control {
        height: 48upx;
        .segmented-control__item {
          max-width: 90upx;
        }
      }
    }
  }

  .info-box {
    padding-left: 10upx;
    display: flex;
    justify-content: space-between;
    .info-date {
      width: 40%;
      font-size: 28upx;
      line-height: 30upx;
    }
  }
}

.shop-wrap {
  display: flex;
  position: absolute;
  top: 140upx;
  bottom: 0upx;
  width: 100%;
  overflow: hidden;

  .menu-wrapper {
    text-align: center;
    width: 22%;
    display: flex;
    flex-direction: column;
    background: #f3f5f7;

    .second-menu-item {
      padding: 0 10upx 0 20upx;
      font-size: 28upx;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 66upx;
      white-space: nowrap;
      background-color: #fff;
      &.current {
        background-color: #fff;
        color: #00a0dc;
      }
    }

    .third-menu-item {
      font-size: 28upx;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60upx;
      white-space: nowrap;
      &.current {
        background-color: #e6f4ff;
        color: #00a0dc;
      }
    }
    .menu-count {
      position: absolute;
      right: 6px;
      top: 8px;
      display: inline-block;
      padding: 0 4px;
      font-size: 9px;
      line-height: 16px;
      font-weight: 400;
      border-radius: 50%;
      background-color: #f01414;
      color: #ffffff;
    }
  }

  .shops-wrapper {
    padding: 14upx 20upx;
    .shop-info-box,
    .shop-btn {
      display: flex;
      flex-direction: row;
    }
    .shop-info-box {
      + .shop-info-box {
        border-top: 1px solid #eee;
      }
    }
    .no-left {
      &::after {
        border-radius: 10upx;
        padding-top: 20upx;
        padding-right: 40upx;
        text-align: right;
        content: '售罄';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: #d9d9d9;
        opacity: 0.5;
      }
    }

    .shop-title {
      padding: 10upx 0 10upx 0upx;
      font-size: 28upx;
      color: #8c8c8c;
    }
    .shop-no {
      padding: 10upx 0 10upx 0upx;
      font-size: 28upx;
      color: #000;
    }

    .shop-info {
      position: relative;
      padding: 10upx 20upx 10upx 10upx;
      display: flex;
      flex-direction: column;
      flex: 2;
      font-size: 28upx;
      justify-content: space-between;
      height: 90upx;

      ::v-deep .uni-tag {
        position: relative;
        margin-left: 10upx;
        top: -4upx;
        line-height: 18upx;
        font-size: 18upx;
        font-weight: 200;
        padding: 2upx 8upx;
      }
    }

    .shop-text {
      font-size: 30upx;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 515upx;
      white-space: nowrap;
    }
    .shop-btn {
      justify-content: space-between;
    }

    .shop-price {
      color: #f01414;
      font-size: 30upx;
    }
  }
}
</style>
