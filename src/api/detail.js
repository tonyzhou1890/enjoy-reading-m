import request from '@/utils/request'
import { ApiPrefix } from '@/utils/setting'

// book detail
export function getBookDetail(data) {
  return request({
    url: `${ApiPrefix}/book/detail`,
    method: 'post',
    data
  })
}

// book recmmend
export function getBookRecommend(data) {
  return request({
    url: `${ApiPrefix}/book/recommend`,
    method: 'post',
    data
  })
}
