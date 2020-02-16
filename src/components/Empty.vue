<template>
  <div
    class="no-data no-wrap"
  >{{ text }}</div>
</template>

<script>
export default {
  name: 'Empty',
  props: {
    text: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>

<style lang="less" scoped>
.no-data {
  width: 100%;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  color: gray;
}
</style>
