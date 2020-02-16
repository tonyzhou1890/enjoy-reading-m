<template>
  <div class="book-wrapper">
    <!-- 封面 -->
    <div class="book-cover-wrapper">
      <router-link :to="{ path: book.path }">
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
      <p class="name">{{ book && book.name }}</p>
      <p class="no-wrap author">{{ book && book.author }}</p>
      <p class="no-wrap time">加入时间：{{ book.createTime.split(' ')[0] }}</p>
      <p class="no-wrap time">位置：{{ book.position === 1 ? '个人空间' : '书城' }}</p>
    </div>
    <!-- 操作 -->
    <div class="book-action-wrapper">
      <x-button
        type="primary"
        mini
        @click.native="handleDetail"
      >详情</x-button>
      <x-button
        v-if="!book.onShelf"
        type="primary"
        mini
        :show-loading="shelfLoading"
        @click.native="handleShelf"
      >加入书架</x-button>
    </div>
  </div>
</template>

<script>
import { readingInfoUpdate } from '@/api/book'
import DefaultCover from '@/components/DefaultCover'
import { XButton, XImg } from 'vux'
export default {
  name: 'TagBookItem',
  components: {
    DefaultCover,
    XButton,
    XImg
  },
  props: {
    book: {
      required: true,
      type: [Object, String]
    },
    addToShelf: {
      required: true,
      type: Function
    }
  },
  data() {
    return {
      storePrefix: this.$store.state.app.storePrefix,
      scoreUnit: this.$store.state.app.scoreUnit,
      shelfLoading: false
    }
  },
  methods: {
    handleDetail() {
      this.$router.push({
        path: this.book.path
      })
    },
    handleShelf() {
      this.shelfLoading = true
      readingInfoUpdate({
        uuid: this.book.uuid,
        onShelf: 1
      })
        .then(res => {
          this.$vux.toast.show({
            text: '成功加入书架',
            type: 'success',
            width: 'auto'
          })
          this.shelfLoading = false
          this.addToShelf(this.book.uuid)
        })
        .catch(e => {
          this.$vux.toast.show({
            text: e.errorMsg || '操作失败',
            type: 'warn',
            width: 'auto'
          })
          this.shelfLoading = false
        })
    },
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
  .book-action-wrapper {
    width: 130PX;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
</style>
