<template>
  <view style="display: flex; flex-direction: row; height: 20px">
    <view class="shop-control">
      <view class="cont" @click="decreaseCart(shop)" v-show="shop.count > 0">
        <image src="/static/images/des.png" mode="" style="width: 20px; height: 20px"></image>
      </view>
      <text style="padding: 0 5px; position: relative; font-size: 14px" v-show="shop.count > 0">{{
        shop.count
      }}</text>
    </view>
    <view class="cont" @click="addCart(shop)">
      <image
        src="/static/images/add2.png"
        style="width: 20px; height: 20px; color: #cccccc"
      ></image>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    shop: {
      type: Object
    }
  },
  data() {
    return {}
  },
  methods: {
    addCart(item) {
      this.$emit('add', item)
    },
    decreaseCart(item) {
      this.$emit('dec', item)
    }
  }
}
</script>

<style scoped>
.shop-control {
  display: flex;
  flex: 1;
  justify-content: space-around;
}

.cont {
  width: 36upx;
  height: 36upx;
  box-sizing: border-box;
  border-radius: 50%;
  text-align: center;
}
</style>
