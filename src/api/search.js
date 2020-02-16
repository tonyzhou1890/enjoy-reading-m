import request from '@/utils/request'
import { ApiPrefix } from '@/utils/setting'

// search book list
export function getSearchBookList(data) {
  return request({
    url: `${ApiPrefix}/searchBook/list`,
    method: 'post',
    data
  })
}
