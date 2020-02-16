import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home')
  },
  {
    path: '/book/detail/:name/:uuid',
    name: 'BookDetail',
    component: () => import('@/views/detail')
  },
  {
    path: '/latest',
    name: 'Latest',
    component: () => import('@/views/latest'),
    meta: {
      title: '最新上架',
      scroller: true, // 是否滚动列表
      keep: true, // 是否缓存组件
      keepTo: ['BookDetail'] // 进入哪些页面需要缓存
    }
  },
  {
    path: '/discount',
    name: 'Discount',
    component: () => import('@/views/discount'),
    meta: {
      title: '打折书籍',
      scroller: true, // 是否滚动列表
      keep: true, // 是否缓存组件
      keepTo: ['BookDetail'] // 进入哪些页面需要缓存
    }
  },
  {
    path: '/free',
    name: 'Free',
    component: () => import('@/views/free'),
    meta: {
      title: '免费书籍',
      scroller: true, // 是否滚动列表
      keep: true, // 是否缓存组件
      keepTo: ['BookDetail'] // 进入哪些页面需要缓存
    }
  },
  {
    path: '/search/:keyword',
    name: 'Search',
    component: () => import('@/views/search'),
    meta: {
      scroller: true, // 是否滚动列表
      keep: true, // 是否缓存组件
      keepTo: ['BookDetail'] // 进入哪些页面需要缓存
    }
  },
  {
    path: '/tag/:tag',
    name: 'Tag',
    component: () => import('@/views/tag'),
    meta: {
      scroller: true, // 是否滚动列表
      keep: true, // 是否缓存组件
      keepTo: ['BookDetail'] // 进入哪些页面需要缓存
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    meta: {
      title: '404'
    }
  }
]

export const asyncRoutes = [
  {
    path: '/baseInfo',
    name: 'BaseInfo',
    component: () => import('@/views/baseInfo'),
    meta: {
      title: '基本信息'
    }
  },
  {
    path: '/shelf',
    name: 'Shelf',
    component: () => import('@/views/shelf'),
    meta: {
      title: '书架'
    }
  },
  {
    path: '/store',
    name: 'Store',
    component: () => import('@/views/store'),
    meta: {
      scroller: true, // 是否滚动列表
      keep: true, // 是否缓存组件
      keepTo: ['BookDetail'], // 进入哪些页面需要缓存
      title: '书库'
    }
  },
  {
    path: '/scoreRecord',
    name: 'ScoreRecord',
    component: () => import('@/views/scoreRecord'),
    meta: {
      scroller: true, // 是否滚动列表
      title: '积分记录'
    }
  },
  {
    path: '/shoppingCart',
    name: 'ShoppingCart',
    component: () => import('@/views/shoppingCart'),
    meta: {
      scroller: true, // 是否滚动列表
      title: '购物车'
    }
  },
  {
    path: '*',
    redirect: '404'
  }
]

export default new Router({
  routes: [
    ...constantRoutes,
    ...asyncRoutes
  ],
  mode: 'history'
})
