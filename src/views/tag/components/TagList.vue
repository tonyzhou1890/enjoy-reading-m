<template>
  <ul class="tag-list-wrapper">
    <li
      v-for="(item, index) in tags"
      :key="index"
      class="tag-item"
      :class="item.tag === tag ? 'active' : ''"
      @click="() => toTag(item)"
    >
      <span>{{ item.tag }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'TagList',
  props: {
    // 标签列表
    tags: {
      type: Array,
      default() {
        return []
      }
    },
    // 当前标签
    tag: {
      type: String,
      default: ''
    }
  },
  methods: {
    toTag(item) {
      this.$router.replace({ path: item.path })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');

.tag-list-wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(223, 223, 223);
  .tag-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 26px 16px;
    font-size: 28px;
    font-weight: bold;
    color: #333;
    &.active {
      background-color: @background;
      color: @primary;
    }
  }
}
</style>