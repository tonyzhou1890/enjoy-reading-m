<template>
  <div id="app">
    <Header></Header>
    <div class="content-container" :class="$route.meta.scroller ? 'no-padding' : ''">
      <keep-alive :include="cacheViews">
        <router-view :key="$route.fullPath"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
export default {
  name: 'App',
  components: {
    Header
  },
  computed: {
    cacheViews() {
      return this.$store.state.app.cacheViews
    }
  },
  created() {
    this.onResize()
    this.$store.dispatch('app/getTagList')
  },
  metaInfo() {
    return {
      title: this.$store.state.app.metaTitle || '享阅'
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        this.changeKeep(to, from)
      }
    }
  },
  methods: {
    // 改变路由缓存字段
    changeKeep(to, from) {
      // 是否需要改变缓存
      if (!from || !from.meta || from.meta.keep === undefined) return

      if (!Array.isArray(from.meta.keepTo) || from.meta.keepTo.includes(to.name)) {
        from.meta.keep = true
      } else {
        from.meta.keep = false
        this.$nextTick(() => {
          from.meta.keep = true
          this.setCacheViews(to, from)
        })
      }
      this.setCacheViews(to, from)
    },
    // 设置缓存页面
    setCacheViews(to, from) {
      let routes = this.$router.options.routes
      routes = routes.filter(route => route.meta && route.meta.keep).map(route => route.name)
      console.log(routes)
      this.$store.commit('app/SET_DATA', {
        cacheViews: routes
      })
    },
    onResize() {
      let el = document.documentElement
      let resize = 'orientationchange' in window ? 'orientationchange' : 'resize'
      let dealResize = () => {
        let width = el.clientWidth
        // 使用 vw 单位，不需要设置根元素字体大小了
        // width && (el.style.fontSize = width / 10 + 'px')
        this.$store.commit('app/SET_DATA', { width })
      }
      dealResize()
      window.addEventListener(resize, dealResize, !1)
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import url('~@/style/variables.less');

body {
  background-color: @background;
  #app {
    // padding: 0 10px;
    width: 100%;
    height: 100%;
    .content-container {
      height: calc(~'100vh - 70px');
      padding: 0 10px;
      overflow: auto;
      // padding-top: 80px;
      &.no-padding {
        padding: 0;
      }
    }
  }
}
</style>
