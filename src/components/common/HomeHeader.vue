<template>
  <div class="header">
    <el-button type="primary" text @click="home">Home</el-button>
    <el-switch
      v-model="isDark"
      :active-action-icon="Moon"
      :inactive-action-icon="Sunny"
      style="--el-switch-on-color: #39393a; --el-switch-off-color: #cfd3dc; margin-left: 10px"
      :change="dark()"
    />
    <el-text
      size="large"
      style="position: absolute; left: 0; right: 0; text-align: center; color: #ff9d14; z-index: -1"
    >
      LeetCode Predictor 🔥
    </el-text>
    <!-- 登录功能 -->
    <el-button
      type="primary"
      text
      style="position: relative; margin-left: auto"
      @click="formVisible = true"
      v-if="!user"
    >
      Login
    </el-button>
    <el-dialog v-model="formVisible" title="Login" width="500">
      <el-form ref="formRef" :model="form" :rules="rules" size="large">
        <el-form-item prop="dataRegion">
          <el-select v-model="form.dataRegion" style="width: 150px" placeholder="Data Region">
            <el-option label="CN" value="CN" />
            <el-option label="US" value="US" />
          </el-select>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="Username" clearable> </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="formVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submit(formRef)"> Confirm </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 用户信息 -->
    <div
      v-if="user"
      style="position: relative; margin-left: auto; display: flex; align-items: center"
    >
      <el-avatar :src="user.avatar" />
      <span style="margin: 0 10px 0 10px; color: #ff9d14">{{ user.nickname }}</span>
      <el-button type="primary" text @click="logout"> Logout </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reqUserLogin, reqUserLogout } from '@/api'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'

const home = () => {
  router.push('/contest')
}

// 暗黑模式
const isDark = ref(JSON.parse(localStorage.getItem('isDark') || 'true'))
const dark = () => {
  const html = document.documentElement
  html.className = isDark.value ? 'dark' : ''
  localStorage.setItem('isDark', JSON.stringify(isDark.value))
}

// 登录功能
const user = useUserStore().getUser()
const formVisible = ref(false)
interface Form {
  dataRegion: string
  username: string
}
const form = reactive<Form>({
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

const submit = async (formInstance: FormInstance | undefined) => {
  if (!formInstance) {
    return
  }
  await formInstance.validate((valid) => {
    if (valid) {
      reqUserLogin(form).then((res) => {
        if (!res.data) {
          ElMessage.error('Login Failed')
        } else {
          user.value = res.data
          localStorage.setItem('user', JSON.stringify(res.data))
          formVisible.value = false
        }
      })
    }
  })
}

const logout = () => {
  reqUserLogout()
  localStorage.removeItem('user')
  user.value = undefined
}
</script>

<style scoped>
.header {
  width: 100%;
  display: inline-flex;
  padding: 20px 0 20px 0;
}
</style>
