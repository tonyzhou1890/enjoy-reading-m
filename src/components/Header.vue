<template>
  <div class="header-container">
    <!-- logo -->
    <div class="logo-container">
      <router-link
        to="/"
      >
        <img
          :src="logo"
          class="logo"
        />
      </router-link>
    </div>
    <!-- search -->
    <div
      class="search-container"
    >
      <input
        v-model="keyword"
        placeholder="书名"
        @keypress.enter="toSearch"
        class="search"
      />
      <svg-icon
        icon-class="search"
        class-name="search-icon"
        @click.native="toSearch"
      ></svg-icon>
    </div>
    <!-- my-menu -->
    <div class="user-container">
      <!-- 未登录 -->
      <div v-if="!userInfo" class="not-login">
        <a :href="registerHrefPrefix + '/#/?from=' + fullPath" target="_self">
          <img
            class="avatar"
            :src="storePrefix + '/images/avatar/default.jpg'"
          />
        </a>
      </div>
      <!-- 已登录 -->
      <div v-else class="has-login">
        <router-link
          :to="{ path: '/baseInfo' }"
        >
          <div class="avatar">
            <x-img
              :src="storePrefix + (userInfo.avatar ? userInfo.avatar : '/images/avatar/default.jpg')"
            />
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { Search, XImg } from 'vux'

export default {
  components: {
    Search,
    XImg
  },
  data () {
    return {
      registerHrefPrefix: this.$store.state.app.registerPrefix,
      storePrefix: this.$store.state.app.storePrefix,
      logo: require('@/assets/logo.png'),
      keyword: '',
      menus: [],
      focusSearch: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    },
    fullPath() {
      return encodeURI(window.location.href) || encodeURI(this.$route.fullPath)
    }
  },
  methods: {
    // 搜索
    toSearch() {
      if (this.keyword) {
        this.$router.push({ path: `/search/${this.keyword}` })
      }
    },
    // 搜索框聚焦/失焦
    // handleSearchStatus() {
    //   setTimeout(() => {
    //     this.focusSearch = !this.focusSearch
    //   }, 1000)
    // }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.header-container {
  width: 100%;
  height: 70px;
  // position: fixed;
  display: flex;
  left: 0;
  top: 0;
  padding: 10px 10px 0 10px;
  background-color: #fff;
  z-index: 10;
  .logo-container {
    width: 160px;
    height: 100%;
    .logo {
      width: 100%;
      height: 100%;
      vertical-align: middle;
      outline: none;
    }
  }
  .search-container {
    flex: 1;
    height: 100%;
    padding: 4px 10px;
    position: relative;
    .search {
      width: 100%;
      height: 100%;
      font-size: 16px;
      padding: 10px;
      color: @primary;
      border-radius: 23px;
      border: 1px solid @primary;
      outline: none;
      padding-right: 40px;
      vertical-align: top;
      &:focus {
        box-shadow: 0 1px 2px @primary;
      }
    }
    .search-icon {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 20px;
      height: 20px;
      color: @primary;
      cursor: pointer;
    }
  }
  .user-container {
    width: 60px;
    height: 100%;
    .not-login, .has-login {
      width: 100%;
      height: 100%;
    }
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      /deep/ .vux-x-img {
        width: 100%;
        height: 100%;
      }
    }
    .avatar {
      width: 100%;
      height: 100%;
      border: 1px solid @primary;
      border-radius: 50%;
      overflow: hidden;
    }
  }
}
</style>
