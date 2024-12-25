import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

interface User {
  dataRegion: string
  username: string
  nickname: string
  avatar: string
}

// 存储用户数据
export const useUserStore = defineStore('user', () => {
  const user: Ref<User | undefined> = ref()
  function getUser() {
    if (!user.value) {
      const json = localStorage.getItem('user')
      user.value = json === null ? undefined : JSON.parse(json)
    }
    return user
  }
  return { getUser }
})
