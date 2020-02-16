<template>
  <div class="content-inner">
    <!-- banner -->
    <flexbox>
      <swiper
        :list="bannerList"
        height="50vw"
        :loop="true"
        :auto="true"
      ></swiper>
    </flexbox>
    <!-- latest -->
    <Books
      text="最新上架"
      path="/latest"
      :books="latestList"
    ></Books>
    <!-- 打折书籍 -->
    <Books
      text="打折书籍"
      path="/discount"
      :books="discountList"
    />
    <!-- 免费书籍 -->
    <Books
      text="免费书籍"
      path="/free"
      :books="freeList"
    />
    <!-- 标签列表 -->
    <Tags
      v-if="tagList.length"
      text="书籍标签"
      :path="tagList[0] ? tagList[0].path : '404'"
      :tags="tagList"
    ></Tags>
  </div>
</template>

<script>
import { Flexbox, Swiper } from 'vux'
import { getBannerList, getLatestList, getDiscountList, getFreeList } from '@/api/home'
import Books from './components/Books'
import Tags from './components/Tags'
export default {
  name: 'Home',
  components: {
    Flexbox,
    Swiper,
    Books,
    Tags
  },
  data() {
    return {
      bannerList: [],
      latestList: [],
      discountList: [],
      freeList: [],
      storePrefix: this.$store.state.app.storePrefix
    }
  },
  computed: {
    // 标签列表
    tagList() {
      const temp = this.$store.state.app.tagList.slice(0, 10).map(item => {
        return {
          tag: item.tag,
          path: `/tag/${item.tag}`
        }
      })
      
      return temp
    }
  },
  created() {
    this.getBannerList()
    this.getLatestList()
    this.getDiscountList()
    this.getFreeList()
  },
  methods: {
    // 获取banner
    getBannerList() {
      getBannerList()
        .then(res => {
          this.bannerList = res.data.map(item => {
            return {
              url: item.href,
              img: this.storePrefix + item.image,
              // title: item.title
            }
          })
        })
        .catch(e => {
          this.$vux.toast.show({
            text: e.errorMsg || '获取banner失败',
            type: 'warn',
            width: 'auto'
          })
        })
    },
    // 获取最新书籍列表
    getLatestList() {
      getLatestList({
        rows: 6
      })
        .then(res => {
          let temp = Array.isArray(res.data) ? res.data : []
          temp = temp.concat(new Array(6).fill('')).slice(0, 6)
          temp.map(item => {
            if (item) {
              const temp = {
                path: '/latest',
                label: '最新上架'
              }
              item.path = `/book/detail/${item.name}/${item.uuid}?parent=${encodeURIComponent(JSON.stringify(temp))}`
            }
          })
          this.latestList = temp
        })
        .catch(e => {
          this.$vux.toast.show({
            text: e.errorMsg || '获取最新书籍失败',
            type: 'warn',
            width: 'auto'
          })
        })
    },
    // 获取打折书籍列表
    getDiscountList() {
      getDiscountList({
        rows: 6
      })
        .then(res => {
          let temp = Array.isArray(res.data) ? res.data : []
          temp = temp.concat(new Array(6).fill('')).slice(0, 6)
          temp.map(item => {
            if (item) {
              const temp = {
                path: '/discount',
                label: '打折书籍'
              }
              item.path = `/book/detail/${item.name}/${item.uuid}?parent=${encodeURIComponent(JSON.stringify(temp))}`
            }
          })
          this.discountList = temp
        })
        .catch(e => {
          this.$vux.toast.show({
            text: e.errorMsg || '获取打折书籍失败',
            type: 'warn',
            width: 'auto'
          })
        })
    },
    // 获取免费书籍列表
    getFreeList() {
      getFreeList({
        rows: 6
      })
        .then(res => {
          let temp = Array.isArray(res.data) ? res.data : []
          temp = temp.concat(new Array(6).fill('')).slice(0, 6)
          temp.map(item => {
            if (item) {
              const temp = {
                path: '/free',
                label: '免费书籍'
              }
              item.path = `/book/detail/${item.name}/${item.uuid}?parent=${encodeURIComponent(JSON.stringify(temp))}`
            }
          })
          this.freeList = temp
        })
        .catch(e => {
          this.$vux.toast.show({
            text: e.errorMsg || '获取免费书籍失败',
            type: 'warn',
            width: 'auto'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.content-inner {
  padding-bottom: 20px;
  /deep/ .vux-flex-row {
    .vux-slider {
      width: 100%;
    }
  }
  .section-title-wrapper {
    display: flex;
    justify-content: space-between;
    vertical-align: bottom;
    padding-top: 36px;
    .section-title {
      font-size: 36px;
      line-height: 36px;
      vertical-align: bottom;
    }
    .section-more {
      font-size: 28px;
      line-height: 36px;
      vertical-align: bottom;
    }
  }
}
</style>