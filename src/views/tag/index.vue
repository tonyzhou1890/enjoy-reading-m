<template>
  <div class="tag-books-wrapper">
    <div class="left">
      <TagList
        :tags="tagList"
        :tag="tag"
      ></TagList>
    </div>
    <div class="right">
      <scroller
        lock-x
        scrollbar-y
        height="100%"
        :use-pulldown="false"
        @on-scroll-bottom="getMore"
        ref="scroller"
      >
        <div class="list-content-wrapper">
          <div
            class="books-container"
          >
            <TagBookItem
              v-for="(item, index) in list"
              :key="index"
              :book="item"
            />
          </div>
          <load-more
            v-if="loading || isAll"
            :show-loading="loading"
            :tip="tip"
          ></load-more>
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
import { Scroller, LoadMore } from 'vux'
import TagList from './components/TagList'
import TagBookItem from './components/TagBookItem'
import { getTagBookList } from '@/api/tag'
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
  name: 'Tag',
  components: {
    Scroller,
    LoadMore,
    TagList,
    TagBookItem
  },
  data() {
    return {
      ...JSON.parse(JSON.stringify(defaultData))
    }
  },
  computed: {
    // 标签列表
    tagList() {
      const temp = this.$store.state.app.tagList.map(item => {
        return {
          tag: item.tag,
          path: `/tag/${item.tag}`
        }
      })
      return temp
    },
    // 当前标签
    tag() {
      return this.$route.params.tag || ''
    }
  },
  created() {
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
        tag: this.tag,
        page: this.page + 1,
        rows: this.rows
      }
      getTagBookList(params)
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
            text: e.errorMsg || '获取书籍失败',
            type: 'warn',
            width: 'auto'
          })
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.tag-books-wrapper {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  display: flex;
  .left {
    flex: 1;
  }
  .right {
    flex: 3;
    .list-content-wrapper {
      padding-top: 0;
    }
  }
}
</style>