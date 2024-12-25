import request from '@/utils/request'
import type { contestPage, predictPage, predict, userLogin } from './type'

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

export const reqUserLogin = (params: userLogin) => {
  return request({
    url: `/user/login/${params.dataRegion}/${params.username}`,
    method: 'post',
  })
}

export const reqUserLogout = () => {
  return request({
    url: `/user/logout`,
    method: 'post',
  })
}

export const reqFollowPredictList = (params: predictPage) => {
  return request({
    url: `/follow/${params.contestName}/${params.pageIndex}/${params.pageSize}`,
    method: 'get',
  })
}
