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
    </el-form>
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
import { reqPredict, reqPredictList } from '@/api'
import router from '@/router'
import { ref, reactive, watch } from 'vue'
import { Search, Back } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const props = defineProps(['_contestName', '_pageIndex'])

// 预测列表
const total = ref(0)
const pageIndex = ref(Math.max(Number(props._pageIndex), 1))
const pageSize = 25
const predictList = ref([])

watch(
  pageIndex,
  (newValue, oldValue) => {
    if (oldValue) {
      router.push(`/predict/${props._contestName}/${pageIndex.value}`)
    }
    reqPredictList({
      contestName: props._contestName,
      pageIndex: pageIndex.value,
      pageSize,
    }).then((res) => {
      predictList.value = res.data.records
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
let predictListTmp: never[] | undefined

const back = () => {
  if (predictListTmp) {
    predictList.value = JSON.parse(JSON.stringify(predictListTmp))
    predictListTmp = undefined
  } else {
    router.push('/contest')
  }
}

const submit = async (formInstance: FormInstance | undefined) => {
  if (!formInstance) {
    return
  }
  await formInstance.validate((valid) => {
    if (valid) {
      reqPredict(form).then((res) => {
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
