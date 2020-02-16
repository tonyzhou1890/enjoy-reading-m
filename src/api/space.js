import request from '@/utils/request'
import { ApiPrefix } from '@/utils/setting'

// space book list
export function getSpaceBookList(data) {
  return request({
    url: `${ApiPrefix}/space/book/list`,
    method: 'post',
    data
  })
}

// space book add / update
export function spaceBookCreateOrUpdate(data) {
  return request({
    url: `${ApiPrefix}/space/book/createOrUpdate`,
    method: 'post',
    data
  })
}

// space book delete
export function spaceBookDelete(data) {
  return request({
    url: `${ApiPrefix}/space/book/delete`,
    method: 'post',
    data
  })
}
