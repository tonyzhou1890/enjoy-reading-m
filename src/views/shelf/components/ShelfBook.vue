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
      <p class="no-wrap time">上次阅读：{{ book.updateTime.split(' ')[0] }}</p>
      <p class="no-wrap time">阅读进度：{{ showReadingPercent(book.percent) }}</p>
    </div>
    <!-- 操作 -->
    <div class="book-action-wrapper">
      <x-button
        type="primary"
        mini
        :show-loading="readLoading"
        @click.native="handleRead"
      >阅读</x-button>
      <x-button
        type="warn"
        mini
        :show-loading="removeLoading"
        @click.native="handleRemove"
      >移除</x-button>
    </div>
  </div>
</template>

<script>
import { readingInfoUpdate, readingInfoUpdateUrl, readingInfo } from '@/api/book'
import { getToken } from '@/utils/auth'
import DefaultCover from '@/components/DefaultCover'
import { XButton, XImg } from 'vux'
export default {
  name: 'ShelfBook',
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
    removeShelf: {
      required: true,
      type: Function
    }
  },
  data() {
    return {
      storePrefix: this.$store.state.app.storePrefix,
      scoreUnit: this.$store.state.app.scoreUnit,
      readLoading: false,
      removeLoading: false,
      readingInfo: {},
      reader: this.$store.state.app.reader,
      readerReferer: null, // 阅读器窗口引用
      readerUrl: ''
    }
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleOnMessage)
  },
  methods: {
    // 点击阅读按钮
    handleRead() {
      this.readLoading = true
      readingInfo({
        uuid: this.book.uuid
      })
        .then(res => {
          this.readingInfo = res.data
          this.readLoading = false
          this.readerUrl = `${this.reader}?message=true`
          this.readerReferer = window.open(this.readerUrl)
          window.removeEventListener('message', this.handleOnMessage)
          window.addEventListener('message', this.handleOnMessage)
        })
        .catch(e => {
          this.$vux.toast.show({
            text: e.errorMsg || '获取阅读信息失败',
            type: 'warn',
            width: 'auto'
          })
          this.readLoading = false
        })
    },
    // 点击移除按钮
    handleRemove() {
      this.removeLoading = true
      readingInfoUpdate({
        uuid: this.book.uuid,
        onShelf: 0
      })
        .then(res => {
          this.$vux.toast.show({
            text: '成功从书架移除',
            type: 'success',
            width: 'auto'
          })
          this.removeLoading = false
          this.removeShelf(this.book.uuid)
        })
        .catch(e => {
          this.$vux.toast.show({
            text: e.errorMsg || '操作失败',
            type: 'warn',
            width: 'auto'
          })
          this.removeLoading = false
        })
    },
    // 阅读进度展示
    showReadingPercent(percent) {
      if (!percent) {
        return '未开始'
      }
      const temp = percent.toFixed(2)
      if (temp >= 100) {
        return '已读完'
      }
      return `${temp}%`
    },
    // 给阅读器发送信息
    handleOnMessage(e) {
      if (e.data && e.data.from === 'reader' && e.data.data === 'ready') {
        const postData = {
          key: Date.now(),
          dest: 'reader',
          data: {
            ...this.readingInfo,
            title: this.readingInfo.name,
            textPath: this.storePrefix + this.readingInfo.textPath,
            frontCoverPath: this.readingInfo.frontCoverPath ? this.storePrefix + this.readingInfo.frontCoverPath : '',
            backCoverPath: this.readingInfo.backCoverPath ? this.storePrefix + this.readingInfo.backCoverPath : ''
          },
          request: {
            url: readingInfoUpdateUrl,
            method: 'POST',
            data: {
              uuid: this.readingInfo.uuid
            },
            headers: {
              token: getToken()
            }
          }
        }
        this.readerReferer.postMessage(postData, this.readerUrl)
      }
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
    width: 100PX;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
</style>
