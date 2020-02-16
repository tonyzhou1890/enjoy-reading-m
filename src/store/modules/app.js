import { getTagList } from '@/api/home'
import { maxWidth } from '@/style/variables.less'
import Vue from 'vue'

const state = {
  device: 'mobile',
  tagList: [],
  // 版心宽度
  width: Number(maxWidth.split('px')[0]),
  // 注册中心地址
  registerPrefix: process.env.VUE_APP_REGISTER,
  // 资源网址
  storePrefix: process.env.VUE_APP_STORE,
  // 积分单位
  scoreUnit: '积分',
  // 阅读器地址
  reader: process.env.VUE_APP_READER,
  // 页面标题
  metaTitle: '',
  // 缓存的页面
  cacheViews: []
}

const mutations = {
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_DATA: (state, payload) => {
    Object.keys(payload).map(key => {
      state[key] = payload[key]
    })
  }
}

const actions = {
  // 改变设备类型
  toggleDevice ({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  // 获取标签列表
  getTagList ({ commit, state }) {
    getTagList()
      .then(res => {
        commit('SET_DATA', {
          tagList: res.data,
          hasGetTagList: true
        })
      })
      .catch(e => {
        // type 为 error 样式有问题。组件使用的单位是em，即使设置其font-size为16，依然有文本不垂直居中等问题
        // 修改为使用 vw 单位就没什么问题了
        Vue.$vux.toast.show({
          text: e.errorMsg || '获取标签列表失败',
          type: 'warn',
          // time: 600000,
          width: 'auto'
        })
        // Vue.$vux.toast.text(e.errorMsg || '获取标签列表失败')
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
