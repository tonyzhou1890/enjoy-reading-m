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
          class="record-container"
        >
          <p class="record-info-row row-1">
            <span class="record-info-col col-1">{{ item.way }}</span>
            <span class="record-info-col col-2">{{ item.score > 0 ? `+${item.score}` : item.score }}</span>
          </p>
          <p class="record-info-row row-2">
            <span class="record-info-col col-1">{{ item.createTime }}</span>
            <span class="record-info-col col-2">{{ item.totalScore }}</span>
          </p>
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
import { getScoreRecord } from '@/api/scoreRecord'
import { tipText } from '@/utils/setting'

const defaultData = {
  list: [],
  total: 0,
  page: 0,
  rows: 10,
  loading: false,
  isAll: false,
  tip: '到底了'
}

export default {
  name: 'ScoreRecord',
  components: {
    Scroller,
    LoadMore
  },
  data() {
    return {
      ...JSON.parse(JSON.stringify(defaultData))
    }
  },
  computed: {
    title() {
      return `积分记录`
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
        keyword: '',
        position: 0,
        page: this.page + 1,
        rows: this.rows
      }
      getScoreRecord(params)
        .then(res => {
          this.total = res.total
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
            text: e.errorMsg || '获取书库书籍失败',
            type: 'warn',
            width: 'auto'
          })
          this.loading = false
        })
    },
    // 添加到书架
    addToShelf(uuid) {
      const temp = this.list.find(item => item.uuid === uuid)
      temp.onShelf = 1
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.shelf-wrapper {
  width: 100%;
  height: 100%;
  .list-content-wrapper {
    .record-container {
      border-bottom: 1px solid @lightgray;
      padding: 12px 0;
      .record-info-row {
        display: flex;
        color: #333;
        font-size: 32px;
        &.row-2 {
          color: @gray;
          font-size: 18px;
        }
        .record-info-col {
          &.col-1 {
            flex: 4;
          }
        }
        .record-info-col {
          &.col-2 {
            flex: 1;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>