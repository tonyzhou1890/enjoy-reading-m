<template>
  <div class="shelf-wrapper">
    <scroller
      lock-x
      scrollbar-y
      height="100%"
      :use-pulldown="false"
      @on-scroll-bottom="getMore"
      ref="scroller"
    >
      <div class="list-content-wrapper">
        <h1 class="no-wrap list-title">{{ title }}</h1>
        <div
          v-for="(item, index) in list"
          :key="index"
          class="book-container"
        >
          <ShelfBook
            :book="item"
            :removeShelf="removeShelf"
          ></ShelfBook>
        </div>
        <load-more
          v-if="loading || isAll"
          :show-loading="loading"
          :tip="tip"
        ></load-more>
      </div>
    </scroller>
  </div>
</template>

<script>
import { Scroller, LoadMore } from 'vux'
import ShelfBook from './components/ShelfBook'
import { getShelfBookList } from '@/api/shelf'
import { tipText } from '@/utils/setting'

const defaultData = {
  list: [],
  total: 0,
  loading: false,
  isAll: false,
  tip: '到底了'
}

export default {
  name: 'Shelf',
  components: {
    Scroller,
    LoadMore,
    ShelfBook
  },
  data() {
    return {
      ...JSON.parse(JSON.stringify(defaultData))
    }
  },
  computed: {
    title() {
      return `书架(${this.total})`
    }
  },
  created() {
    this.getMore()
  },
  activated() {
    if (this.$route.meta.keep) return
    this.setData()
    this.getMore()
  },
  methods: {
    // 重置
    setData() {
      const temp = JSON.parse(JSON.stringify(defaultData))
      Object.keys(temp).map(key => {
        this[key] = temp[key]
      })
    },
    // 触底
    getMore() {
      if (this.loading || this.isAll) return
      this.loading = true
      this.tip = tipText.loadMore
      getShelfBookList()
        .then(res => {
          this.total = res.total
          this.list = this.list.concat(res.data)
          this.loading = false
          if (this.list.length >= this.total) {
            this.tip = tipText.isAll
            this.isAll = true
          }
        })
        .catch(e => {
          this.$vux.toast.show({
            text: e.errorMsg || '获取书架书籍失败',
            type: 'warn',
            width: 'auto'
          })
          this.loading = false
        })
    },
    // 从书架移除
    removeShelf(uuid) {
      const temp = this.list.find(item => item.uuid === uuid)
      this.list.splice(this.list.indexOf(temp), 1)
      this.total = this.total - 1
    }
  }
}
</script>

<style lang="less" scoped>
.shelf-wrapper {
  width: 100%;
  height: 100%;
}
</style>