<template>
  <div class="book-wrapper">
    <!-- 封面 -->
    <div class="book-cover-wrapper">
      <router-link
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
          :width="20.16"
          :height="29.7"
        />
      </router-link>
    </div>
    <!-- 其他信息 -->
    <div class="book-info-wrapper">
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
  </div>
</template>

<script>
import DefaultCover from '@/components/DefaultCover'
import { XImg, Flexbox } from 'vux'
export default {
  name: 'TagBookItem',
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
