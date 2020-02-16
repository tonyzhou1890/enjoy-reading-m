<template>
  <div class="books-wrapper">
    <div class="section-title-wrapper">
      <span class="section-title">{{ text }}</span>
      <router-link :to="{ path }">
        更多……
      </router-link>
    </div>
    <flexbox
      class="books-container"
      justify="space-between"
      wrap="wrap"
    >
      <flexbox-item
        v-for="(item, index) in books"
        :key="index"
        class="book-container"
      >
        <ListBook
          :book="item"
        ></ListBook>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'
import ListBook from '@/components/ListBook'
export default {
  name: 'Books',
  components: {
    Flexbox,
    FlexboxItem,
    ListBook
  },
  props: {
    text: {
      default: '',
      type: String
    },
    path: {
      default: '/',
      type: String
    },
    books: {
      default() {
        return []
      },
      type: Array
    }
  }
}
</script>

<style lang="less" scoped>
.books-wrapper {
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
  .books-container {
    .book-container {
      flex: 1 33.333%;
      margin-left: 0 !important;
      &:nth-child(3n + 2) {
        /deep/ .book-wrapper {
          margin: 0 auto;
        }
      }
      &:nth-child(3n + 3) {
        /deep/ .book-wrapper {
          margin: 0 0 0 auto;
        }
      }
    }
  }
}
</style>