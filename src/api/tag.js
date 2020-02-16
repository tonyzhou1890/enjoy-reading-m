import request from '@/utils/request'
import { ApiPrefix } from '@/utils/setting'

// tag book list
export function getTagBookList(data) {
  return request({
    url: `${ApiPrefix}/tagBook/list`,
    method: 'post',
    data
  })
}
