import request from '@/utils/request'
import { ApiPrefix } from '@/utils/setting'

// 购物车列表
export function getShoppingCartList() {
  return request({
    url: `${ApiPrefix}/shoppingCart/list`,
    method: 'post'
  })
}

// 购物车新增
export function shoppingCartAdd(data) {
  return request({
    url: `${ApiPrefix}/shoppingCart/add`,
    method: 'post',
    data
  })
}

// 购物车移除
export function shoppingCartSubtract(data) {
  return request({
    url: `${ApiPrefix}/shoppingCart/subtract`,
    method: 'post',
    data
  })
}

// 购物车结算
export function shoppingCartSettle(data) {
  return request({
    url: `${ApiPrefix}/shoppingCart/settle`,
    method: 'post',
    data
  })
}

