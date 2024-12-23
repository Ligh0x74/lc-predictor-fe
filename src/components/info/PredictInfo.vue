<template>
  <div class="layout">
    <!-- 预测列表 -->
    <el-table :data="predictList" border style="border-radius: 4px">
      <el-table-column label="排名" width="100">
        <template #default="scope">
          {{ '#' + scope.row.rank }}
        </template>
      </el-table-column>
      <el-table-column label="昵称">
        <template #default="scope">
          <div style="display: flex">
            <el-avatar :size="35" :src="scope.row.avatar" style="margin-right: 10px" />
            <el-button
              type="success"
              link
              @click="openLink(scope.row.dataRegion, scope.row.username)"
            >
              {{ scope.row.nickname }}
            </el-button>
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
import { reqPredictList } from '@/api'
import router from '@/router'
import { ref, reactive, watch } from 'vue'

const props = defineProps(['_contestName', '_pageIndex'])

const total = ref(0)
const pageIndex = ref(props._pageIndex === '' ? 1 : Number(props._pageIndex))
const pageSize = 25
const predictList = reactive([])

watch(
  pageIndex,
  () => {
    router.push(`/predict/${props._contestName}/${pageIndex.value}`)
    reqPredictList({
      contestName: props._contestName,
      pageIndex: pageIndex.value,
      pageSize,
    }).then((res) => {
      Object.assign(predictList, res.data.records)
      total.value = res.data.total
    })
  },
  { immediate: true },
)

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
