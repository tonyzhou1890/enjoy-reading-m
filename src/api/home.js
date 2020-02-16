import request from '@/utils/request'
import { ApiPrefix } from '@/utils/setting'

// bannerList
export function getBannerList() {
  return request({
    url: `${ApiPrefix}/banner/homeList`,
    method: 'post'
  })
}

// 标签列表
export function getTagList() {
  return request({
    url: `${ApiPrefix}/tag/list`,
    method: 'post'
  })
}

// 作者列表
export function getAuthorList() {
  return request({
    url: `${ApiPrefix}/author/list`,
    method: 'post'
  })
}

// 最新上架列表
export function getLatestList(data) {
  return request({
    url: `${ApiPrefix}/latest/list`,
    method: 'post',
    data
  })
}

// 打折书籍列表
export function getDiscountList(data) {
  return request({
    url: `${ApiPrefix}/discount/list`,
    method: 'post',
    data
  })
}

// 免费书籍列表
export function getFreeList(data) {
  return request({
    url: `${ApiPrefix}/free/list`,
    method: 'post',
    data
  })
}
