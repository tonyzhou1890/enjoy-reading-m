<template>
  <div class="shopping-cart-wrapper">
    <div class="goods-list-wrapper">
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
            <div class="book-check">
              <check-icon :value.sync="item.checked"></check-icon>
            </div>
            <div class="book-item-container">
              <ShoppingCartBook
                :book="item"
              ></ShoppingCartBook>
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
    <div class="action-bar">
      <div class="action-check-all">
        <check-icon
          :value.sync="checkAll"
          :disabled="!list.length"
        ></check-icon>
      </div>
      <div class="action-score">
        <span>{{ allScore }}</span>
      </div>
      <div class="action-buttons">
        <div class="button-item-wrapper">
          <x-button
            type="warn"
            mini
            :disabled="buttonDisabled"
            @click.native="handleDelete"
          >删除</x-button>
        </div>
        <div class="button-item-wrapper">
          <x-button
            type="primary"
            mini
            :disabled="buttonDisabled"
            @click.native="handleSettle"
          >结算</x-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Scroller, LoadMore, CheckIcon, XButton } from 'vux'
import ShoppingCartBook from './components/ShoppingCartBook'
import { getShoppingCartList, shoppingCartSubtract, shoppingCartSettle } from '@/api/shoppingCart'
import { tipText } from '@/utils/setting'

const defaultData = {
  list: [],
  total: 0,
  loading: false,
  isAll: false,
  tip: '到底了',
  // 删除
  deleteItem: {
    content: '' // 提示内容
  },
  // 结算
  settleItem: {
    content: ''
  },
}

export default {
  name: 'ShppingCart',
  components: {
    Scroller,
    LoadMore,
    CheckIcon,
    XButton,
    ShoppingCartBook
  },
  data() {
    return {
      ...JSON.parse(JSON.stringify(defaultData)),
      scoreUnit: this.$store.state.app.scoreUnit
    }
  },
  computed: {
    title() {
      return `购物车(${this.total})`
    },
    // 是否全选
    checkAll: {
      get() {
        return Boolean(this.list.length && this.list.every(item => item.checked))
      },
      set() {
        if (this.list.every(item => item.checked)) {
          this.list.map(item => item.checked = false)
        } else {
          this.list.map(item => item.checked = true)
        }
      }
    },
    // 需要支付的积分
    allScore() {
      let score = 0
      this.list.filter(item => item.checked).map(item => {
        if (item.discount) {
          score += item.discountScore
        } else {
          score += item.score
        }
      })
      return `${score}${this.scoreUnit}`
    },
    // 按钮是否禁用
    buttonDisabled() {
      return !this.list.filter(item => item.checked).length
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
      getShoppingCartList()
        .then(res => {
          this.total = res.total
          res.data.map(item => {
            item.checked = false
          })
          this.list = res.data
          this.loading = false
          if (this.list.length >= this.total) {
            this.tip = tipText.isAll
            this.isAll = true
          }
        })
        .catch(e => {
          this.$vux.toast.show({
            text: e.errorMsg || '获取购物车失败',
            type: 'warn',
            width: 'auto'
          })
          this.loading = false
        })
    },
    // 结算
    handleSettle() {
      const uuids = this.list.filter(item => item.checked).map(item => item.uuid)
      this.settleItem.content = `确认计算吗？`
      this.$vux.confirm.show({
        title: '结算',
        content: this.settleItem.content,
        closeOnConfirm: false,
        onConfirm: () => {
          shoppingCartSettle({
            uuid: uuids
          })
            .then(res => {
              this.isAll = false
              this.getMore()
              this.$store.dispatch('user/getInfo')
              this.$vux.confirm.hide()
              this.$vux.toast.show({
                text: '结算成功',
                type: 'success',
                width: 'auto'
              })
            })
            .catch(e => {
              console.log(e)
              this.$vux.confirm.hide()
              this.$vux.toast.show({
                text: e.errorMsg || '操作失败',
                type: 'warn',
                width: 'auto'
              })
            })
        },
        onCancel: () => {
          this.$vux.confirm.hide()
        }
      })
    },
    // 删除
    handleDelete() {
      let uuids = this.list.filter(item => item.checked).map(item => item.uuid)
      this.deleteItem.content = `确认从购物车删除选中书籍吗？`
      this.$vux.confirm.show({
        title: '删除',
        content: this.deleteItem.content,
        closeOnConfirm: false,
        onConfirm: () => {
          shoppingCartSubtract({
            uuid: uuids
          })
            .then(res => {
              this.isAll = false
              this.getMore()
              this.$store.dispatch('user/getInfo')
              this.$vux.confirm.hide()
            })
            .catch(e => {
              console.log(e)
              this.$vux.confirm.hide()
              this.$vux.toast.show({
                text: e.errorMsg || '操作失败',
                type: 'warn',
                width: 'auto'
              })
            })
        },
        onCancel: () => {
          this.$vux.confirm.hide()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.shopping-cart-wrapper {
  width: 100%;
  height: 100%;
  .goods-list-wrapper {
    height: calc(~'100% - 40PX');
    width: 100%;
    .list-content-wrapper {
      .book-container {
        display: flex;
        align-items: center;
        .book-check {
          width: 40PX;
        }
        .book-item-container {
          flex: 1;
        }
      }
    }
  }
  .action-bar {
    height: 40PX;
    background-color: @primary;
    display: flex;
    align-items: center;
    color: white;
    .action-check-all {
      width: 40PX;
    }
    .action-score {
      flex: 1;
    }
    .action-buttons {
      width: 140PX;
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>