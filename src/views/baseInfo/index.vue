<template>
  <div class="base-info-wrapper">
    <!-- 用户信息 -->
    <div class="base-info-container">
      <!-- 头像 -->
      <div class="avatar-wrapper">
        <div class="avatar">
          <img
            class="avatar-img"
            :src="storePrefix + (userInfo.avatar ? userInfo.avatar : '/images/avatar/default.jpg')"
          />
        </div>
      </div>
      <div class="info-wrapper">
        <p class="info-item">{{ userInfo.nickname }}</p>
        <p class="info-item">{{ userInfo.score }}积分</p>
        <!-- <p class="info-item">空间：
          <span
            class="progress"
          >
            <span
              class="used-percent"
              :style="{
                width: `${(userInfo.privateSpace + userInfo.storeSpace).toFixed(0)/userInfo.totalSpace * 100}%`
              }"
            ></span>
          </span>
          {{ `${(userInfo.privateSpace + userInfo.storeSpace).toFixed(0)}/${userInfo.totalSpace}(Mb)` }}
        </p> -->
        <p class="info-item">{{ userInfo.createTime.split(' ')[0] }}开始使用</p>
      </div>
    </div>
    <!-- 用户菜单 -->
    <ul class="user-menu">
      <router-link
        v-for="(item, index) in menus"
        :key="index"
        :title="item.title"
        :to="item.path"
      >
        <li>{{ item.title }}</li>
      </router-link>
      <li
        class="no-path"
        @click="handleLogout"
      >退出账户</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'BaseInfo',
  data() {
    return {
      storePrefix: this.$store.state.app.storePrefix,
      menus: [
        {
          title: '书架',
          path: '/shelf'
        },
        {
          title: '书库',
          path: '/store'
        },
        {
          title: '购物车',
          path: '/shoppingCart'
        },
        {
          title: '积分记录',
          path: '/scoreRecord'
        }
      ]
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    // 退出
    handleLogout() {
      this.$store.dispatch('user/logout')
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.base-info-wrapper {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  .base-info-container {
    background-color: @primary;
    width: 100%;
    height: 200px;
    border-radius: 20px;
    display: flex;
    padding: 20px;
    .avatar-wrapper {
      width: 160px;
      height: 100%;
      .avatar {
        width: 100%;
        height: 100%;
        .avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }
    }
    .info-wrapper {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding-left: 20px;
      .info-item {
        flex: 1;
        color: white;
        font-size: 28px;
        .progress {
          display: inline-block;
          width: 200px;
          height: 20px;
          background-color: white;
          border-radius: 10px;
          position: relative;
          overflow: hidden;
          .used-percent {
            position: absolute;
            height: 100%;
            background-color: @lightgray;
            width: attr(data-percent);
            left: 0;
            top: 0;
          }
        }
      }
    }
  }
  .user-menu {
    width: 100%;
    margin-top: 20px;
    border-top: 1px solid @lightgray;
    li {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      height: 80px;
      font-size: 36px;
      padding: 0 20px;
      border-bottom: 1px solid @lightgray;
      background-color: #fff;
      &:not(.no-path)::after {
        content: ' ';
        position: absolute;
        right: 20px;
        width: 16px;
        height: 16px;
        border: 4px solid @lightgray;
        border-bottom: 0px;
        border-left: 0px;
        transform: rotate(45deg);
      }
    }
  }
}
</style>