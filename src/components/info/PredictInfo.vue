<template>
  <div class="layout">
    <!-- 查询表单 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      :rules="rules"
      size="large"
      style="width: 100%; display: flex; align-items: center; justify-content: center"
    >
      <el-form-item>
        <el-button :icon="Back" type="primary" size="large" @click="back" />
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model="form.username" style="width: 500px" placeholder="Username" clearable>
          <template #prepend>
            <el-form-item prop="dataRegion">
              <el-select v-model="form.dataRegion" style="width: 150px" placeholder="Data Region">
                <el-option label="CN" value="CN" />
                <el-option label="US" value="US" />
              </el-select>
            </el-form-item>
          </template>
          <template #append>
            <el-button :icon="Search" @click="submit(formRef)" />
          </template>
        </el-input>
      </el-form-item>
      <!-- 关注功能 -->
      <el-form-item label="Favs">
        <el-switch v-model="favs" :disabled="!user" />
      </el-form-item>
    </el-form>
    <!-- 预测列表 -->
    <el-table :data="predictList" border style="border-radius: 4px">
      <el-table-column label="排名" width="100">
        <template #default="scope">
          {{ '#' + scope.row.ranking }}
        </template>
      </el-table-column>
      <el-table-column label="昵称">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-avatar :size="35" :src="scope.row.avatar" style="margin-right: 10px" />
            <el-button
              type="success"
              link
              @click="openLink(scope.row.dataRegion, scope.row.username)"
            >
              {{ scope.row.nickname }}
            </el-button>
            <!-- 关注功能 -->
            <el-button
              type="warning"
              :icon="scope.row.isFollow ? StarFilled : Star"
              text
              size="large"
              style="margin-left: 5px; padding-left: 0"
              @click="follow(scope.row)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="旧分数">
        <template #default="scope">
          {{ round(scope.row.oldRating) }}
        </template>
      </el-table-column>
      <el-table-column label="DIFF">
        <template #default="scope">
          {{ round(scope.row.newRating - scope.row.oldRating) }}
        </template>
      </el-table-column>
      <el-table-column label="新分数">
        <template #default="scope">
          {{ round(scope.row.newRating) }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :pageSize="pageSize"
      :total="total"
      v-model:current-page="pageIndex"
    />
  </div>
</template>

<script setup lang="ts">
import { reqFollow, reqFollowPredictList, reqPredict, reqPredictList } from '@/api'
import { ref, reactive, watch, type Ref } from 'vue'
import { Search, Back, Star, StarFilled } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const props = defineProps(['_contestName'])

// 预测列表, 关注功能
interface Predict {
  dataRegion: string
  username: string
  nickname: string
  avatar: string
  rank: number
  attendedCount: number
  oldRating: number
  newRating: number
  isFollow: boolean
}
const total = ref(0)
const pageIndex = ref(1)
const pageSize = 25
const predictList: Ref<Predict[]> = ref([])
const favs: Ref<boolean> = ref(false)

const req = () => {
  // 显示关注用户
  if (favs.value) {
    reqFollowPredictList({
      contestName: props._contestName,
      pageIndex: pageIndex.value,
      pageSize,
    }).then((res) => {
      predictList.value = res.data.records
      total.value = res.data.total
    })
    return
  }
  // 显示全部用户
  reqPredictList({
    contestName: props._contestName,
    pageIndex: pageIndex.value,
    pageSize,
  }).then((res) => {
    predictList.value = res.data.records
    total.value = res.data.total
  })
}

watch(favs, () => {
  if (pageIndex.value === 1) {
    req()
  }
  pageIndex.value = 1
})

watch(
  pageIndex,
  () => {
    req()
  },
  { immediate: true },
)

// 对象需要导出才能 $subscribe 到
useUserStore().$subscribe(() => {
  // 如果用户退出登录, 且 favs 为 true, 则切换到 false
  // 此时会触发 watch 请求数据, 所以不需要手动发送请求
  if (!user.value && favs.value) {
    favs.value = false
    return
  }
  req()
})

const { user } = storeToRefs(useUserStore())
const follow = (row: Predict) => {
  // 如果用户未登录, 则不发送请求
  if (!user.value) {
    ElMessage('Please Login.')
    return
  }
  reqFollow({
    dataRegion: row.dataRegion,
    username: row.username,
    isFollow: !row.isFollow,
  }).then(() => {
    row.isFollow = !row.isFollow
  })
}

const round = (num: number) => {
  return (Math.round((num + Number.EPSILON) * 100) / 100).toFixed(2)
}

const openLink = (dataRegion: string, username: string) => {
  if (dataRegion === 'CN') {
    window.open(`https://leetcode.cn/u/${username}/`, '_blank')
  } else {
    window.open(`https://leetcode.com/u/${username}/`, '_blank')
  }
}

// 查询表单
interface Form {
  contestName: string
  dataRegion: string
  username: string
}
const form = reactive<Form>({
  contestName: props._contestName,
  dataRegion: '',
  username: '',
})
const rules = reactive<FormRules<Form>>({
  dataRegion: [
    {
      required: true,
      message: 'Please select data region',
      trigger: 'change',
    },
  ],
  username: [
    {
      required: true,
      message: 'Please input username',
      trigger: 'blur',
    },
  ],
})
const formRef = ref<FormInstance>()

let totalTmp: number
let predictListTmp: never[] | undefined

const back = () => {
  if (predictListTmp) {
    total.value = totalTmp
    predictList.value = JSON.parse(JSON.stringify(predictListTmp))
    predictListTmp = undefined
  }
}

const submit = async (formInstance: FormInstance | undefined) => {
  if (!formInstance) {
    return
  }
  await formInstance.validate((valid) => {
    if (valid) {
      reqPredict(form).then((res) => {
        totalTmp = total.value
        predictListTmp = JSON.parse(JSON.stringify(predictList.value))
        predictList.value.splice(0)
        if (!res.data) {
          total.value = 0
        } else {
          Object.assign(predictList.value, [res.data])
          total.value = 1
        }
      })
    }
  })
}
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 200px 0 200px;
}

.el-pagination {
  padding: 25px;
}
</style>
