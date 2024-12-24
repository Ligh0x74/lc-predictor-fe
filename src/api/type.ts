// 类型管理
export interface contestPage {
  pageIndex: number
  pageSize: number
}

export interface predictPage {
  contestName: string
  pageIndex: number
  pageSize: number
}

export interface predict {
  contestName: string
  dataRegion: string
  username: string
}

export interface userLogin {
  dataRegion: string
  username: string
}
