<template>
  <div class="discount-wrapper">
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
          class="books-container"
        >
          <div
            v-for="(item, index) in list"
            :key="index"
            class="book-container"
          >
            <ListBook
              :book="item"
            ></ListBook>
          </div>
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
import { Scroller, LoadMore, Flexbox, FlexboxItem } from 'vux'
import ListBook from '@/components/ListBook'
import { getDiscountList } from '@/api/home'
import { tipText } from '@/utils/setting'

const defaultData = {
  list: [],
  total: 0,
  page: 0,
  rows: 9,
  loading: false,
  isAll: false,
  tip: '到底了'
}

export default {
  name: 'Discount',
  components: {
    Scroller,
    LoadMore,
    Flexbox,
    FlexboxItem,
    ListBook
  },
  data() {
    return {
      title: '打折书籍',
      ...JSON.parse(JSON.stringify(defaultData))
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
      const params = {
        page: this.page + 1,
        rows: this.rows
      }
      getDiscountList(params)
        .then(res => {
          this.total = res.total
          res.data.map(item => {
            item.path = `/book/detail/${item.name}/${item.uuid}`
          })
          this.list = this.list.concat(res.data)
          this.page = params.page
          this.loading = false
          if (this.list.length >= this.total) {
            this.tip = tipText.isAll
            this.isAll = true
          }
        })
        .catch(e => {
          this.$vux.toast.show({
            text: e.errorMsg || '获取打折书籍失败',
            type: 'warn',
            width: 'auto'
          })
        })
        this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.discount-wrapper {
  width: 100%;
  height: 100%;
  .books-container {
    overflow: auto;
    .book-container {
      float: left;
      width: 33.333%;
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