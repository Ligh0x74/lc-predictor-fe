import request from '@/utils/request'
import type { contestPage, predictPage } from './type'

// 接口管理
export const reqContestList = (param: contestPage) => {
  return request({
    url: `/contest/${param.pageIndex}/${param.pageSize}`,
    method: 'get',
  })
}

export const reqPredictList = (param: predictPage) => {
  return request({
    url: `/predict/${param.contestName}/${param.pageIndex}/${param.pageSize}`,
    method: 'get',
  })
}
