<template>
  <div class="tags-wrapper">
    <div class="section-title-wrapper">
      <span class="section-title">{{ text }}</span>
      <router-link :to="{ path }">
        更多……
      </router-link>
    </div>
    <div
      class="tags-container"
    >
      <router-link
        v-for="(tag, index) in tags"
        :key="index"
        :to="{ path: tag.path }"
      >
        <span
          class="tag"
        >{{ tag.tag }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tags',
  props: {
    text: {
      default: '',
      type: String
    },
    path: {
      default: '/',
      type: String
    },
    tags: {
      default() {
        return []
      },
      type: Array
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.tags-wrapper {
  width: 100%;
  .section-title-wrapper {
    display: flex;
    justify-content: space-between;
    vertical-align: bottom;
    padding-top: 36px;
    .section-title {
      font-size: 36px;
      line-height: 36px;
      vertical-align: bottom;
      font-weight: bold;
    }
    .section-more {
      font-size: 28px;
      line-height: 36px;
      vertical-align: bottom;
    }
  }
  .tags-container {
    .tag {
      display: inline-block;
      font-size: 16px;
      border: 1px solid @primary;
      padding: 3px 10px;
      border-radius: 6px;
      margin: 6px;
    }
  }
}
</style>