import request from '@/utils/request'
import { ApiPrefix } from '@/utils/setting'

// 改变书籍阅读信息
export function readingInfoUpdate(data) {
  return request({
    url: `${ApiPrefix}/book/readingInfoUpdate`,
    method: 'post',
    data
  })
}

// 供阅读器使用的 url
export const readingInfoUpdateUrl = `${process.env.VUE_APP_BASE_API}${ApiPrefix}/book/readingInfoUpdate`

// 获取书籍阅读信息
export function readingInfo(data) {
  return request({
    url: `${ApiPrefix}/book/readingInfo`,
    method: 'post',
    data
  })
}
