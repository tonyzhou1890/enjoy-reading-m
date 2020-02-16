<template>
  <div class="detail-wrapper">
    <!-- 内容 -->
    <div
      :loading="loading"
      class="detail-content-wrapper"
    >
      <!-- 书籍信息 -->
      <div class="detail-content" v-if="detail.uuid">
        <div class="detail-content-top">
          <!-- 封面 -->
          <div class="detail-cover-wrapper">
            <x-img
              v-if="detail.frontCoverPath"
              fit="fill"
              :src="`${storePrefix}${detail.frontCoverPath}`"
              class="detail-cover"
            />
            <DefaultCover
              v-else
              :width="39.2"
              :height="54.7"
              :text="detail.name"
            />
          </div>
          <!-- 书籍信息 -->
          <div class="detail-text-wrapper">
            <p class="name">{{ detail.name }}</p>
            <p>作者：{{ detail._author }}</p>
            <p>书号：{{ detail.ISBN }}</p>
            <p>上架时间：{{ detail._createTime }}</p>
            <p>书籍大小：{{ detail.bookSize }}K</p>
            <p>
              <span
                class="score"
              >{{ detail.free ? '免费' : detail.discount ? `${detail.discountScore || ''}${scoreUnit}` : `${detail.score || ''}${scoreUnit}` }}</span>
              <span
                v-if="!(detail.free || !detail.discount)"
                class="old-score"
              >{{ detail.score }}{{ scoreUnit }}</span>
            </p>
            <p>标签：
              <span
                v-for="(item, index) in detail._tag"
                :key="index"
              >
                <router-link
                  :to="{ path: `/tag/${item}` }"
                  class="detail-tag-item"
                >{{ item }}</router-link>
              </span>
            </p>
            <flexbox class="detail-action">
              <flexbox-item
                v-if="!detail.has && !detail.free && !inShoppingCart()">
                <x-button
                  type="primary"
                  mini
                  :show-loading="buyLoading"
                  @click.native="handleBuy"
                >立即购买</x-button>
              </flexbox-item>
              <flexbox-item
                v-if="!detail.has && !detail.free">
                <x-button
                  mini
                  :disabled="inShoppingCart()"
                  :show-loading="addShoppingCartLoading"
                  @click.native="handleAddShoppingCart"
                >
                  {{ inShoppingCart() ? '已在购物车': '加入购物车' }}
                </x-button>
              </flexbox-item>
              <flexbox-item
                v-if="detail.has || detail.free">
                <x-button
                  type="primary"
                  mini
                  :show-loading="readLoading"
                  @click.native="handleRead"
                >阅读</x-button>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
        <!-- 简介 -->
        <div class="detail-summary-wrapper">
          <p>简介：</p>
          <p class="detail-summary">{{ detail.summary || '暂无' }}</p>
        </div>
      </div>
    </div>
    <!-- 推荐书籍 -->
    <div class="detail-recommend-wrapper" v-if="detail.uuid">
      <p class="detail-recommend-text">推荐书籍</p>
      <div
        class="books-container"
      >
        <div
          v-for="(item, index) in recommend"
          :key="index"
          class="book-container"
        >
          <ListBook
            :book="item"
          ></ListBook>
        </div>
      </div>
      <Empty
        v-if="recommend.length === 0"
      />
    </div>
    <!-- 没有书籍 -->
    <Empty
      v-if="!loading && !detail.uuid"
    />
  </div>
</template>

<script>
import { getBookDetail, getBookRecommend } from '@/api/detail'
import { readingInfo, readingInfoUpdateUrl } from '@/api/book'
import { shoppingCartAdd, shoppingCartSettle } from '@/api/shoppingCart'
import { getToken } from '@/utils/auth'
import { Flexbox, FlexboxItem, XButton, XImg } from 'vux'
import DefaultCover from '@/components/DefaultCover'
import ListBook from '@/components/ListBook'
import Empty from '@/components/Empty'
export default {
  name: 'Detail',
  components: {
    Flexbox,
    FlexboxItem,
    XButton,
    XImg,
    DefaultCover,
    ListBook,
    Empty
  },
  data() {
    return {
      name: '', // 书籍名称
      uuid: '', // 书籍uuid
      loading: false, // 页面加载
      detail: {}, // 书籍详情
      recommend: [], // 推荐书籍
      parent: null, // 父级面包屑
      breadcrumb: [], // 面包屑
      storePrefix: this.$store.state.app.storePrefix, // 静态资源地址
      scoreUnit: this.$store.state.app.scoreUnit, // 积分单位
      buyLoading: false, // 立即购买按钮loading
      addShoppingCartLoading: false, // 加入购物车loading
      readingInfo: {},
      reader: this.$store.state.app.reader,
      readerReferer: null, // 阅读器窗口引用
      readerUrl: `${this.$store.state.app.reader}?message=true`,
      readLoading: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  created() {
    this.resolvePath()
    this.getBookDetail()
    this.getBookRecommend()
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleOnMessage)
  },
  methods: {
    // 解析url路径参数
    resolvePath() {
      this.name = this.$route.params.name
      this.uuid = this.$route.params.uuid
      // 面包屑的解析目前用不到--移动版没有
      // 第一个是首页
      const breadcrumb = [
        {
          label: '首页',
          path: '/'
        }
      ]
      // 尝试解析父级--第二个
      if (this.$route.query.parent) {
        let parent = null
        try {
          parent = decodeURIComponent(this.$route.query.parent)
          parent = JSON.parse(parent)
        } catch (e) {
          console.error(e)
        }
        if (parent && Object.keys(parent).length) {
          this.parent = parent
          breadcrumb.push({
            label: parent.label,
            path: parent.path
          })
        }
      }
      // 当前页
      breadcrumb.push({
        label: this.name
      })
      this.breadcrumb = breadcrumb
    },
    // 获取书籍详情
    getBookDetail() {
      this.loading = true
      getBookDetail({
        uuid: this.uuid
      })
        .then(res => {
          // 处理数据
          res.data._author = res.data.author ? res.data.author.replace(/,/g, '、') : ''
          res.data._createTime = res.data.createTime ? res.data.createTime.split(' ')[0] : ''
          res.data._tag = res.data.tag ? res.data.tag.split(',') : []
          this.detail = res.data
          // 移动版目前不用面包屑
          // 如果页面路径不含parent信息，则用书籍第一个标签作为parent
          if (!this.parent) {
            this.parent = {
              path: '/tag/' + res.data.tag.split(',')[0],
              label: res.data.tag.split(',')[0]
            }
            const temp = JSON.parse(JSON.stringify(this.breadcrumb))
            temp.splice(1, 0, this.parent)
            this.breadcrumb = temp
          }
          this.loading = false
          // 设定页面title
          this.$store.commit('app/SET_DATA', {
            metaTitle: `享阅·${this.detail.name}`
          })
        })
        .catch(e => {
          this.$vux.toast.show({
            text: '获取书籍详情失败',
            type: 'warn',
            width: 'auto'
          })
          this.loading = false
        })
    },
    // 获取推荐书籍
    getBookRecommend() {
      getBookRecommend({
        uuid: this.uuid
      })
        .then(res => {
          this.recommend = res.data.map(item => {
            item.path = `/book/detail/${item.name}/${item.uuid}`
            return item
          })
        })
        .catch(e => {
          this.$vux.toast.show({
            text: '获取推荐书籍失败',
            type: 'warn',
            width: 'auto'
          })
        })
    },
    // 处理立即购买
    handleBuy() {
      // 如果另一个按钮loading，也不处理
      if (this.addShoppingCartLoading) return

      if (!this.userInfo) {
        this.handleNotLogin()
      } else {
        // 弹框确认
        this.$confirm(`确定购买《${this.name}》吗？`, '提示', {
          confirmButtonText: '购买',
          cancelButtonText: '取消',
          type: 'info'
        })
          .then(() => { // 确定购买
            this.buyLoading = true
            shoppingCartSettle({
              uuid: this.uuid,
              buy: true
            })
              .then(res => {
                this.buyLoading = false
                this.$vux.toast.show({
                  text: '购买成功',
                  type: 'success',
                  width: 'auto'
                })
                this.detail.has = 1
              })
              .catch(e => {
                this.buyLoading = false
                this.$vux.toast.show({
                  text: '购买失败',
                  type: 'warn',
                  width: 'auto'
                })
              })
          })
          .catch(() => {
            console.log('取消')
          })
      }
      console.log('buy')
    },
    // 处理加入购物车
    handleAddShoppingCart() {
      // 如果另一个按钮loading，也不处理
      if (this.buyLoading) return

      if (!this.userInfo) {
        this.handleNotLogin()
      } else {
        this.addShoppingCartLoading = true
        shoppingCartAdd({
          uuid: this.detail.uuid
        })
          .then(res => {
            this.$store.dispatch('user/getInfo')
              .then(infoRes => {
                this.addShoppingCartLoading = false
                this.$vux.toast.show({
                  text: '加入购物车成功',
                  type: 'success',
                  width: 'auto'
                })
              })
              .catch(e => {
                this.$vux.toast.show({
                  text: '获取用户信息失败',
                  type: 'warn',
                  width: 'auto'
                })
                this.addShoppingCartLoading = false
              })
          })
          .catch(e => {
            this.$vux.toast.show({
              text: '加入购物车失败',
              type: 'warn',
              width: 'auto'
            })
            this.addShoppingCartLoading = false
          })
      }
    },
    // 处理阅读
    handleRead() {
      this.readingInfo = {
        uuid: this.detail.uuid,
        title: this.detail.name,
        textPath: this.storePrefix + this.detail.textPath,
        frontCoverPath: this.detail.frontCoverPath ? this.storePrefix + this.detail.frontCoverPath : '',
        backCoverPath: this.detail.backCoverPath ? this.storePrefix + this.detail.backCoverPath : ''
      }
      // 已经登录
      if (this.userInfo) {
        // 如果已经有了这本书
        if (this.detail.has) {
          this.readingInfo = {
            ...this.readingInfo,
            uuid: this.detail.readingInfo.uuid,
            percent: this.detail.readingInfo.percent,
            updateTime: this.detail.readingInfo.updateTime
          }
          this.handleOpenReader()
        } else {
          this.readLoading = true
          readingInfo({
            uuid: this.detail.uuid,
            type: 'book'
          })
            .then(res => {
              this.readingInfo = {
                ...this.readingInfo,
                uuid: res.data.uuid,
                percent: res.data.percent,
                updateTime: res.data.updateTime
              }
              this.readLoading = false
              this.handleOpenReader()
              this.getBookDetail()
            })
            .catch(e => {
              this.$vux.toast.show({
                text: '获取阅读信息失败',
                type: 'warn',
                width: 'auto'
              })
              this.readLoading = false
            })
        }
      } else {
        // 未登录

        this.handleOpenReader()
      }
    },
    // 打开阅读器
    handleOpenReader() {
      this.readerReferer = window.open(this.readerUrl)
      window.removeEventListener('message', this.handleOnMessage)
      window.addEventListener('message', this.handleOnMessage)
    },
    // 接收到阅读器的消息
    handleOnMessage(e) {
      if (e.data && e.data.from === 'reader' && e.data.data === 'ready') {
        const postData = {
          key: Date.now(),
          dest: 'reader',
          data: {
            ...this.readingInfo
          }
        }
        if (this.userInfo) {
          postData.request = {
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
    },
    // 处理未登录
    handleNotLogin() {
      const self = this
      this.$vux.confirm.show({
        title: '提示',
        content: '你尚未登录, 是否登录?',
        onShow () {
          console.log('plugin show')
        },
        onHide () {
          console.log('plugin hide')
        },
        onCancel () {
          console.log('plugin cancel')
        },
        onConfirm () {
          window.open(`${self.$store.state.app.registerPrefix}/#/?from=${encodeURI(window.location.href)}`, '_self')
        }
      })
    },
    // 书籍是否在购物车中
    inShoppingCart() {
      const temp = this.detail && this.userInfo && this.userInfo.shoppingCart && this.userInfo.shoppingCart.includes(this.detail.uuid)
      return Boolean(temp)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.detail-wrapper {
  padding: 50px 0;
  .detail-content-wrapper {
    padding: 0;
    display: flex;
    .detail-content {
      flex: 1;
      .detail-content-top {
        display: flex;
        .detail-cover-wrapper {
          width: 300px;
          .detail-cover {
            width: 294px;
            height: 410px;
          }
        }
        .detail-text-wrapper {
          flex: 1;
          padding-left: 24px;
          color: @gray;
          .name {
            font-size: 28px;
            font-weight: bold;
            color: #333;
          }
          p {
            font-size: 30px;
            .score {
              color: #333;
            }
            .old-score {
              text-decoration: line-through;
            }
            .detail-tag-item {
              border: 1px solid @primary;
              border-radius: 6px;
              padding: 0 4px;
              margin-right: 4px;
            }
          }
          .detail-action {
            padding-top: 10px;
            /deep/ .weui-btn_mini {
              padding: 2px 10px;
            }
          }
        }
      }
      .detail-summary-wrapper {
        padding: 10px 0;
        .detail-summary {
          text-indent: 2em;
        }
      }
    }
  }
  .detail-recommend-wrapper {
    padding-top: 40px;
    .detail-recommend-book {
      padding: 10px 25px;
    }
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
}
</style>
