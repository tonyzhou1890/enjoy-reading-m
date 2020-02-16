import request from '@/utils/request'
import { ApiPrefix } from '@/utils/setting'

// store book list
export function getStoreBookList(data) {
  return request({
    url: `${ApiPrefix}/account/storeBookList`,
    method: 'post',
    data
  })
}
