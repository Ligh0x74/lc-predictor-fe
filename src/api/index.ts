import request from '@/utils/request'
import type { contestPage, predictPage, predict } from './type'

// 接口管理
export const reqContestList = (params: contestPage) => {
  return request({
    url: `/contest/${params.pageIndex}/${params.pageSize}`,
    method: 'get',
  })
}

export const reqPredictList = (params: predictPage) => {
  return request({
    url: `/predict/${params.contestName}/${params.pageIndex}/${params.pageSize}`,
    method: 'get',
  })
}

export const reqPredict = (params: predict) => {
  return request({
    url: '/predict',
    method: 'get',
    params,
  })
}
