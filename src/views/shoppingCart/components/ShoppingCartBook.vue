<template>
  <div class="book-wrapper">
    <!-- 封面 -->
    <div class="book-cover-wrapper">
      <x-img
        v-if="book.frontCoverPath"
        fit="fill"
        class="book-cover"
        :src="storePrefix + book.frontCoverPath"
        :title="book.name"
      />
      <DefaultCover
        v-else
        :text="book.name"
        :title="book.name"
        :width="20.16"
        :height="29.7"
      />
    </div>
    <!-- 其他信息 -->
    <div class="book-info-wrapper">
      <p class="name">{{ book && book.name }}</p>
      <p class="no-wrap author">{{ book && book.author }}</p>
      <p class="no-wrap">{{ book.discount ? book.discountScore + scoreUnit : book.score + scoreUnit }}</p>
    </div>
  </div>
</template>

<script>
import DefaultCover from '@/components/DefaultCover'
import { XButton, XImg } from 'vux'
export default {
  name: 'ShoppingCartBook',
  components: {
    DefaultCover,
    XButton,
    XImg
  },
  props: {
    book: {
      required: true,
      type: [Object, String]
    }
  },
  data() {
    return {
      storePrefix: this.$store.state.app.storePrefix,
      scoreUnit: this.$store.state.app.scoreUnit,
      readLoading: false,
      removeLoading: false,
    }
  },
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.book-wrapper {
  padding: 24px;
  width: 100%;
  height: 270.48px;
  display: flex;
  .book-cover-wrapper {
    width: 151.2px;
    .book-cover {
      width: 100%;
      height: 100%;
      background-color: @lightgray;
      display: flex;
      justify-content: center;
      align-items: center;
      .no-book-logo {
        font-size: 40px;
        color: @primary;
      }
    }
  }
  .book-info-wrapper {
    flex: 1;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 21px;
    color: @gray;
  }
  .name {
    font-size: 28px;
    line-height: 32px;
    height: 72px;
    padding-top: 10px;
    margin-bottom: 20px;
    overflow: hidden;
    word-break: break-all;
    font-weight: bold;
    color: #333;
  }
}
</style>
