import request from '@/utils/request'

// bannerList
export function getScoreRecord(data) {
  return request({
    url: `/register/score/list`,
    method: 'post',
    data
  })
}
