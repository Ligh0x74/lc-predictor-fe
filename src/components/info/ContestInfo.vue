<template>
  <div class="layout">
    <!-- 竞赛列表 -->
    <el-table :data="contestList" stripe border style="border-radius: 4px">
      <el-table-column width="100">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="竞赛记录">
        <template #default="scope">
          <el-button type="primary" link @click="toPredict(scope.row.contestName)">
            {{ convert(scope.row.contestName) }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="开始时间">
        <template #default="scope">
          {{ new Date(scope.row.startTime).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="预测时间">
        <template #default="scope">
          {{
            scope.row.predictTime === null ? '-' : new Date(scope.row.predictTime).toLocaleString()
          }}
        </template>
      </el-table-column>
      <el-table-column label="LCCN LINK">
        <template #default="scope">
          <el-button type="primary" link @click="openLink(scope.row.contestName)">
            <el-icon><Link /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="total"
      v-model:current-page="pageIndex"
    />
  </div>
</template>

<script setup lang="ts">
import { reqContestList } from '@/api'
import router from '@/router'
import { ref, watch } from 'vue'

// 竞赛列表
const total = ref(0)
const pageIndex = ref(1)
const pageSize = 10
const contestList = ref([])

watch(
  pageIndex,
  () => {
    reqContestList({
      pageIndex: pageIndex.value,
      pageSize,
    }).then((res) => {
      contestList.value = res.data.records
      total.value = res.data.total
    })
  },
  { immediate: true },
)

const convert = (contestName: string) => {
  const aux = contestName.split('-')
  let res = aux[0].charAt(0).toUpperCase() + aux[0].slice(1) + ' '
  res += aux[1].charAt(0).toUpperCase() + aux[1].slice(1) + ' '
  res += aux[2]
  return res
}

const toPredict = (contestName: string) => {
  router.push(`/predict/${contestName}`)
}

const openLink = (contestName: string) => {
  window.open(`https://leetcode.cn/contest/${contestName}/ranking/`, '_blank')
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
