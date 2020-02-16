import request from '@/utils/request'
import { ApiPrefix } from '@/utils/setting'

// shelf book list
export function getShelfBookList(data) {
  return request({
    url: `${ApiPrefix}/account/shelfBookList`,
    method: 'post',
    data
  })
}
