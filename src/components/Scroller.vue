<template>
  <div
    class="scroller-container"
    ref="container"
    @scroll="handleScroll"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Scroller',
  props: {
    threshold: {
      type: Number,
      default: 10
    }
  },
  methods: {
    handleScroll(e) {
      console.log(e)
    }
  }
}
</script>

<style lang="less" scoped>
.scroller-container {
  width: 100%;
  height: 100%;
}
</style>