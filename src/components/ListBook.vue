<template>
  <div class="book-wrapper">
    <router-link
      v-if="book"
      :to="{ path: book.path }"
    >
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
      />
    </router-link>
    <div
      v-else
      class="book-cover"
    >
      <svg-icon icon-class="enjoy_reading logo" class="no-book-logo" />
    </div>
    <router-link
      :to="{ path: book.path }"
    >
      <p class="name">{{ book && book.name }}</p>
    </router-link>
    <p class="no-wrap author">{{ book && book.author }}</p>
    <p v-if="book" class="no-wrap">
      <span
        class="score"
      >{{ book.free ? '免费' : book.discount ? book.discountScore + scoreUnit : book.score + scoreUnit }}</span>
      <span
        v-if="!(book.free || !book.discount)"
        class="old-score"
      >{{ book.score + scoreUnit }}</span>
    </p>
  </div>
</template>

<script>
import DefaultCover from '@/components/DefaultCover'
import { XImg, Flexbox } from 'vux'
export default {
  name: 'ListBook',
  components: {
    DefaultCover,
    XImg,
    Flexbox
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
      scoreUnit: this.$store.state.app.scoreUnit
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.book-wrapper {
  padding-bottom: 25px;
  width: 210px;
  height: 480px;
  .book-cover {
    width: 100%;
    height: 309px;
    background-color: @lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
    .no-book-logo {
      font-size: 40px;
      color: @primary;
    }
  }
  .name {
    font-size: 24px;
    line-height: 27px;
    height: 64px;
    padding-top: 10px;
    overflow: hidden;
    word-break: break-all;
    &:hover {
      color: @primary;
    }
  }
  .author {
    font-size: 21px;
    color: @gray;
  }
  .score, .old-score {
    font-size: 21px;
  }
  .old-score {
    padding-left: 15px;
    color: @gray;
    text-decoration: line-through;
  }
}
</style>
