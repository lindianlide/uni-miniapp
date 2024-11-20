<template>
  <text :class="computedClass" :style="computedStyle" />
</template>
<script>
export default {
  name: 'CuIcon',
  props: {
    type: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#333333'
    },
    size: {
      type: [Number, String],
      default: 16
    }
  },
  data() {
    return {}
  },
  computed: {
    computedStyle() {
      return {
        color: this.color,
        fontSize: `${this.size}px`
      }
    },
    computedClass() {
      return `iconfont ${this.type}`
    }
  }
}
</script>
