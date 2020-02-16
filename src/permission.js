import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // determine whether the user has logged in
  const hasToken = getToken()
  const hasInfo = !!store.getters.userInfo

  // 获取用户信息
  if (hasToken) {
    // 已经有用户信息，直接下一步
    if (hasInfo) {
      next()
    } else {
      // 否则根据路由请求用户信息
      // 需要角色信息，则阻塞请求
      if (to.meta && to.meta.roles && to.meta.roles.length) {
        try {
          const userInfo = await store.dispatch('user/getInfo')
          if (to.meta.roles.includes(userInfo.roleStr)) {
            next()
          } else {
            next({ path: '/404' })
          }
        } catch (e) {
          next({ path: '/404' })
        }
      } else {
        // 否则，不阻塞请求
        store.dispatch('user/getInfo')
        next()
      }
    }
  } else {
    /* has no token*/
    // 需要角色信息，则跳转注册中心登录
    if (to.meta && to.meta.roles && to.meta.roles.length) {
      window.location.href = `${process.env.VUE_APP_REGISTER}/#/?from=${decodeURI(window.location.href)}`
    } else {
      next()
    }
  }

  // 获取标签列表
  // if (['Home'].includes(to.name)) {
  //   store.dispatch('app/getTagList')
  // }
})

router.afterEach((to, from) => {
  // finish progress bar
  NProgress.done()
  store.commit('app/SET_DATA', {
    metaTitle: to.meta && to.meta.title || '享阅'
  })
})
