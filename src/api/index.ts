import request from '@/utils/request'
import type { contestPage } from './type'

// 接口管理
export const reqContestList = (param: contestPage) => {
  return request({
    url: `/contest/${param.pageIndex}/${param.pageSize}`,
    method: 'get',
  })
}
