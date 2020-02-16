import request from '@/utils/request'
import { ApiPrefix } from '@/utils/setting'

// 用户信息
export function getInfo() {
  return request({
    url: `${ApiPrefix}/account/detail`,
    method: 'post'
  })
}

// 退出
export function logout() {
  return request({
    url: '/register/account/logout',
    method: 'post'
  })
}

// 登录奖励
export function loginScore() {
  return request({
    url: `${ApiPrefix}/account/loginScore`,
    method: 'post'
  })
}
